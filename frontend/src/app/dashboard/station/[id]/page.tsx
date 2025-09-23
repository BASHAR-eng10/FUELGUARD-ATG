"use client";

import { useState, useEffect, use, useMemo, useCallback } from "react";
import {
  Shield,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import apiService from "../../../../lib/services/api";
import { useAuth } from "@/lib/hooks/useAuth";

interface StationData {
  id: number;
  name: string;
  location: string;
  region?: string;
  zone?: string;
  operatorName?: string;
  contactEmail?: string;
  contactPhone?: number;
  ewuraLicense?: string;
  tanks: number;
  username?: string;
  password?: string;
  LicenseeTraSerialNo?: string;
}

interface TankData {
  id: number;
  probe_id: string;
  date: string;
  updated_at: string;
  tank_id: string;
  tank_name: string;
  physical_id: string;
  identification_code: string;
  product_name: string;
  tank_capacity: number;
  fuel_lvl_mm: number;
  fuel_offset: number;
  fuel_volume: number;
  fuel_volume_15: number;
  water_lvl_mm: number;
  water_offset: number;
  water_volume: number;
  water_volume_15: number;
  average_temp: number;
  EWURALicenseNo: string;
  LicenseeTraSerialNo: string;
}

interface OffloadingEvent {
  id: string;
  stationSerial: string;
  productName: string;
  startTime: string;
  endTime: string;
  startReading: number;
  endReading: number;
  offloadingQty: number;
  startRecordId: number;
  endRecordId: number;
  detectionWindow: number;
  tankId: string;
  tankName: string;
  duration: string;
  formattedStartTime: string;
  formattedEndTime: string;
  formattedQuantity: string;
}

interface OffloadingSummary {
  totalEvents: number;
  byStation: {
    [stationSerial: string]: {
      count: number;
      totalQuantity: number;
      events: OffloadingEvent[];
    };
  };
  byProduct: {
    [productName: string]: {
      count: number;
      totalQuantity: number;
      events: OffloadingEvent[];
    };
  };
  totalQuantity: number;
  averageQuantity: number;
  dateRange: {
    earliest: Date | null;
    latest: Date | null;
  };
}

interface GroupedTankData {
  [key: string]: (TankData & { parsedDate: Date })[];
}

// Add this entire class before your component definition
class OffloadingDetector {
  private readonly DETECTION_WINDOW_MINUTES = 125;
  private readonly MIN_OFFLOADING_THRESHOLD = 500;

  detectOffloadingEvents(tankData: TankData[]): OffloadingEvent[] {
    if (!tankData || !Array.isArray(tankData)) {
      console.error('Invalid tank data provided');
      return [];
    }

    const groupedData = this.groupByStationAndProduct(tankData);
    let allOffloadingEvents: OffloadingEvent[] = [];

    for (const [key, records] of Object.entries(groupedData)) {
      const [stationSerial, productName] = key.split('|');
      const offloadingEvents = this.detectOffloadingForGroup(records, stationSerial, productName);
      allOffloadingEvents = allOffloadingEvents.concat(offloadingEvents);
    }

    return allOffloadingEvents;
  }

  private groupByStationAndProduct(tankData: TankData[]): GroupedTankData {
    const grouped: GroupedTankData = {};
    
    tankData.forEach(record => {
      const key = `${record.LicenseeTraSerialNo}|${record.product_name}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push({
        ...record,
        parsedDate: new Date(record.date)
      });
    });

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
    });

    return grouped;
  }

  private detectOffloadingForGroup(
    records: (TankData & { parsedDate: Date })[], 
    stationSerial: string, 
    productName: string
  ): OffloadingEvent[] {
    const offloadingEvents: OffloadingEvent[] = [];
    
    for (let i = 0; i < records.length - 1; i++) {
      const currentRecord = records[i];
      const nextRecord = records[i + 1];
      
      // Look for significant volume increases (start of offloading)
      const volumeIncrease = nextRecord.fuel_volume - currentRecord.fuel_volume;
      
      if (volumeIncrease >= this.MIN_OFFLOADING_THRESHOLD) {
        // Check if this increase is preceded by a significant drop
        if (this.hasSignificantDropBefore(records, i + 1)) {
          continue; // Skip this potential offloading event
        }
        
        // Check if this increase is followed by a fast sudden drop
        if (this.isFastSuddenDrop(records, i + 1)) {
          continue; // Skip this potential offloading event
        }
        
        // Define the detection window (125 minutes from current record)
        const windowEndTime = new Date(currentRecord.parsedDate.getTime() + this.DETECTION_WINDOW_MINUTES * 60 * 1000);
        
        // Find the maximum volume within the detection window
        let maxVolumeRecord = currentRecord;
        let maxVolumeIndex = i;
        
        // Search within the 125-minute window
        for (let j = i; j < records.length; j++) {
          const futureRecord = records[j];
          
          // Stop if we've exceeded the detection window
          if (futureRecord.parsedDate > windowEndTime) {
            break;
          }
          
          // Update maximum if we find a higher volume
          if (futureRecord.fuel_volume > maxVolumeRecord.fuel_volume) {
            maxVolumeRecord = futureRecord;
            maxVolumeIndex = j;
          }
        }
        
        // Calculate offloading quantity
        const totalOffloadingQty = maxVolumeRecord.fuel_volume - currentRecord.fuel_volume;
        
        if (totalOffloadingQty >= this.MIN_OFFLOADING_THRESHOLD) {
          const offloadingEvent: OffloadingEvent = {
            id: `${stationSerial}_${productName}_${currentRecord.id}`,
            stationSerial,
            productName,
            startTime: currentRecord.date,
            endTime: maxVolumeRecord.date,
            startReading: currentRecord.fuel_volume,
            endReading: maxVolumeRecord.fuel_volume,
            offloadingQty: parseFloat(totalOffloadingQty.toFixed(2)),
            startRecordId: currentRecord.id,
            endRecordId: maxVolumeRecord.id,
            detectionWindow: this.DETECTION_WINDOW_MINUTES,
            tankId: currentRecord.tank_id,
            tankName: currentRecord.tank_name,
            duration: this.calculateDuration(currentRecord.date, maxVolumeRecord.date),
            formattedStartTime: new Date(currentRecord.date).toLocaleString(),
            formattedEndTime: new Date(maxVolumeRecord.date).toLocaleString(),
            formattedQuantity: `${parseFloat(totalOffloadingQty.toFixed(2)).toLocaleString()} L`
          };

          offloadingEvents.push(offloadingEvent);
          
          // Skip to after the detection window to avoid overlapping detections
          i = this.findIndexAfterWindow(records, i, windowEndTime);
        }
      }
    }

    return offloadingEvents;
  }

  private hasSignificantDropBefore(records: (TankData & { parsedDate: Date })[], increaseIndex: number): boolean {
    const LOOKBACK_RECORDS = 10;
    const SIGNIFICANT_DROP_THRESHOLD = 1000;
    
    const startIndex = Math.max(0, increaseIndex - LOOKBACK_RECORDS);
    
    if (startIndex >= increaseIndex) return false;
    
    const increaseRecord = records[increaseIndex];
    const lookbackRecord = records[startIndex];
    
    const volumeDifference = lookbackRecord.fuel_volume - increaseRecord.fuel_volume;
    
    return volumeDifference > SIGNIFICANT_DROP_THRESHOLD;
  }

  private isFastSuddenDrop(records: (TankData & { parsedDate: Date })[], startIndex: number): boolean {
    if (startIndex >= records.length - 1) return false;
    
    const startRecord = records[startIndex];
    const DROP_CHECK_MINUTES = 30;
    const SUDDEN_DROP_THRESHOLD = this.MIN_OFFLOADING_THRESHOLD * 0.8;
    
    const checkEndTime = new Date(startRecord.parsedDate.getTime() + DROP_CHECK_MINUTES * 60 * 1000);
    
    for (let i = startIndex + 1; i < records.length; i++) {
      const currentRecord = records[i];
      
      if (currentRecord.parsedDate > checkEndTime) {
        break;
      }
      
      const volumeChange = currentRecord.fuel_volume - startRecord.fuel_volume;
      if (volumeChange <= -SUDDEN_DROP_THRESHOLD) {
        return true;
      }
    }
    
    return false;
  }

  private findIndexAfterWindow(
    records: (TankData & { parsedDate: Date })[], 
    currentIndex: number, 
    windowEndTime: Date
  ): number {
    for (let i = currentIndex + 1; i < records.length; i++) {
      if (records[i].parsedDate > windowEndTime) {
        return i - 1;
      }
    }
    return records.length - 1;
  }

  generateSummary(offloadingEvents: OffloadingEvent[]): OffloadingSummary {
    const summary: OffloadingSummary = {
      totalEvents: offloadingEvents.length,
      byStation: {},
      byProduct: {},
      totalQuantity: 0,
      averageQuantity: 0,
      dateRange: {
        earliest: null,
        latest: null
      }
    };

    offloadingEvents.forEach(event => {
      if (!summary.byStation[event.stationSerial]) {
        summary.byStation[event.stationSerial] = {
          count: 0,
          totalQuantity: 0,
          events: []
        };
      }
      summary.byStation[event.stationSerial].count++;
      summary.byStation[event.stationSerial].totalQuantity += event.offloadingQty;
      summary.byStation[event.stationSerial].events.push(event);

      if (!summary.byProduct[event.productName]) {
        summary.byProduct[event.productName] = {
          count: 0,
          totalQuantity: 0,
          events: []
        };
      }
      summary.byProduct[event.productName].count++;
      summary.byProduct[event.productName].totalQuantity += event.offloadingQty;
      summary.byProduct[event.productName].events.push(event);

      summary.totalQuantity += event.offloadingQty;

      const eventDate = new Date(event.startTime);
      if (!summary.dateRange.earliest || eventDate < summary.dateRange.earliest) {
        summary.dateRange.earliest = eventDate;
      }
      if (!summary.dateRange.latest || eventDate > summary.dateRange.latest) {
        summary.dateRange.latest = eventDate;
      }
    });

    summary.averageQuantity = offloadingEvents.length > 0 
      ? parseFloat((summary.totalQuantity / offloadingEvents.length).toFixed(2))
      : 0;

    return summary;
  }

  private calculateDuration(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  headerContent: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "64px",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  logoSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconButton: {
    position: "relative" as const,
    padding: "8px",
    color: "#6b7280",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  badge: {
    position: "absolute" as const,
    top: "-2px",
    right: "-2px",
    width: "16px",
    height: "16px",
    backgroundColor: "#eab308",
    color: "white",
    fontSize: "10px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    color: "#6b7280",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "14px",
  },
  main: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  welcomeSection: {
    marginBottom: "32px",
  },
  welcomeText: {
    color: "#6b7280",
  },
  nozzleSection: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "24px",
    marginBottom: "32px",
  },
  nozzleTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  nozzleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  nozzleCard: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e2e8f0",
  },
  nozzleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  nozzleName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  nozzleMetrics: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  nozzleMetric: {
    textAlign: "center" as const,
  },
  nozzleMetricValue: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1e293b",
    margin: 0,
  },
  nozzleMetricLabel: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "2px",
  },
};

export default function StationDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { logout } = useAuth();
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refillData, setRefillData] = useState<any[]>([]);
  const [allTankData, setAllTankData] = useState<TankData[]>([]);
  const [offloadingEvents, setOffloadingEvents] = useState<OffloadingEvent[]>([]);
  const [offloadingSummary, setOffloadingSummary] = useState<OffloadingSummary | null>(null);
  const [isAnalyzingOffloading, setIsAnalyzingOffloading] = useState(false);

  // Initialize offloading detector
  const offloadingDetector = useMemo(() => new OffloadingDetector(), []);

  // SIGNAL - Check if getBigTanksData returned data
  const hasTankData = allTankData && allTankData.length > 0;

  // CALCULATION FUNCTIONS
  const getUnleadedOrderQty = () => {
    return refillData.length > 0 
      ? (refillData.find(refill => refill.product === "UNLEADED" || refill.product === "Unleaded")?.fuel_amount || "0") + " L" 
      : "0 L";
  };

  const getDieselOrderQty = () => {
    return refillData.length > 0 
      ? (refillData.find(refill => refill.product === "DIESEL" || refill.product === "Diesel" || refill.product === "DIESLE")?.fuel_amount || "0") + " L" 
      : "0 L";
  };

  const getUnleadedOffloading = () => {
    const unleadedOffloading = offloadingEvents
      .filter(event => 
        (event.productName === "UNLEADED" || event.productName === "Unleaded") &&
        event.stationSerial === stationData?.LicenseeTraSerialNo
      )
      .slice(-1)[0];
    
    return unleadedOffloading 
      ? `${(unleadedOffloading.offloadingQty + 500).toLocaleString()} L`
      : "0 L";
  };

  const getDieselOffloading = () => {
    const dieselOffloading = offloadingEvents
      .filter(event => 
        (event.productName === "DIESEL" || event.productName === "DIESLE") &&
        event.stationSerial === stationData?.LicenseeTraSerialNo
      )
      .slice(-1)[0];
    
    return dieselOffloading 
      ? `${(dieselOffloading.offloadingQty + 500).toLocaleString()} L`
      : "0 L";
  };

  const getUnleadedOffloadingDate = () => {
    const unleadedOffloading = offloadingEvents
      .filter(event => 
        (event.productName === "UNLEADED" || event.productName === "Unleaded") &&
        event.stationSerial === stationData?.LicenseeTraSerialNo
      )
      .slice(-1)[0];
      
    if (unleadedOffloading) {
      return `Date: ${new Date(unleadedOffloading.startTime).toLocaleDateString()}`;
    }
    return "No recent offloading";
  };

  const getDieselOffloadingDate = () => {
    const dieselOffloading = offloadingEvents
      .filter(event => 
        (event.productName === "DIESEL" || event.productName === "DIESLE") &&
        event.stationSerial === stationData?.LicenseeTraSerialNo
      )
      .slice(-1)[0];
      
    if (dieselOffloading) {
      return `Date: ${new Date(dieselOffloading.startTime).toLocaleDateString()}`;
    }
    return "No recent offloading";
  };

  const getUnleadedOffloadingValue = () => {
    const unleadedOffloading = offloadingEvents
      .filter(event => 
        (event.productName === "UNLEADED" || event.productName === "Unleaded") &&
        event.stationSerial === stationData?.LicenseeTraSerialNo
      )
      .slice(-1)[0];
    
    return unleadedOffloading ? unleadedOffloading.offloadingQty + 500 : 0;
  };

  const getDieselOffloadingValue = () => {
    const dieselOffloading = offloadingEvents
      .filter(event => 
        (event.productName === "DIESEL" || event.productName === "DIESLE") &&
        event.stationSerial === stationData?.LicenseeTraSerialNo
      )
      .slice(-1)[0];
    
    return dieselOffloading ? dieselOffloading.offloadingQty + 500 : 0;
  };

  const getUnleadedOrderValue = () => {
    return refillData.length > 0 
      ? (refillData.find(refill => refill.product === "UNLEADED" || refill.product === "Unleaded")?.fuel_amount || 0)
      : 0;
  };

  const getDieselOrderValue = () => {
    return refillData.length > 0 
      ? (refillData.find(refill => refill.product === "DIESEL" || refill.product === "Diesel" || refill.product === "DIESLE")?.fuel_amount || 0)
      : 0;
  };

  const getUnleadedDifference = () => {
    const difference = getUnleadedOffloadingValue() - getUnleadedOrderValue();
    
    return {
      value: `${difference > 0 ? '+' : ''}${difference.toLocaleString()} L`,
      color: difference === 0 ? '#16a34a' : difference > 0 ? '#f59e0b' : '#dc2626'
    };
  };

  const getDieselDifference = () => {
    const difference = getDieselOffloadingValue() - getDieselOrderValue();
    
    return {
      value: `${difference > 0 ? '+' : ''}${difference.toLocaleString()} L`,
      color: difference === 0 ? '#16a34a' : difference > 0 ? '#f59e0b' : '#dc2626'
    };
  };

  const getUnleadedDipstick = () => {
    const unleadedRefill = refillData.find(refill => 
      refill.product === "UNLEADED" || refill.product === "Unleaded"
    );

    if (unleadedRefill && unleadedRefill.dip_end && unleadedRefill.dip_start) {
      return (unleadedRefill.dip_end - unleadedRefill.dip_start).toLocaleString() + " L";
    }
    return "0 L";
  };

  const getDieselDipstick = () => {
    const dieselRefill = refillData.find(refill => refill.product === "DIESEL" || refill.product === "DIESLE");

    if (dieselRefill && dieselRefill.dip_end && dieselRefill.dip_start) {
      return (dieselRefill.dip_end - dieselRefill.dip_start).toLocaleString() + " L";
    }
    return "0 L";
  };

  const getUnleadedDipstickDate = () => {
    const unleadedRefill = refillData.find(refill => 
      refill.product === "UNLEADED" || refill.product === "Unleaded"
    );
    if (unleadedRefill && unleadedRefill.issue_date) {
      return `Date: ${new Date(unleadedRefill.issue_date).toLocaleDateString()}`;
    }
    return null;
  };

  const getDieselDipstickDate = () => {
    const dieselRefill = refillData.find(refill => refill.product === "DIESEL" || refill.product === "DIESLE");
    if (dieselRefill && dieselRefill.issue_date) {
      return `Date: ${new Date(dieselRefill.issue_date).toLocaleDateString()}`;
    }
    return null;
  };

  // Offloading Analysis Function
  const analyzeOffloading = useCallback(async (tankDataForAnalysis: TankData[]) => {
    if (!tankDataForAnalysis || tankDataForAnalysis.length === 0) {
      console.log('No tank data available for offloading analysis');
      return;
    }

    setIsAnalyzingOffloading(true);
    try {
      console.log('Starting offloading analysis with', tankDataForAnalysis.length, 'records');
      
      const events = offloadingDetector.detectOffloadingEvents(tankDataForAnalysis);
      const summary = offloadingDetector.generateSummary(events);
      
      setOffloadingEvents(events);
      setOffloadingSummary(summary);
      
      console.log('Offloading Analysis Complete:', {
        totalEvents: events.length,
        totalQuantity: summary.totalQuantity,
        summary
      });
      
    } catch (error) {
      console.error('Error analyzing offloading:', error);
    } finally {
      setIsAnalyzingOffloading(false);
    }
  }, [offloadingDetector]);

  const fetchAllTankData = async () => {
    try {
      const response = await apiService.getBigTanksData();
      
      if (response && response.data) {
        setAllTankData(response.data);
        
        if (stationData?.LicenseeTraSerialNo) {
          const stationTankData = response.data.filter((record: TankData) => 
            record.LicenseeTraSerialNo === stationData.LicenseeTraSerialNo
          );
          await analyzeOffloading(stationTankData);
        } else {
          await analyzeOffloading(response.data);
        }
      }
    } catch (error) {
      console.error('Error in fetchAllTankData:', error);
    }
  };

  const fetchRefillData = async () => {
    try {
      const response = await apiService.getStationRefillReport();
      if (response && response.data && response.data.records) {
        const currentStationSerial = stationData?.LicenseeTraSerialNo;
        
        if (currentStationSerial) {
          const filteredRecords = response.data.records.filter((record: any) =>
            record.station_serial === currentStationSerial
          );
          
          const latestByProduct: { [key: string]: any } = {};
          filteredRecords.forEach((record: any) => {
            const product = record.product;
            if (!latestByProduct[product] || record.id > latestByProduct[product].id) {
              latestByProduct[product] = record;
            }
          });
          
          const latestRecords = Object.values(latestByProduct).sort((a: any, b: any) => b.id - a.id);
          setRefillData(latestRecords);
        } else {
          setRefillData(response.data.records);
        }
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Error fetching refill data:", err);
      setRefillData([]);
    }
  };

  const fetchStationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const station = await apiService.getStation(id);

      if (station) {
        setStationData({
          id: station.id,
          name: station.RetailStationName,
          location: `${station.WardName}, ${station.DistrictName}`,
          region: station.RegionName,
          zone: station.Zone,
          operatorName: station.OperatorName,
          contactEmail: station.ContactPersonEmailAddress,
          contactPhone: station.ContactPersonPhone,
          ewuraLicense: station.EWURALicenseNo,
          tanks: station.TotalNoTanks,
          username: station.automation_server_username,
          password: station.automation_server_pass,
          LicenseeTraSerialNo: station.LicenseeTraSerialNo,
        });
      } else {
        throw new Error(`Station with ID ${id} not found`);
      }
    } catch (err) {
      console.error("Error fetching station data:", err);
      setError((err as Error).message);
      setStationData({
        id: parseInt(id),
        name: `Station ${id} (Fallback)`,
        location: "Location unavailable",
        operatorName: "LAKE OIL",
        tanks: 2,
        ewuraLicense: "License unavailable",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([fetchStationData()]);
  };

  useEffect(() => {
    if (stationData?.ewuraLicense) {
      fetchRefillData();
    }
  }, [stationData]);

  useEffect(() => {
    refreshAllData();
  }, []);

  useEffect(() => {
    if (stationData?.LicenseeTraSerialNo) {
      fetchRefillData();
      fetchAllTankData();
    }
  }, [stationData]);

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <Shield size={32} color="#2563eb" />
            <div>
              <h1 style={styles.logoTitle}>
                {loading
                  ? "Loading..."
                  : stationData?.name || "Station Dashboard"}
              </h1>
              <p style={styles.logoSubtitle}>Station Manager</p>
            </div>
          </div>

          <div style={styles.headerActions}>
            <button
              style={styles.iconButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Bell size={20} />
              <span style={styles.badge}>1</span>
            </button>
            <button
              style={styles.iconButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Settings size={20} />
            </button>
            <button
              onClick={handleSignOut}
              style={styles.signOutButton}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          <p style={styles.welcomeText}>
            {loading
              ? "Loading station information..."
              : error
              ? `Error: ${error}`
              : `Monitor ${
                  stationData?.name || "your station"
                }'s operations and performance in real-time.`}
          </p>
          {stationData && !loading && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  fontSize: "14px",
                  color: "#64748b",
                }}
              >
                <div>
                  🏢 <strong>Serial No:</strong> {stationData.LicenseeTraSerialNo}
                </div>
                <div>
                  📋 <strong>License:</strong> {stationData.ewuraLicense}
                </div>
                <div>
                  🛢️ <strong>Tanks:</strong> {stationData.tanks}
                </div>
              </div>

              <button
                onClick={refreshAllData}
                style={{
                  marginTop: "8px",
                  padding: "6px 12px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <RefreshCw size={12} />
                Refresh All Data
              </button>
            </div>
          )}
        </div>

        {/* Tank Data Signal */}
        <div style={{
          marginBottom: "16px",
          padding: "12px 16px",
          backgroundColor: hasTankData ? "#dcfce7" : "#fee2e2",
          borderRadius: "8px",
          border: `1px solid ${hasTankData ? "#16a34a" : "#dc2626"}`,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: hasTankData ? "#16a34a" : "#dc2626"
          }}></div>
          <span style={{
            fontSize: "14px",
            fontWeight: "500",
            color: hasTankData ? "#166534" : "#dc2626"
          }}>
            Tank Data: {hasTankData ? "Available" : "Not Available"}
          </span>
        </div>

        {/* Unleaded Order Analysis */}
        <div
          style={{
            ...styles.nozzleSection,
            background:
              "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
            border: "3px solid #16a34a",
            borderRadius: "20px",
            boxShadow: "0 8px 25px rgba(22, 163, 74, 0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%)",
            }}
          ></div>

          <h3
            style={{
              ...styles.nozzleTitle,
              color: "#14532d",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <TrendingUp size={20} color="#16a34a" />⛽ Unleaded Order Analysis
          </h3>
          <div style={styles.nozzleGrid}>
            {/* Order Qty */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                border: "2px solid #0ea5e9",
                boxShadow: "0 4px 12px rgba(14, 165, 233, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#0c4a6e",
                  }}
                >
                  Order Qty
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "20px",
                      color: "#0c4a6e",
                    }}
                  >
                    {getUnleadedOrderQty()}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Order Quantity</p>
                </div>
              </div>
            </div>

            {/* Latest Offloading (ATG) */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                border: "2px solid #a855f7",
                boxShadow: "0 4px 12px rgba(168, 85, 247, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#581c87",
                  }}
                >
                  Latest Offloading (ATG)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "20px",
                      color: "#581c87",
                    }}
                  >
                    {getUnleadedOffloading()}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Offloaded Quantity</p>
                  
                  <p style={{
                    fontSize: "11px",
                    color: "#a855f7",
                    marginTop: "4px",
                    fontStyle: "italic"
                  }}>
                    {getUnleadedOffloadingDate()}
                  </p>
                </div>
              </div>
            </div>

            {/* Difference of ATG and Order Qty */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
                border: "2px solid #eab308",
                boxShadow: "0 4px 12px rgba(234, 179, 8, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#713f12",
                  }}
                >
                  Difference of ATG and Order Qty
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "20px",
                      color: "#ca8a04",
                    }}
                  >
                    <span style={{ color: getUnleadedDifference().color }}>
                      {getUnleadedDifference().value}
                    </span>
                  </p>
                  <p style={styles.nozzleMetricLabel}>Difference</p>
                </div>
              </div>
            </div>

            {/* Order (Dipstick) */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                border: "2px solid #22c55e",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#14532d",
                  }}
                >
                  Order (Dipstick)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "20px",
                      color: "#14532d",
                    }}
                  >
                    {getUnleadedDipstick()}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Dipstick Reading</p>
                  
                  {getUnleadedDipstickDate() && (
                    <p style={{
                      fontSize: "11px",
                      color: "#15803d",
                      marginTop: "4px",
                      fontStyle: "italic"
                    }}>
                      {getUnleadedDipstickDate()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diesel Order Analysis */}
        <div
          style={{
            ...styles.nozzleSection,
            background:
              "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)",
            border: "3px solid #3b82f6",
            borderRadius: "20px",
            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%)",
            }}
          ></div>

          <h3
            style={{
              ...styles.nozzleTitle,
              color: "#1e3a8a",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <TrendingUp size={20} color="#3b82f6" />
            🚛 Diesel Order Analysis
          </h3>
          <div style={styles.nozzleGrid}>
            {/* Order Qty */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                border: "2px solid #0ea5e9",
                boxShadow: "0 4px 12px rgba(14, 165, 233, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#0c4a6e",
                  }}
                >
                  Order Qty
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "20px",
                      color: "#0c4a6e",
                    }}
                  >
                    {getDieselOrderQty()}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Order Quantity</p>
                </div>
              </div>
            </div>

            {/* Latest Diesel Offloading (ATG) */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                border: "2px solid #a855f7",
                boxShadow: "0 4px 12px rgba(168, 85, 247, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#581c87",
                  }}
                >
                  Latest Offloading (ATG)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "20px",
                      color: "#581c87",
                    }}
                  >
                    {getDieselOffloading()}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Offloaded Quantity</p>
                  
                  <p style={{
                    fontSize: "11px",
                    color: "#a855f7",
                    marginTop: "4px",
                    fontStyle: "italic"
                  }}>
                    {getDieselOffloadingDate()}
                  </p>
                </div>
              </div>
            </div>

            {/* Difference of ATG and Order Qty */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
                border: "2px solid #eab308",
                boxShadow: "0 4px 12px rgba(234, 179, 8, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#713f12",
                  }}
                >
                  Difference of ATG and Order Qty
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "20px",
                      color: "#ca8a04",
                    }}
                  >
                    <span style={{ color: getDieselDifference().color }}>
                      {getDieselDifference().value}
                    </span>
                  </p>
                  <p style={styles.nozzleMetricLabel}>Difference</p>
                </div>
              </div>
            </div>

            {/* Order (Dipstick) */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                border: "2px solid #22c55e",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#14532d",
                  }}
                >
                  Order (Dipstick)
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "20px",
                      color: "#14532d",
                    }}
                  >
                    {getDieselDipstick()}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Dipstick Reading</p>
                  
                  {getDieselDipstickDate() && (
                    <p style={{
                      fontSize: "11px",
                      color: "#15803d",
                      marginTop: "4px",
                      fontStyle: "italic"
                    }}>
                      {getDieselDipstickDate()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}