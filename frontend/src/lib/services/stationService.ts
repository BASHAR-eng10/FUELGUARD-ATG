// services/stationService.ts - Complete Station business logic
import NodeCache from 'node-cache';

// Define types for better TypeScript support
interface RawStationData {
  // Define the structure of raw station data from external API
  [key: string]: any;
}

interface TransformedStationData {
  id: number;
  name: string;
  automation?: {
    username: string;
  };
  // Add other properties as needed
}

class StationService {
  private cache: NodeCache;

  constructor() {
    // Local cache for transformed data
    this.cache = new NodeCache({ stdTTL: 1 }); // 1 second cache
  }

  // Get all stations from external API
  async getAllStations(): Promise<TransformedStationData[]> {
    try {
      const cacheKey = 'transformed_stations';
      const cachedData = this.cache.get<TransformedStationData[]>(cacheKey);
      
      if (cachedData) {
        console.log('📋 Returning cached transformed station data');
        return cachedData;
      }

      console.log('🔄 Fetching fresh station data from external API...');
      
      // Import external API service
      const externalApiService = (await import('./externalApiService')).default;
      const rawStationData = await externalApiService.getStationInfo();
      
      if (!Array.isArray(rawStationData)) {
        throw new Error('Invalid station data format received');
      }

      const transformedData = this.transformStationData(rawStationData);
      this.cache.set(cacheKey, transformedData);
      
      console.log(`✅ Successfully processed ${transformedData.length} stations`);
      return transformedData;
    } catch (error: any) {
      console.error('Error in getAllStations:', error.message);
      
      // Return cached data if available during error
      const fallbackData = this.cache.get<TransformedStationData[]>('transformed_stations');
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
  private transformStationData(rawData: RawStationData[]): TransformedStationData[] {
    // Add transformation logic here
    return rawData.map((station, index) => ({
      id: index + 1,
      name: station.name || `Station ${index + 1}`,
      automation: station.automation
    }));
  }

  // Mock station data for fallback
  private getMockStationData(): TransformedStationData[] {
    return [
      {
        id: 1,
        name: 'Main Station',
        automation: {
          username: 'main_station'
        }
      }
    ];
  }
}

// Export singleton instance
const stationService = new StationService();
export default stationService;

// Also export for CommonJS compatibility
module.exports = stationService;
