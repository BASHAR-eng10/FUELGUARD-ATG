// services/externalApiService.js - Complete External API Service
const axios = require('axios');
const NodeCache = require('node-cache');

class ExternalApiService {
  constructor() {
    this.baseURL = process.env.EXTERNAL_API_URL || 'http://78.189.54.28:3800';
    this.email = process.env.EXTERNAL_API_EMAIL;
    this.password = process.env.EXTERNAL_API_PASSWORD;
    
    // Cache for tokens and data
    this.cache = new NodeCache({ 
      stdTTL: 3600, // 1 hour for tokens
      checkperiod: 120 
    });
    
    // Separate cache for API data (shorter TTL)
    this.dataCache = new NodeCache({ 
      stdTTL: 300, // 5 minutes for data
      checkperiod: 60 
    });

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add auth token to requests automatically
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Skip auth for login endpoint
        if (config.url === '/auth/login') {
          console.log(`🔐 API Request (Login): ${config.method?.toUpperCase()} ${config.url}`);
          return config;
        }

        // Get and add auth token for other endpoints
        try {
          const token = await this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('Failed to get auth token for request:', error.message);
        }
        
        console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url} ${token}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle responses and token expiration
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.message);
        
        // If token expired (401), clear cache and retry once
        if (error.response?.status === 401 && !error.config._retry) {
          console.log('🔄 Token expired, attempting to refresh...');
          this.cache.del('auth_token');
          error.config._retry = true;
          
          try {
            const newToken = await this.getAuthToken();
            if (newToken) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance.request(error.config);
            }
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError.message);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Get authentication token (cached) - UPDATED VERSION
  async getAuthToken() {
    try {
      // Check cache first
      const cachedToken = this.cache.get('auth_token');
      if (cachedToken) {
        console.log('🔑 Using cached auth token');
        return cachedToken;
      }

      // Check if credentials are available
      if (!this.email || !this.password) {
        throw new Error('External API credentials not configured');
      }

      // Login to get new token
      console.log('🔐 Authenticating with external API...');
      const response = await this.axiosInstance.post('/auth/login', {
        email: this.email,
        password: this.password
      });

      console.log('🔍 Auth response structure:', JSON.stringify(response.data, null, 2));

      // Handle different token response formats
      let token = null;
      
      if (response.data && response.data.data && response.data.data.access_token) {
        token = response.data.data.access_token;
      } else if (response.data && response.data.data && response.data.data.token) {
        token = response.data.data.token;
      } else if (response.data && response.data.access_token) {
        token = response.data.access_token;
      } else if (response.data && response.data.token) {
        token = response.data.token;
      }

      if (token) {
        // Cache token for 50 minutes (assuming 1 hour expiry)
        this.cache.set('auth_token', token, 3000);
        console.log('✅ Authentication successful, token cached');
        return token;
      }

      throw new Error('No valid token found in authentication response');
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      throw new Error(`Failed to authenticate with external API: ${error.message}`);
    }
  }

  // Check if external API is accessible
  async healthCheck() {
    try {
      if (!this.email || !this.password) {
        return {
          status: 'not_configured',
          message: 'External API credentials not configured',
          timestamp: new Date().toISOString()
        };
      }

      // Try to get auth token
      await this.getAuthToken();
      return {
        status: 'connected',
        message: 'External API is accessible and authenticated',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get all stations data
  async getStationInfo() {
    try {
      const cacheKey = 'station_info_all';
      const cachedData = this.dataCache.get(cacheKey);
      
      if (cachedData) {
        console.log('📋 Returning cached station info');
        return cachedData;
      }

      const response = await this.axiosInstance.get('/stationinfo/all');
			console.log('🔍 Station info response structure:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.data) {
        this.dataCache.set(cacheKey, response.data.data);
        return response.data.data;
      }
      
      throw new Error('Invalid response format from stationinfo API');
    } catch (error) {
      console.error('Error fetching station info:', error.message);
      throw new Error(`Failed to fetch station info: ${error.message}`);
    }
  }

  // Clear all caches
  clearCache() {
    this.cache.flushAll();
    this.dataCache.flushAll();
    console.log('🗑️ All caches cleared');
  }

  // Get cache statistics
  getCacheStats() {
    return {
      authCache: this.cache.getStats(),
      dataCache: this.dataCache.getStats(),
      authKeys: this.cache.keys(),
      dataKeys: this.dataCache.keys()
    };
  }
}

module.exports = new ExternalApiService();