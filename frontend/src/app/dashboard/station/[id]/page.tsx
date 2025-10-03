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
    
    if (response && response.data && response.data.records) {
      const currentStationSerial = stationData?.LicenseeTraSerialNo;
      
      console.log('Current station serial:', currentStationSerial);
      console.log('All autorefill records:', response.data.records);
      
      if (currentStationSerial) {
        // Filter by station serial - GET ALL RECORDS, not just latest
        const filteredRecords = response.data.records.filter((record: any) =>
          record.station_serial === currentStationSerial
        );
        
        console.log('Filtered autorefill records:', filteredRecords);
        
        // Convert ALL records to OffloadingEvent format
        const events: OffloadingEvent[] = filteredRecords.map((record: any) => ({
          id: record.id?.toString(),
          station: record.station_serial,
          stationSerial: record.station_serial,
          productName: record.product,
          tank: record.product,
          date: record.issue_date,
          startTime: record.issue_date,
          offload_volume_liters: record.fuel_volume || 0
        }));
        
        // Sort by date descending (newest first)
        events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setOffloadingEvents(events);
      } else {
        setOffloadingEvents([]);
      }
    } else {
      throw new Error("Invalid API response structure");
    }
  } catch (error: any) {
    console.error('Error fetching offloading data:', error);
    setOffloadingEvents([]);
  } finally {
    setIsLoadingOffloading(false);
  }
};

  // Fetch refill data from API
  const fetchRefillData = async () => {
    try {
      console.log("Fetching refill data...");
      const response = await apiService.getStationRefillReport();
      
      if (response && response.data && response.data.records) {
        const currentStationSerial = stationData?.LicenseeTraSerialNo;
        
        console.log('Current station serial:', currentStationSerial);
        console.log('All refill records:', response.data.records);
        
        if (currentStationSerial) {
          const filteredRecords = response.data.records.filter((record: any) =>
            record.station_serial === currentStationSerial
          );
          
          console.log('Filtered refill records:', filteredRecords);
          
          const latestByProduct: { [key: string]: any } = {};
          filteredRecords.forEach((record: any) => {
            const product = record.product;
            if (!latestByProduct[product] || record.id > latestByProduct[product].id) {
              latestByProduct[product] = record;
            }
          });
          
          const latestRecords = Object.values(latestByProduct).sort((a: any, b: any) => b.id - a.id);
          console.log('Latest refill records by product:', latestRecords);
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

  // Fetch station data from API
  const fetchStationData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching station data for ID:", id);
      const station = await apiService.getStation(id);

      if (station) {
        console.log("Station data loaded:", station);
        setStationData({
          id: station.id,
          name: station.RetailStationName,
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
        tanks: 2,
        ewuraLicense: "License unavailable",
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    await Promise.all([
      fetchStationData(),
      fetchRefillData(),
      fetchOffloadingData()
    ]);
  };

  // Load station data on mount
  useEffect(() => {
    fetchStationData();
  }, [id]);

  // Load refill and offloading data when station is loaded
  useEffect(() => {
    if (stationData?.LicenseeTraSerialNo) {
      fetchRefillData();
      fetchOffloadingData();
    }
  }, [stationData?.LicenseeTraSerialNo]);

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <div style={styles.container}>
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

      <main style={styles.main}>
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
                  {isLoadingOffloading ? (
                    <p
                      style={{
                        ...styles.nozzleMetricValue,
                        fontSize: "14px",
                        color: "#a855f7",
                      }}
                    >
                      Loading...
                    </p>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>

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
                  {isLoadingOffloading ? (
                    <p
                      style={{
                        ...styles.nozzleMetricValue,
                        fontSize: "14px",
                        color: "#a855f7",
                      }}
                    >
                      Loading...
                    </p>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>

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
        {/* Autorefill History Table */}
        {offloadingEvents.length > 0 && (
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
              📊 Autorefill History (ATG Detected Offloading)
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
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: "600", color: "#475569" }}>Product</th>
                    <th style={{ padding: "12px", textAlign: "right", fontWeight: "600", color: "#475569" }}>Volume (L)</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {offloadingEvents.map((event, index) => (
                    <tr 
                      key={event.id || index}
                      style={{ 
                        borderBottom: "1px solid #e2e8f0",
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc"
                      }}
                    >
                      <td style={{ padding: "12px", color: "#64748b" }}>
                        {new Date(event.date).toLocaleDateString('en-US', {
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
                          backgroundColor: event.tank.toUpperCase() === "UNLEADED" ? "#dcfce7" : "#dbeafe",
                          color: event.tank.toUpperCase() === "UNLEADED" ? "#166534" : "#1e40af"
                        }}>
                          {event.tank}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "12px", 
                        textAlign: "right",
                        fontWeight: "600",
                        color: "#0f172a"
                      }}>
                        {event.offload_volume_liters.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px", color: "#64748b", fontSize: "12px" }}>
                        {event.station}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {offloadingEvents.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "32px",
                color: "#64748b"
              }}>
                No autorefill records found for this station
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}