// "use server"
// services/externalApiService.ts - Server-side External API Service with persistent token storage
import { unstable_cache } from 'next/cache'

interface AuthData {
  data?: {
    access_token?: string;
    token?: string;
  };
  access_token?: string;
  token?: string;
}

interface ManualCashEntry {
  id?: string;
  stationId: string;
  amount: number;
  hasAlert: boolean;
  alert?: string | null;
  date: Date;
}

// Configuration
const baseURL = process.env.EXTERNAL_API_URL || 'http://server.oktin.ak4tek.com:3950';
const email = process.env.EXTERNAL_API_EMAIL;
const password = process.env.EXTERNAL_API_PASSWORD;

// Cache key for the auth token
const AUTH_TOKEN_CACHE_KEY = 'external-api-auth-token';
const TOKEN_EXPIRY_MINUTES = 50; // 50 minutes (assuming 1 hour token expiry)

// In-memory storage for tokens and cash entries
const tokenCache = new Map<string, { token: string; expires: Date }>();
const manualCashEntriesCache = new Map<string, ManualCashEntry[]>();

// Store token in memory cache for persistence
async function storeTokenInCache(token: string, expiresAt: Date) {
  try {
    tokenCache.set(AUTH_TOKEN_CACHE_KEY, {
      token: token,
      expires: expiresAt
    });
    console.log('🗄️ Token stored in memory cache');
  } catch (error) {
    console.warn('Failed to store token in cache:', error);
    // Non-fatal error, we can continue without cache storage
  }
}

export async function getStationDailyReportByLicense(ewuraLicense: string) {
  try {
    console.log(`📊 Fetching daily report for EWURA license: ${ewuraLicense}`);
    
    const data = await makeRequest(`/daily_report/${ewuraLicense}`, {
      method: 'GET'
    }, { revalidate: 1800 }); // Cache for 30 minutes
    
    console.log(`✅ Daily report fetched for license ${ewuraLicense}`);
    return data;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching daily report:', errorMessage);
    throw new Error(`Failed to fetch daily report: ${errorMessage}`);
  }
}

// Get token from memory cache
async function getTokenFromCache(): Promise<{ token: string; expires: Date } | null> {
  try {
    const result = tokenCache.get(AUTH_TOKEN_CACHE_KEY);
    
    if (result && result.expires > new Date()) {
      console.log('🗄️ Token retrieved from memory cache');
      return result;
    }
    
    // Remove expired token
    if (result) {
      tokenCache.delete(AUTH_TOKEN_CACHE_KEY);
    }
  } catch (error) {
    console.warn('Failed to get token from cache:', error);
  }
  
  return null;
}

// Login function to get fresh token
async function login(): Promise<string> {
  const response = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store' // Never cache login requests
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }

  const data: AuthData = await response.json();
  // console.log('🔍 Auth response structure:', JSON.stringify(data, null, 2));

  let token: string | null = null;
  
  if (data?.data?.access_token) {
    token = data.data.access_token;
  } else if (data?.data?.token) {
    token = data.data.token;
  } else if (data?.access_token) {
    token = data.access_token;
  } else if (data?.token) {
    token = data.token;
  }

  if (!token) {
    throw new Error('No valid token found in authentication response');
  }

  // Store token in cache for persistence
  const expiresAt = new Date(Date.now() + (TOKEN_EXPIRY_MINUTES * 60 * 1000));
  await storeTokenInCache(token, expiresAt);

  return token;
}

// Cached function to get auth token - uses Next.js caching
const getCachedAuthToken = unstable_cache(
  async (): Promise<string> => {
    console.log('🔐 Authenticating with external API (cache miss)...');
    
    if (!email || !password) {
      throw new Error('External API credentials not configured');
    }

    return await login();
  },
  [AUTH_TOKEN_CACHE_KEY],
  {
    revalidate: TOKEN_EXPIRY_MINUTES * 60, // 50 minutes in seconds
    tags: ['external-api-auth']
  }
);

// Helper function to get authentication token with fallbacks
async function getAuthToken(): Promise<string> {
  try {
    // First try: Check cache for existing valid token
    const cachedToken = await getTokenFromCache();
    if (cachedToken && cachedToken.expires > new Date()) {
      console.log('🔑 Using token from cache');
      return cachedToken.token;
    }

    // Second try: Use Next.js cached function (will fetch new token if cache miss)
    console.log('🔄 Fetching token via Next.js cache...');
    return await getCachedAuthToken();
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Authentication failed:', errorMessage);
    throw new Error(`Failed to authenticate with external API: ${errorMessage}`);
  }
}

// Helper function to make authenticated requests
async function makeRequest(
  endpoint: string, 
  options: RequestInit = {}, 
  cacheOptions?: { revalidate?: number }
) {
  const token = await getAuthToken();
  
  const url = `${baseURL}${endpoint}`;
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    next: {
      revalidate: cacheOptions?.revalidate || 300, // 5 minutes default
    }
  };

  console.log(`📡 API Request: ${options.method || 'GET'} ${endpoint}`);
  
  try {
    const response = await fetch(url, fetchOptions);
    
    console.log(`✅ API Response: ${response.status} ${endpoint}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('🔄 Token expired, clearing cache...');
        await clearAuthCache();
        throw new Error('Token expired');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    throw error;
  }
}

// Clear authentication cache from memory and Next.js cache
async function clearAuthCache() {
  try {
    // Clear from memory cache
    tokenCache.delete(AUTH_TOKEN_CACHE_KEY);
    console.log('🗑️ Token removed from memory cache');
  } catch (error) {
    console.warn('Failed to clear token from cache:', error);
  }
  
  // Clear Next.js cache using revalidateTag
  try {
    const { revalidateTag } = await import('next/cache');
    revalidateTag('external-api-auth');
    console.log('🗑️ Next.js auth cache cleared');
  } catch (error) {
    console.warn('Failed to clear Next.js cache:', error);
  }
}

// Public API functions
export async function healthCheck() {
  try {
    if (!email || !password) {
      return {
        status: 'not_configured',
        message: 'External API credentials not configured',
        timestamp: new Date().toISOString()
      };
    }

    await getAuthToken();
    return {
      status: 'connected',
      message: 'External API is accessible and authenticated',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      message: errorMessage,
      timestamp: new Date().toISOString()
    };
  }
}

export async function getTankInfo() {
  try {
    console.log('🔍 Fetching tank info...');
    
    const data = await makeRequest('/ak4tek/tanks/', {
      method: 'GET'
    }, { revalidate: 300 });

    // console.log('🔍 Tank info response structure:', JSON.stringify(data, null, 2));

    if (data?.data) {
      return data.data;
    }

    throw new Error('Invalid response format from tankinfo API');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching tank info:', errorMessage);
    throw new Error(`Failed to fetch tank info: ${errorMessage}`);
  }
}

export async function getStationInfo() {
  try {
    console.log('🔍 Fetching station info...');
    
    const data = await makeRequest('/stationinfo/all', {
      method: 'GET'
    }, { revalidate: 300 });

    // console.log('🔍 Station info response structure:', JSON.stringify(data, null, 2));

    if (data?.data) {
      return data.data;
    }
    
    throw new Error('Invalid response format from stationinfo API');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching station info:', errorMessage);
    throw new Error(`Failed to fetch station info: ${errorMessage}`);
  }
}

export async function clearCache() {
  await clearAuthCache();
  console.log('🗑️ All auth caches cleared');
}

export async function getCacheStats() {
  try {
    const cachedToken = await getTokenFromCache();
    return {
      tokenInCache: !!cachedToken,
      tokenExpires: cachedToken?.expires,
      tokenValid: cachedToken ? cachedToken.expires > new Date() : false
    };
  } catch (error) {
    return {
      tokenInCache: false,
      tokenExpires: null,
      tokenValid: false,
      error: 'Failed to check cache stats'
    };
  }
}

// Manual Cash Entries functions - using in-memory storage
export async function getCurrentManualCashEntries(stationId: string) {
  // Fetch the most recent manual cash entry for a specific station
  const entries = manualCashEntriesCache.get(stationId) || [];
  const sortedEntries = entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  if (sortedEntries.length > 0) {
    return sortedEntries[0];
  }
  throw new Error('No manual cash entry found for the specified station');
}

export async function getAllAlerts() {
  // Fetch alerts from all stations
  const allAlerts: ManualCashEntry[] = [];
  
  for (const entries of manualCashEntriesCache.values()) {
    const alertEntries = entries.filter(entry => entry.hasAlert);
    allAlerts.push(...alertEntries);
  }
  
  // Sort by date descending
  return allAlerts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getAlerts(stationId: string) {
  // Fetch alerts for a specific station
  const entries = manualCashEntriesCache.get(stationId) || [];
  const alerts = entries.filter(entry => entry.hasAlert);
  
  // Sort by date descending
  return alerts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function updateCurrentManualCashEntries(stationId: string, actualReading: number, manualReading: number) {
  // Validate the stationId
  if (!stationId) {
    throw new Error('Invalid station ID');
  }

  const hasAlert = (actualReading - manualReading) / actualReading > 0.01;
  const newEntry: ManualCashEntry = {
    id: `${stationId}_${Date.now()}`, // Simple ID generation
    stationId: stationId,
    amount: manualReading,
    hasAlert: hasAlert,
    alert: hasAlert ? `Manual cash entry for station ${stationId} has changed by ${(actualReading - manualReading).toFixed(2)}` : null,
    date: new Date()
  };

  // Get existing entries or create new array
  const existingEntries = manualCashEntriesCache.get(stationId) || [];
  existingEntries.push(newEntry);
  
  // Keep only the last 100 entries per station to prevent memory bloat
  if (existingEntries.length > 100) {
    existingEntries.splice(0, existingEntries.length - 100);
  }
  
  manualCashEntriesCache.set(stationId, existingEntries);
}

// Default export for backward compatibility
const externalApiService = {
  healthCheck,
  getTankInfo,
  getStationInfo,
  clearCache,
  getCacheStats
};

export default externalApiService;