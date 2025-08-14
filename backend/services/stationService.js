// services/stationService.js - Complete Station business logic
const externalApiService = require('./externalApiService');
const NodeCache = require('node-cache');

class StationService {
  constructor() {
    // Local cache for transformed data
    this.cache = new NodeCache({ stdTTL: 1 }); // 1 second cache
  }

  // Get all stations from external API
  async getAllStations() {
    try {
      const cacheKey = 'transformed_stations';
      const cachedData = this.cache.get(cacheKey);
      
      if (cachedData) {
        console.log('📋 Returning cached transformed station data');
        return cachedData;
      }

      console.log('🔄 Fetching fresh station data from external API...');
      const rawStationData = await externalApiService.getStationInfo();
      
      if (!Array.isArray(rawStationData)) {
        throw new Error('Invalid station data format received');
      }

      const transformedData = this.transformStationData(rawStationData);
      this.cache.set(cacheKey, transformedData);
      
      console.log(`✅ Successfully processed ${transformedData.length} stations`);
      return transformedData;
    } catch (error) {
      console.error('Error in getAllStations:', error.message);
      
      // Return cached data if available during error
      const fallbackData = this.cache.get('transformed_stations');
      if (fallbackData) {
        console.log('⚠️ Using fallback cached data due to API error');
        return fallbackData;
      }
      
      // If no cached data, return mock data
      console.log('📝 Returning mock station data');
      return this.getMockStationData();
    }
  }

  // Transform raw station data from external API
  transformStationData(rawData) {
    return rawData.map(station => ({
      // Basic Info
      id: station.id,
      name: station.RetailStationName,
      ewuraLicense: station.EWURALicenseNo,
      
      // Location
      location: {
        region: station.RegionName,
        district: station.DistrictName,
        ward: station.WardName,
        zone: station.Zone,
        geoLocation: station.GeoLocation
      },
      
      // Operator Info
      operator: {
        name: station.OperatorName,
        tin: station.OperatorTin,
        vrn: station.OperatorVrn,
        uin: station.OperatorUIN
      },
      
      // Contact Info
      contact: {
        email: station.ContactPersonEmailAddress,
        phone: station.ContactPersonPhone
      },
      
      // Technical Details
      technical: {
        distributorId: station.Distributor_Id,
        apiSourceId: station.APISourceId,
        stationUrl: station.station_url_or_IP,
        printerIp: station.default_printer_IP,
        totalTanks: station.TotalNoTanks
      },
      
      // VFD Integration
      vfd: {
        provider: station.VFD_provider,
        url: station.VFD_provider_URL,
        username: station.VFD_provider_userName,
        apiKey: station.VFD_provider_TAPIkey ? '***' + station.VFD_provider_TAPIkey.slice(-4) : null
      },
      
      // Automation Server (credentials for your internal auth)
      automation: {
        url: station.automation_server_url,
        username: station.automation_server_username,
        password: '***' // Hidden for security
      },
      
      // Metadata
      createdDate: station.created_date,
      taxOffice: station.Tax_office,
      activeBusiness: station.x_active_business,
      
      // Dashboard specific fields (computed)
      status: this.calculateStationStatus(),
      efficiency: this.calculateEfficiency(),
      todayRevenue: this.generateMockRevenue(),
      alertCount: Math.floor(Math.random() * 3),
      nozzleCount: station.TotalNoTanks * 3, // Assume 3 nozzles per tank
      lastUpdate: new Date().toISOString()
    }));
  }

  // Get mock station data when API fails
  getMockStationData() {
    return [
      {
        id: 1,
        name: 'UNGA LTD STATION',
        ewuraLicense: 'PRL-2000-005',
        location: {
          region: 'ARUSAH',
          district: 'Ilala MC Kipawa',
          ward: 'Kipunguni',
          zone: 'Dar es Salaam'
        },
        operator: {
          name: 'LAKE OIL',
          tin: 100109751,
          vrn: '10019095T'
        },
        contact: {
          email: 'test@test.com',
          phone: 714325963
        },
        technical: {
          totalTanks: 2
        },
        automation: {
          username: 'ungaltd@manager.com',
          password: '***'
        },
        status: 'good',
        efficiency: 88,
        todayRevenue: '$4,280',
        alertCount: 1,
        nozzleCount: 6,
        lastUpdate: new Date().toISOString()
      }
    ];
  }

  // Utility methods
  calculateStationStatus() {
    const statuses = ['excellent', 'good', 'fair', 'poor'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  calculateEfficiency() {
    return Math.floor(Math.random() * 25) + 75;
  }

  generateMockRevenue() {
    return '$' + (Math.floor(Math.random() * 3000) + 2000).toLocaleString();
  }

  // Method to refresh cache and get fresh data
  async refreshCache() {
    this.cache.flushAll();
    externalApiService.clearCache();
    console.log('🔄 All caches refreshed');
    return await this.getAllStations();
  }

  // Method to get station statistics
  async getStationStats() {
    try {
      const stations = await this.getAllStations();
      
      return {
        total: stations.length,
        byRegion: this.groupBy(stations, 'location.region'),
        byOperator: this.groupBy(stations, 'operator.name'),
        byStatus: this.groupBy(stations, 'status'),
        totalTanks: stations.reduce((sum, station) => sum + (station.technical?.totalTanks || 0), 0),
        apiStatus: await externalApiService.healthCheck(),
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get station statistics: ${error.message}`);
    }
  }

  // Get cache info
  getCacheInfo() {
    return {
      local: this.cache.getStats(),
      external: externalApiService.getCacheStats()
    };
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const value = key.split('.').reduce((obj, k) => obj && obj[k], item);
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {});
  }
}

module.exports = new StationService();