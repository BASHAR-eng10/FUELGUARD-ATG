"use client";

import { useState, useEffect, use } from "react";
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
  ewuraLicense?: string;
  tanks: number;
  username?: string;
  password?: string;
  LicenseeTraSerialNo?: string;
}

interface OffloadingEvent {
  id?: string;
  station: string;
  stationSerial?: string;
  productName?: string;
  tank: string;
  tankName?: string;
  tankId?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  offload_volume_liters: number;
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
  const [offloadingEvents, setOffloadingEvents] = useState<OffloadingEvent[]>([]);
  const [isLoadingOffloading, setIsLoadingOffloading] = useState(false);

  // CALCULATION FUNCTIONS
  const getUnleadedOrderQty = () => {
    const unleadedRefills = refillData.filter((refill: any) => 
      refill.product === "UNLEADED" || refill.product === "Unleaded"
    );
    if (unleadedRefills.length === 0) return "0 L";
    const latest = unleadedRefills[unleadedRefills.length - 1];
    return (latest.fuel_amount || "0") + " L";
  };

  const getDieselOrderQty = () => {
    const dieselRefills = refillData.filter((refill: any) => 
      refill.product === "DIESEL" || refill.product === "Diesel" || refill.product === "DIESLE"
    );
    if (dieselRefills.length === 0) return "0 L";
    const latest = dieselRefills[dieselRefills.length - 1];
    return (latest.fuel_amount || "0") + " L";
  };

  const getUnleadedOffloading = () => {
  const events = offloadingEvents.filter((e: OffloadingEvent) => {
    const stationMatch = (e.station || e.stationSerial) === stationData?.LicenseeTraSerialNo;
    const tankMatch = e.tank.toUpperCase() === "UNLEADED";
    return tankMatch && stationMatch;
  });
  
  if (events.length === 0) return "0 L";
  
  const latest = events.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  return `${latest.offload_volume_liters.toLocaleString()} L`;
};

const getDieselOffloading = () => {
  const events = offloadingEvents.filter((e: OffloadingEvent) => {
    const stationMatch = (e.station || e.stationSerial) === stationData?.LicenseeTraSerialNo;
    const tankMatch = e.tank.toUpperCase() === "DIESEL" || e.tank.toUpperCase() === "DIESLE";
    return tankMatch && stationMatch;
  });
  
  if (events.length === 0) return "0 L";
  
  const latest = events.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  return `${latest.offload_volume_liters.toLocaleString()} L`;
};

const getUnleadedOffloadingDate = () => {
  const events = offloadingEvents.filter((e: OffloadingEvent) => {
    const stationMatch = (e.station || e.stationSerial) === stationData?.LicenseeTraSerialNo;
    const tankMatch = e.tank.toUpperCase() === "UNLEADED";
    return tankMatch && stationMatch;
  });
  
  if (events.length === 0) return "No recent offloading";
  
  const latest = events.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  return `Date: ${new Date(latest.date).toLocaleDateString()}`;
};

const getDieselOffloadingDate = () => {
  const events = offloadingEvents.filter((e: OffloadingEvent) => {
    const stationMatch = (e.station || e.stationSerial) === stationData?.LicenseeTraSerialNo;
    const tankMatch = e.tank.toUpperCase() === "DIESEL" || e.tank.toUpperCase() === "DIESLE";
    return tankMatch && stationMatch;
  });
  
  if (events.length === 0) return "No recent offloading";
  
  const latest = events.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  return `Date: ${new Date(latest.date).toLocaleDateString()}`;
};

const getUnleadedOffloadingValue = () => {
  const events = offloadingEvents.filter((e: OffloadingEvent) => {
    const stationMatch = (e.station || e.stationSerial) === stationData?.LicenseeTraSerialNo;
    const tankMatch = e.tank.toUpperCase() === "UNLEADED";
    return tankMatch && stationMatch;
  });
  
  if (events.length === 0) return 0;
  
  const latest = events.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  return latest.offload_volume_liters;
};

const getDieselOffloadingValue = () => {
  const events = offloadingEvents.filter((e: OffloadingEvent) => {
    const stationMatch = (e.station || e.stationSerial) === stationData?.LicenseeTraSerialNo;
    const tankMatch = e.tank.toUpperCase() === "DIESEL" || e.tank.toUpperCase() === "DIESLE";
    return tankMatch && stationMatch;
  });
  
  if (events.length === 0) return 0;
  
  const latest = events.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  return latest.offload_volume_liters;
};

  const getUnleadedOrderValue = () => {
    const unleadedRefills = refillData.filter((refill: any) => 
      refill.product === "UNLEADED" || refill.product === "Unleaded"
    );
    if (unleadedRefills.length === 0) return 0;
    const latest = unleadedRefills[unleadedRefills.length - 1];
    return latest.fuel_amount || 0;
  };

  const getDieselOrderValue = () => {
    const dieselRefills = refillData.filter((refill: any) => 
      refill.product === "DIESEL" || refill.product === "Diesel" || refill.product === "DIESLE"
    );
    if (dieselRefills.length === 0) return 0;
    const latest = dieselRefills[dieselRefills.length - 1];
    return latest.fuel_amount || 0;
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
    const unleadedRefills = refillData.filter((refill: any) => 
      refill.product === "UNLEADED" || refill.product === "Unleaded"
    );
    
    if (unleadedRefills.length === 0) return "0 L";
    
    const unleadedRefill = unleadedRefills[unleadedRefills.length - 1];

    if (unleadedRefill && unleadedRefill.dip_end && unleadedRefill.dip_start) {
      return (unleadedRefill.dip_end - unleadedRefill.dip_start).toLocaleString() + " L";
    }
    return "0 L";
  };

  const getDieselDipstick = () => {
    const dieselRefills = refillData.filter((refill: any) => 
      refill.product === "DIESEL" || refill.product === "DIESLE"
    );
    
    if (dieselRefills.length === 0) return "0 L";
    
    const dieselRefill = dieselRefills[dieselRefills.length - 1];

    if (dieselRefill && dieselRefill.dip_end && dieselRefill.dip_start) {
      return (dieselRefill.dip_end - dieselRefill.dip_start).toLocaleString() + " L";
    }
    return "0 L";
  };

  const getUnleadedDipstickDate = () => {
    const unleadedRefills = refillData.filter((refill: any) => 
      refill.product === "UNLEADED" || refill.product === "Unleaded"
    );
    if (unleadedRefills.length === 0) return null;
    const unleadedRefill = unleadedRefills[unleadedRefills.length - 1];
    if (unleadedRefill && unleadedRefill.issue_date) {
      return `Date: ${new Date(unleadedRefill.issue_date).toLocaleDateString()}`;
    }
    return null;
  };

  const getDieselDipstickDate = () => {
    const dieselRefills = refillData.filter((refill: any) => 
      refill.product === "DIESEL" || refill.product === "DIESLE"
    );
    if (dieselRefills.length === 0) return null;
    const dieselRefill = dieselRefills[dieselRefills.length - 1];
    if (dieselRefill && dieselRefill.issue_date) {
      return `Date: ${new Date(dieselRefill.issue_date).toLocaleDateString()}`;
    }
    return null;
  };

 const fetchOffloadingData = async () => {
  setIsLoadingOffloading(true);
  try {
    console.log("Fetching offloading data...");
    const response = await apiService.getStationAutoRefillReport();
    
    console.log('Raw API response:', response);
    
    // Handle different response structures
    let records = [];
    
    // Check if response.data is an array directly
    if (Array.isArray(response.data)) {
      records = response.data;
      console.log('Response structure: direct array');
    }
    // Check if response.data.records exists
    else if (response && response.data && response.data.records) {
      records = response.data.records;
      console.log('Response structure: nested records');
    }
    // Check if response.data.data exists (double nested)
    else if (response && response.data && response.data.data) {
      records = response.data.data;
      console.log('Response structure: double nested data');
    }
    else {
      throw new Error("Invalid API response structure");
    }
    
    console.log('Total records found:', records.length);
    
    const currentStationSerial = stationData?.LicenseeTraSerialNo;
    
    console.log('Current station serial:', currentStationSerial);
    
    if (currentStationSerial) {
      // Filter by station serial - GET ALL RECORDS, not just latest
      const filteredRecords = records.filter((record: any) =>
        record.station_serial === currentStationSerial
      );
      
      console.log('Filtered autorefill records for station:', filteredRecords);
      
      // Convert ALL records to OffloadingEvent format
      const events: OffloadingEvent[] = filteredRecords.map((record: any) => ({
        id: record.id?.toString(),
        station: record.station_serial,
        stationSerial: record.station_serial,
        productName: record.product,
        tank: record.product,
        tankName: record.tank_name || `Tank ${record.tank_id}`,
        tankId: record.tank_id,
        date: record.issue_date,
        startTime: record.issue_date,
        offload_volume_liters: record.fuel_volume || 0
      }));
      
      // Sort by date descending (newest first)
      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      console.log('Processed offloading events:', events);
      
      setOffloadingEvents(events);
    } else {
      setOffloadingEvents([]);
    }
  } catch (error: any) {
    console.error('Error fetching offloading data:', error);
    console.error('Error details:', error.message);
    setOffloadingEvents([]);
  } finally {
    setIsLoadingOffloading(false);
  }
};

// Modified function to get ALL history records separately
const getAllHistory = () => {
  const allRecords: Array<{
    date: string;
    product: string;
    type: 'autorefill' | 'refill';
    tankId?: string;
    tankName?: string;
    volume: number;
    refillQty?: number;
    refillDipstick?: number;
  }> = [];

  // Add ALL autorefill records
  offloadingEvents.forEach(event => {
    allRecords.push({
      date: event.date,
      product: event.tank,
      type: 'autorefill',
      tankId: event.tankId,
      tankName: event.tankName,
      volume: event.offload_volume_liters,
    });
  });

  // Add ALL refill records
  refillData.forEach(refill => {
    const dipstickValue = (refill.dip_end && refill.dip_start) 
      ? (refill.dip_end - refill.dip_start) 
      : 0;

    allRecords.push({
      date: refill.issue_date,
      product: refill.product,
      type: 'refill',
      tankId: refill.tank_id,
      volume: refill.fuel_amount || 0,
      refillQty: refill.fuel_amount || 0,
      refillDipstick: dipstickValue,
    });
  });

  // Sort by date (newest first)
  return allRecords.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

  // Fetch refill data from API - Modified to get ALL records
  const fetchRefillData = async () => {
    try {
      console.log("Fetching refill data...");
      const response = await apiService.getStationRefillReport();
      
      if (response && response.data && response.data.records) {
        const currentStationSerial = stationData?.LicenseeTraSerialNo;
        
        console.log('Current station serial:', currentStationSerial);
        console.log('All refill records:', response.data.records);
        
        if (currentStationSerial) {
          // Get ALL records for this station, not just latest by product
          const filteredRecords = response.data.records.filter((record: any) =>
            record.station_serial === currentStationSerial
          );
          
          console.log('All filtered refill records:', filteredRecords);
          
          // Sort by date descending
          filteredRecords.sort((a: any, b: any) => {
            const dateA = new Date(a.issue_date).getTime();
            const dateB = new Date(b.issue_date).getTime();
            return dateB - dateA;
          });
          
          setRefillData(filteredRecords);
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

  // Fetch station data from API
  const fetchStationData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching station data for ID:", id);
      const station = await apiService.getStation(id);

      console.log("Received station data:", station);

      if (station && station.data) {
        const stationInfo = station.data;
        setStationData(stationInfo);
        console.log("Station data set successfully:", stationInfo);
      } else {
        throw new Error("Invalid station data structure");
      }
    } catch (err: any) {
      console.error("Error fetching station data:", err);
      setError(err.message || "Failed to load station data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationData();
  }, [id]);

  useEffect(() => {
    if (stationData) {
      fetchRefillData();
      fetchOffloadingData();
    }
  }, [stationData]);

  const handleSignOut = () => {
    logout();
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e5e7eb",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Loading station data...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "#fee2e2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Shield size={24} color="#dc2626" />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Error Loading Station
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "8px 24px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <Shield size={28} color="#3b82f6" />
            <div>
              <h1 style={styles.logoTitle}>Mazady Fuel Station</h1>
              <p style={styles.logoSubtitle}>Management System</p>
            </div>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.iconButton}>
              <Bell size={20} />
              <span style={styles.badge}>3</span>
            </button>
            <button style={styles.iconButton}>
              <Settings size={20} />
            </button>
            <button onClick={handleSignOut} style={styles.signOutButton}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.welcomeSection}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#111827" }}>
            Welcome back, Station Manager
          </h2>
          <p style={styles.welcomeText}>
            Here's what's happening at {stationData?.name || "your station"}{" "}
            today
          </p>
        </div>

        {/* Unleaded Section */}
        <div style={styles.nozzleSection}>
          <h3 style={styles.nozzleTitle}>
            <TrendingUp size={20} color="#10b981" />
            ⛽ Unleaded
          </h3>
          <div style={styles.nozzleGrid}>
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                border: "2px solid #3b82f6",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1e3a8a",
                  }}
                >
                  Order Quantity
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
                      color: "#1e40af",
                    }}
                  >
                    {getUnleadedOrderQty()}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Ordered Quantity</p>
                </div>
              </div>
            </div>

            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
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
                  ATG Quantity
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
                  {isLoadingOffloading ? (
                    <>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "3px solid #e9d5ff",
                          borderTopColor: "#a855f7",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                      <p style={{ ...styles.nozzleMetricLabel, marginTop: "8px" }}>
                        Loading...
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          ...styles.nozzleMetricValue,
                          fontSize: "20px",
                          color: "#7c3aed",
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
                    </>
                  )}
                </div>
              </div>
            </div>

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

        {/* Diesel Section */}
        <div style={styles.nozzleSection}>
          <h3 style={styles.nozzleTitle}>
            <TrendingUp size={20} color="#f59e0b" />
            ⛽ Diesel
          </h3>
          <div style={styles.nozzleGrid}>
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                border: "2px solid #3b82f6",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
              }}
            >
              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1e3a8a",
                  }}
                >
                  Order Quantity
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
                      color: "#1e40af",
                    }}
                  >
                    {getDieselOrderQty()}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Ordered Quantity</p>
                </div>
              </div>
            </div>

            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
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
                  ATG Quantity
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
                  {isLoadingOffloading ? (
                    <>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          border: "3px solid #e9d5ff",
                          borderTopColor: "#a855f7",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                      <p style={{ ...styles.nozzleMetricLabel, marginTop: "8px" }}>
                        Loading...
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          ...styles.nozzleMetricValue,
                          fontSize: "20px",
                          color: "#7c3aed",
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
                    </>
                  )}
                </div>
              </div>
            </div>

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
        {/* All History Table - Shows every refill and autorefill separately */}
        {(offloadingEvents.length > 0 || refillData.length > 0) && (
          <div
            style={{
              ...styles.nozzleSection,
              background: "#ffffff",
            }}
          >
            <h3
              style={{
                ...styles.nozzleTitle,
                color: "#111827",
              }}
            >
              <TrendingUp size={20} color="#3b82f6" />
              📊 Refill & Autorefill History
            </h3>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px"
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Date</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Type</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Product</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Tank ID</th>
                    <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#475569" }}>Volume (L)</th>
                    <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#475569" }}>Dipstick (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {getAllHistory().map((record, index) => {
                    return (
                      <tr 
                        key={`${record.date}-${record.product}-${record.type}-${index}`}
                        style={{ 
                          borderBottom: "1px solid #e2e8f0",
                          backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc"
                        }}
                      >
                        <td style={{ padding: "12px", color: "#64748b" }}>
                          {new Date(record.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: record.type === 'autorefill' ? "#f3e8ff" : "#dbeafe",
                            color: record.type === 'autorefill' ? "#7c3aed" : "#0ea5e9"
                          }}>
                            {record.type === 'autorefill' ? 'Autorefill' : 'Refill'}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: record.product.toUpperCase().includes("UNLEADED") ? "#dcfce7" : "#fef3c7",
                            color: record.product.toUpperCase().includes("UNLEADED") ? "#166534" : "#92400e"
                          }}>
                            {record.product}
                          </span>
                        </td>
                        <td style={{ 
                          padding: "12px",
                          fontWeight: "600",
                          color: "#475569"
                        }}>
                          {record.tankId || record.tankName || '-'}
                        </td>
                        <td style={{ 
                          padding: "12px", 
                          textAlign: "right",
                          fontWeight: "600",
                          color: record.type === 'autorefill' ? "#7c3aed" : "#0ea5e9"
                        }}>
                          {record.volume > 0 ? record.volume.toLocaleString() : '-'}
                        </td>
                        <td style={{ 
                          padding: "12px", 
                          textAlign: "right",
                          fontWeight: "600",
                          color: record.refillDipstick && record.refillDipstick > 0 ? "#22c55e" : "#94a3b8"
                        }}>
                          {record.refillDipstick && record.refillDipstick > 0 ? record.refillDipstick.toLocaleString() : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {getAllHistory().length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "32px",
                color: "#64748b"
              }}>
                No records found for this station
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
