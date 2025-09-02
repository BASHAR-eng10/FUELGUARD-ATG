// src/services/api.js - Frontend API service
import { getSession } from "next-auth/react";

class ApiService {
  constructor() {
    // NextAuth handles tokens via sessions, no need for manual token storage
  }

  async getAuthHeaders() {
    const session = await getSession();
    if (session?.accessToken) {
      return {
        Authorization: session.accessToken,
        "Content-Type": "application/json",
      };
    }
    return {
      "Content-Type": "application/json",
    };
  }

  async request(endpoint, options = {}) {
    const url = `http://server.oktin.ak4tek.com:3950${endpoint}`;

    // Get auth headers with NextAuth session
    const authHeaders = await this.getAuthHeaders();

    const config = {
      headers: {
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${options.method || "GET"} ${url}`);

      const response = await fetch(url, config);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Non-JSON response:", text);
        throw new Error(`Expected JSON response, got: ${contentType}`);
      }
      const data = await response.json();
      console.log("📦 Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log(`✅ API Response: ${response.status} ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${error.message}`);

      // Handle auth errors - redirect handled by NextAuth middleware
      if (
        error.message.includes("Invalid token") ||
        error.message.includes("Token expired")
      ) {
        // NextAuth will handle redirection via middleware
        window.location.href = "/signin";
        return;
      }

      throw error;
    }
  }
  // ===================================================================
  // Add this method to your existing lib/services/api.js file:
  // ===================================================================

  // Add to your ApiService class:
  async getStationDailyReport(license) {
    console.log(`api js`, license);

    return this.request(`/daily_report/EWURA_LC`, {
      method: "POST",
      body: JSON.stringify({ EWURA_LC: license }),
    });
  }
  async getCurrentUser() {
    const session = await getSession();
    return session?.user || null;
  }

  async isAuthenticated() {
    const session = await getSession();
    return !!session;
  }

  // Station methods
  async getAllStations() {
    return this.request("/stationinfo/all");
  }

  async getStation(id) {
    return this.request(`/stationinfo/${id}`);
  }

  // getAllStations() {
  // 	return this.request("/stationinfo/all");
  // }
  async getAlerts(id) {
    return this.request(`/stations/${id}/alerts`);
  }

  async getAllAlerts() {
    return this.request("/general/alerts");
  }

  async getCurrentCashEntry(id) {
    return this.request(`/stations/${id}/cash`);
  }

  async updateCurrentCashEntry(id, actualReading, manualReading) {
    return this.request(`/stations/${id}/cash`, {
      method: "POST", //TODO: set to PUT
      body: JSON.stringify({ actualReading, manualReading }),
    });
  }

  async getStationById(id) {
    return this.request(`/stations/${id}`);
  }

  // Pump/Nozzle methods
  async getStationPumps() {
    return this.request("/station/pumps");
  }

  // tank methods
  async getStationTanks(license) {
    console.log(`api js`, license);

    return this.request(`/ak4tek/tanks/EWURA_LC`, {
      method: "POST",
      body: JSON.stringify({ EWURA_LC: license }),
    });
  }

  async getAllStationTanks() {
    return this.request("/stations/tanks");
  }

  // Dashboard methods
  async getDashboardOverview() {
    return this.request("/dashboard/overview");
  }

  async getStationDashboard(id) {
    return this.request(`/dashboard/station/${id}`);
  }
}

export default new ApiService();
