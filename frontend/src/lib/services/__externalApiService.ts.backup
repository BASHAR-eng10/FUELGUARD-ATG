// "use server"
// services/externalApiService.ts - Server-side External API Service with in-memory token storage
import { unstable_cache } from 'next/cache'

interface AuthData {
  data?: {
    access_token?: string;
    token?: string;
  };
  access_token?: string;
  token?: string;
}

// Configuration
const baseURL = process.env.EXTERNAL_API_URL || 'http://server.oktin.ak4tek.com:3950';
const email = process.env.EXTERNAL_API_EMAIL;
const password = process.env.EXTERNAL_API_PASSWORD;

// Cache key for the auth token
const AUTH_TOKEN_CACHE_KEY = 'external-api-auth-token';
const TOKEN_EXPIRY_MINUTES = 50; // 50 minutes (assuming 1 hour token expiry)

// In-memory token storage (will reset on server restart)
let tokenCache: { token: string; expires: Date } | null = null;

// Store token in memory
function storeTokenInMemory(token: string, expiresAt: Date) {
  tokenCache = { token, expires: expiresAt };
  console.log('🗄️ Token stored in memory');
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

// Get token from memory
function getTokenFromMemory(): { token: string; expires: Date } | null {
  if (tokenCache && tokenCache.expires > new Date()) {
    console.log('🗄️ Token retrieved from memory');
    return tokenCache;
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

  // Store token in memory
  const expiresAt = new Date(Date.now() + (TOKEN_EXPIRY_MINUTES * 60 * 1000));
  storeTokenInMemory(token, expiresAt);

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
    // First try: Check memory for existing valid token
    const memoryToken = getTokenFromMemory();
    if (memoryToken && memoryToken.expires > new Date()) {
      console.log('🔑 Using token from memory');
      return memoryToken.token;
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
  // Clear from memory
  tokenCache = null;
  console.log('🗑️ Token removed from memory');
  
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
  const memoryToken = getTokenFromMemory();
  return {
    tokenInMemory: !!memoryToken,
    tokenExpires: memoryToken?.expires,
    tokenValid: memoryToken ? memoryToken.expires > new Date() : false
  };
}

// Simplified functions without database dependency
export async function getCurrentManualCashEntries(stationId: string) {
  // Since there's no database, return mock data or throw error
  throw new Error('Manual cash entries require database functionality - feature disabled');
}

export async function getAllAlerts() {
  // Since there's no database, return empty array
  return [];
}

export async function getAlerts(stationId: string) {
  // Since there's no database, return empty array
  return [];
}

export async function updateCurrentManualCashEntries(stationId: string, actualReading: number, manualReading: number) {
  // Since there's no database, log the action but don't persist
  console.log(`Manual cash entry update for station ${stationId}: actual=${actualReading}, manual=${manualReading}`);
  console.warn('Manual cash entries are not persisted without database');
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