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
  id?: string;
  station: string;
  stationSerial?: string;
  productName?: string;
  tank: string;
  date: string;
  startTime?: string;
  endTime?: string;
  startReading?: number;
  endReading?: number;
  offload_volume_liters: number;
  offloadingQty?: number;
  startRecordId?: number;
  endRecordId?: number;
  detectionWindow?: number;
  tankId?: string;
  tankName?: string;
  duration?: string;
  formattedStartTime?: string;
  formattedEndTime?: string;
  formattedQuantity?: string;
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
  
  // State declarations
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refillData, setRefillData] = useState<any[]>([]);
  const [offloadingEvents, setOffloadingEvents] = useState<OffloadingEvent[]>([]);
  const [isLoadingOffloading, setIsLoadingOffloading] = useState(false);

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
    const events = offloadingEvents.filter(e => 
      e.tank.toUpperCase() === "UNLEADED" && 
      e.station === stationData?.LicenseeTraSerialNo
    );
    
    console.log('Unleaded offloading events:', events);
    console.log('Current station serial:', stationData?.LicenseeTraSerialNo);
    console.log('All offloading events:', offloadingEvents);
    
    if (events.length === 0) return "0 L";
    const latest = events[events.length - 1];
    return `${(latest.offload_volume_liters).toLocaleString()} L`;
  };

  const getDieselOffloading = () => {
    const events = offloadingEvents.filter(e => 
      (e.tank.toUpperCase() === "DIESEL" || e.tank.toUpperCase() === "DIESLE") && 
      e.station === stationData?.LicenseeTraSerialNo
    );
    
    console.log('Diesel offloading events:', events);
    
    if (events.length === 0) return "0 L";
    const latest = events[events.length - 1];
    return `${(latest.offload_volume_liters).toLocaleString()} L`;
  };

  const getUnleadedOffloadingDate = () => {
    const unleadedOffloading = offloadingEvents
      .filter(event => 
        (event.productName === "UNLEADED" || event.productName === "Unleaded" || event.tank.toUpperCase() === "UNLEADED") &&
        (event.stationSerial === stationData?.LicenseeTraSerialNo || event.station === stationData?.LicenseeTraSerialNo)
      )
      .slice(-1)[0];
      
    if (unleadedOffloading) {
      const dateStr = unleadedOffloading.startTime || unleadedOffloading.date;
      return `Date: ${new Date(dateStr).toLocaleDateString()}`;
    }
    return "No recent offloading";
  };

  const getDieselOffloadingDate = () => {
    const dieselOffloading = offloadingEvents
      .filter(event => 
        (event.productName === "DIESEL" || event.productName === "DIESLE" || event.tank.toUpperCase() === "DIESEL" || event.tank.toUpperCase() === "DIESLE") &&
        (event.stationSerial === stationData?.LicenseeTraSerialNo || event.station === stationData?.LicenseeTraSerialNo)
      )
      .slice(-1)[0];
      
    if (dieselOffloading) {
      const dateStr = dieselOffloading.startTime || dieselOffloading.date;
      return `Date: ${new Date(dateStr).toLocaleDateString()}`;
    }
    return "No recent offloading";
  };

  const getUnleadedOffloadingValue = () => {
    const events = offloadingEvents.filter(e => 
      e.tank.toUpperCase() === "UNLEADED" && 
      e.station === stationData?.LicenseeTraSerialNo
    );
    if (events.length === 0) return 0;
    return events[events.length - 1].offload_volume_liters;
  };

  const getDieselOffloadingValue = () => {
    const events = offloadingEvents.filter(e => 
      (e.tank.toUpperCase() === "DIESEL" || e.tank.toUpperCase() === "DIESLE") && 
      e.station === stationData?.LicenseeTraSerialNo
    );
    if (events.length === 0) return 0;
    return events[events.length - 1].offload_volume_liters;
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

  // API Functions
  const fetchOffloadingData = async () => {
    setIsLoadingOffloading(true);
    try {
      const response = await apiService.getStationAutoRefillReport();
      
      // Handle both array response and object with data property
      let events: OffloadingEvent[] = [];
      
      if (Array.isArray(response)) {
        events = response as OffloadingEvent[];
      } else if (response && response.data) {
        if (Array.isArray(response.data)) {
          events = response.data as OffloadingEvent[];
        } else {
          events = Object.values(response.data) as OffloadingEvent[];
        }
      }
      
      setOffloadingEvents(events);
    } catch (error: any) {
      console.error('Error fetching offloading data:', error);
      // Set empty array if API fails - dashboard will show "0 L" and "No recent offloading"
      setOffloadingEvents([]);
      
      // Only show error in console, not to user since it's handled gracefully
      if (error?.message?.includes('No associated station found')) {
        console.warn('No offloading data available for this station');
      }
    } finally {
      setIsLoadingOffloading(false);
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

  const refreshAllData = async () => {
    await Promise.all([
      fetchStationData(),
      fetchRefillData(),
      fetchOffloadingData()
    ]);
  };

  // Effects - Consolidated to prevent multiple calls
  useEffect(() => {
    fetchStationData();
  }, [id]);

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