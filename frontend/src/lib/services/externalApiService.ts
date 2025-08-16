// "use server"
// services/externalApiService.ts - Server-side External API Service with persistent token storage
import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma'

interface AuthData {
  data?: {
    access_token?: string;
    token?: string;
  };
  access_token?: string;
  token?: string;
}

// Configuration
const baseURL = process.env.EXTERNAL_API_URL || 'http://78.189.54.28:3800';
const email = process.env.EXTERNAL_API_EMAIL;
const password = process.env.EXTERNAL_API_PASSWORD;

// Cache key for the auth token
const AUTH_TOKEN_CACHE_KEY = 'external-api-auth-token';
const TOKEN_EXPIRY_MINUTES = 50; // 50 minutes (assuming 1 hour token expiry)

// Store token in database for persistence across serverless invocations
async function storeTokenInDB(token: string, expiresAt: Date) {
  try {
    await prisma.systemCache.upsert({
      where: { key: AUTH_TOKEN_CACHE_KEY },
      update: {
        value: token,
        expires_at: expiresAt,
        updated_at: new Date()
      },
      create: {
        key: AUTH_TOKEN_CACHE_KEY,
        value: token,
        expires_at: expiresAt
      }
    });
    console.log('🗄️ Token stored in database');
  } catch (error) {
    console.warn('Failed to store token in database:', error);
    // Non-fatal error, we can continue without DB storage
  }
}

// Get token from database
async function getTokenFromDB(): Promise<{ token: string; expires: Date } | null> {
  try {
    const result = await prisma.systemCache.findUnique({
      where: { 
        key: AUTH_TOKEN_CACHE_KEY,
      },
      select: {
        value: true,
        expires_at: true
      }
    });
    
    if (result && result.expires_at && result.expires_at > new Date()) {
      console.log('🗄️ Token retrieved from database');
      return {
        token: result.value,
        expires: result.expires_at
      };
    }
  } catch (error) {
    console.warn('Failed to get token from database:', error);
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
  console.log('🔍 Auth response structure:', JSON.stringify(data, null, 2));

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

  // Store token in database for persistence
  const expiresAt = new Date(Date.now() + (TOKEN_EXPIRY_MINUTES * 60 * 1000));
  await storeTokenInDB(token, expiresAt);

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
    // First try: Check database for existing valid token
    const dbToken = await getTokenFromDB();
    if (dbToken && dbToken.expires > new Date()) {
      console.log('🔑 Using token from database');
      return dbToken.token;
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
        console.log('🔄 Token expired, clearing cache and database...');
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

// Clear authentication cache from database and Next.js cache
async function clearAuthCache() {
  try {
    // Clear from database
    await prisma.systemCache.deleteMany({
      where: { key: AUTH_TOKEN_CACHE_KEY }
    });
    console.log('🗑️ Token removed from database');
  } catch (error) {
    console.warn('Failed to clear token from database:', error);
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

    console.log('🔍 Tank info response structure:', JSON.stringify(data, null, 2));

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

    console.log('🔍 Station info response structure:', JSON.stringify(data, null, 2));

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
    const dbToken = await getTokenFromDB();
    return {
      tokenInDB: !!dbToken,
      tokenExpires: dbToken?.expires,
      tokenValid: dbToken ? dbToken.expires > new Date() : false
    };
  } catch (error) {
    return {
      tokenInDB: false,
      tokenExpires: null,
      tokenValid: false,
      error: 'Failed to check cache stats'
    };
  }
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

// CommonJS compatibility
module.exports = externalApiService;