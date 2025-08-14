// src/services/api.js - Frontend API service
class ApiService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    this.token = null;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

	getToken() {
		// fetch token from local storage
		if (typeof window !== 'undefined') {
			this.token = localStorage.getItem('auth_token');
		}
		return this.token;
	}

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log(`✅ API Response: ${response.status} ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${error.message}`);
      
      // Handle token expiration
      if (error.message.includes('Invalid token') || error.message.includes('Token expired')) {
        this.clearToken();
        window.location.href = '/signin';
        return;
      }
      
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  // Station methods
  async getAllStations() {
    return this.request('/stations');
  }

	// getAllStations() {
	// 	return this.request("/stationinfo/all");
	// }

  async getStationById(id) {
    return this.request(`/stations/${id}`);
  }

  // Pump/Nozzle methods
  async getStationPumps() {
    return this.request('/stations/pumps');
  }

  // Dashboard methods
  async getDashboardOverview() {
    return this.request('/dashboard/overview');
  }

  async getStationDashboard(id) {
    return this.request(`/dashboard/station/${id}`);
  }
}

export default new ApiService();