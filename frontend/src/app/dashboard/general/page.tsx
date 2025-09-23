"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Building2,
  Settings,
  LogOut,
  Bell,
  X,
  MapPin,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
//  const apiService = (await import('../../services/api')).default
import apiService from "../../../lib/services/api";
import { useAuth } from "@/lib/hooks/useAuth";
import api from "../../../lib/services/api";
interface Station {
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
  status: string;
  efficiency: number;
  revenue: string;
  nozzles: number;
  alerts: number;
  color: string;
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
    height: "80px", // 64px'den 80px'e çıkar
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  logoSubtitle: {
    fontSize: "16px",
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
    backgroundColor: "#dc2626",
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
  welcomeTitle: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "8px",
  },
  welcomeText: {
    color: "#6b7280",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  metricCard: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "24px",
    transition: "box-shadow 0.2s",
    cursor: "pointer",
  },
  metricHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  metricIcon: {
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    fontSize: "12px",
    fontWeight: "500",
    padding: "4px 8px",
    borderRadius: "9999px",
  },
  metricValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "4px",
  },
  metricLabel: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "12px",
  },
  metricFooter: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: "#6b7280",
  },
  overviewCard: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "24px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "24px",
  },
  alertsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  alertItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    transition: "background-color 0.2s",
    cursor: "pointer",
  },
  alertInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  alertDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  alertDetails: {
    flex: 1,
  },
  alertType: {
    fontWeight: "500",
    color: "#111827",
    margin: 0,
  },
  alertStation: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  alertTime: {
    fontSize: "12px",
    color: "#6b7280",
  },
  viewAllButton: {
    width: "100%",
    marginTop: "16px",
    padding: "8px 16px",
    color: "#2563eb",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "14px",
    fontWeight: "500",
  },
  successMessage: {
    background: "linear-gradient(135deg, #dcfce7 0%, #dbeafe 100%)",
    border: "1px solid #16a34a",
    borderRadius: "16px",
    padding: "24px",
  },
  messageContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  messageIcon: {
    padding: "8px",
    backgroundColor: "#dcfce7",
    borderRadius: "50%",
  },
  messageTitle: {
    fontWeight: "600",
    color: "#166534",
    marginBottom: "4px",
  },
  messageText: {
    color: "#15803d",
  },
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto" as const,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid #e5e7eb",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    transition: "background-color 0.2s",
    color: "#6b7280",
  },
  stationsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  stationCard: {
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stationInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  stationIcon: {
    padding: "12px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stationDetails: {
    flex: 1,
  },
  stationName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
    marginBottom: "4px",
  },
  stationLocation: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  stationMetrics: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  stationMetric: {
    textAlign: "right" as const,
  },
  stationMetricValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  stationMetricLabel: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
  },
  statusIndicator: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    marginLeft: "12px",
  },
};

export default function GeneralDashboard() {
  const { logout } = useAuth();
  const [showStationsModal, setShowStationsModal] = useState(false);
  const [malerts, setAlerts] = useState([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stations data from API
  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("About to call getAllStations...");

      const result = await apiService.getAllStations();
      console.log("API Response:", result);

      if (result.data && Array.isArray(result.data)) {
        // Transform API data to match our component structure
        const transformedStations: Station[] = result.data.map(
          (station: any, index: number) => ({
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
            // Mock data for demo - in production these would come from separate endpoints
            status: index === 0 ? "excellent" : index === 1 ? "good" : "fair",
            efficiency: index === 0 ? 92 : index === 1 ? 88 : 75,
            revenue: index === 0 ? "$4,280" : index === 1 ? "$5,120" : "$3,050",
            nozzles: index === 0 ? 6 : index === 1 ? 8 : 6,
            alerts: index === 0 ? 0 : index === 1 ? 1 : 2,
            color:
              index === 0 ? "#22c55e" : index === 1 ? "#3b82f6" : "#eab308",
          })
        );

        setStations(transformedStations);

        /*const alerts = await api.getAllAlerts();
        // Handle the alerts data
        console.log(alerts.data, transformedStations);
        setAlerts(
          alerts.data.map((alert) => ({
            message: alert.message,
            id: alert.id,
            station:
              transformedStations.find(
                (station) => station.id == alert.stationId
              )?.name || "Unknown Station",
            type: "Cash Discrepancy",
            severity: alert?.severity ?? "high",
            time: alert?.timestamp,
          }))
        );*/
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError((err as Error).message);
      // Fallback to mock data
      setStations([
        {
          id: 1,
          name: "Main Street Station",
          location: "123 Main Street, Downtown",
          status: "excellent",
          efficiency: 92,
          revenue: "$4,280",
          tanks: 2,
          nozzles: 6,
          alerts: 0,
          color: "#22c55e",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchStations();
  }, []);

  const alerts = [
    {
      type: "Water Detection",
      station: "Main Street",
      severity: "high",
      time: "2 hours ago",
      color: "#dc2626",
    },
    {
      type: "Cash Discrepancy",
      station: "Highway Junction",
      severity: "medium",
      time: "4 hours ago",
      color: "#eab308",
    },
    {
      type: "Tank Level Low",
      station: "Airport Road",
      severity: "low",
      time: "6 hours ago",
      color: "#3b82f6",
    },
  ];

  const handleSignOut = async () => {
    await logout();
    // window.location.href = '/signin'
  };

  const handleStationClick = (stationId: number) => {
    window.location.href = `/dashboard/station/${stationId}`;
  };

  const openStationsModal = () => {
    setShowStationsModal(true);
  };

  const closeStationsModal = () => {
    setShowStationsModal(false);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <img
              src="/logo.png" // veya mevcut dosya adınız
              alt="Lake Oil Group Logo"
              style={{
                width: "60px", // 40px'den 60px'e çıkar
                height: "60px", // 40px'den 60px'e çıkar
                objectFit: "contain",
              }}
            />
            <div>
              <h1 style={styles.logoTitle}>LAKE ENERGIES GROUP</h1>
              <p style={styles.logoSubtitle}>General Manager</p>
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
              <span style={styles.badge}>2</span>
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
          <h2 style={styles.welcomeTitle}></h2>
          <h2 style={{ ...styles.welcomeTitle, fontSize: "50px" }}>
            {" "}
            FuelGuard
          </h2>
        </div>

        {/* Key Metrics - Only Total Stations and Active Alerts */}
        <div style={styles.metricsGrid}>
          <div
            style={styles.metricCard}
            onClick={openStationsModal}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div style={styles.metricHeader}>
              <div style={{ ...styles.metricIcon, backgroundColor: "#dbeafe" }}>
                <Building2 size={24} color="#2563eb" />
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  color: "#166534",
                  backgroundColor: "#dcfce7",
                }}
              >
                Active
              </span>
            </div>
            <h3 style={styles.metricValue}>
              {loading ? "-" : stations.length}
            </h3>
            <p style={styles.metricLabel}>Total Stations</p>
            <div style={styles.metricFooter}>
              {loading ? (
                <>
                  <Loader2
                    size={12}
                    style={{
                      marginRight: "4px",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Loading stations...
                </>
              ) : error ? (
                <>
                  <AlertTriangle size={12} style={{ marginRight: "4px" }} />
                  Click to retry
                </>
              ) : (
                <>
                  <TrendingUp size={12} style={{ marginRight: "4px" }} />
                  Click to view all stations
                </>
              )}
            </div>
          </div>

          <div
            style={styles.metricCard}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div style={styles.metricHeader}>
              <div style={{ ...styles.metricIcon, backgroundColor: "#fee2e2" }}>
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  color: "#dc2626",
                  backgroundColor: "#fee2e2",
                }}
              >
                Urgent
              </span>
            </div>
            <h3 style={styles.metricValue}>2</h3>
            <p style={styles.metricLabel}>Active Alerts</p>
            <div style={styles.metricFooter}>
              <AlertTriangle
                size={12}
                color="#dc2626"
                style={{ marginRight: "4px" }}
              />
              Requires attention
            </div>
          </div>
        </div>

        {/* Recent Alerts - Now centered and taking more space */}
        <div style={styles.overviewCard}>
          <h3 style={styles.cardTitle}>Recent Alerts</h3>
          <div style={styles.alertsList}>
            {malerts.map((alertItem, index) => (
              <div
                key={index}
                style={{
                  ...styles.alertItem,
                  cursor: "pointer",
                }}
                onClick={() => {
                  alert(alertItem.message);
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div style={styles.alertInfo}>
                  <div
                    style={{
                      ...styles.alertDot,
                      backgroundColor:
                        alertItem.type == "high" ? "#dc2626" : "#fbbf24",
                    }}
                  ></div>
                  <div style={styles.alertDetails}>
                    <p style={styles.alertType}>{alertItem.type}</p>
                    <p style={styles.alertStation}>{alertItem.station}</p>
                  </div>
                </div>
                <p style={styles.alertTime}>{alertItem.time}</p>
              </div>
            ))}
          </div>
          <button
            style={styles.viewAllButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#dbeafe";
              e.currentTarget.style.color = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#2563eb";
            }}
          >
            View All Alerts
          </button>
        </div>

        {/* Success Message */}
      </main>

      {/* Stations Modal */}
      {showStationsModal && (
        <div style={styles.modalOverlay} onClick={closeStationsModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <Building2 size={20} color="#2563eb" />
                All Stations {loading && "(Loading...)"}
              </h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{ ...styles.closeButton, padding: "6px" }}
                  onClick={fetchStations}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  title="Refresh stations"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  style={styles.closeButton}
                  onClick={closeStationsModal}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px",
                  backgroundColor: "#fef2f2",
                  borderRadius: "8px",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AlertTriangle size={16} />
                Error loading stations: {error}
              </div>
            )}

            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px",
                  color: "#6b7280",
                }}
              >
                <Loader2
                  size={24}
                  style={{
                    marginRight: "8px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Loading stations from server...
              </div>
            ) : (
              <div style={styles.stationsList}>
                {stations.map((station) => (
                  <div
                    key={station.id}
                    style={styles.stationCard}
                    onClick={() => handleStationClick(station.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <div style={styles.stationInfo}>
                      <div
                        style={{
                          ...styles.stationIcon,
                          backgroundColor: `
                      e.currentTarget.style.backgroundColor = "#f9fafb"20`,
                        }}
                      >
                        <Building2 size={20} color="#2563eb" />
                      </div>
                      <div style={styles.stationDetails}>
                        <h4 style={styles.stationName}>{station.name}</h4>
                        <p style={styles.stationLocation}>
                          <MapPin size={12} />
                          {station.location}
                        </p>
                        
                        {station.ewuraLicense && (
                          <p
                            style={{
                              ...styles.stationLocation,
                              color: "#9ca3af",
                              fontSize: "11px",
                            }}
                          >
                            License: {station.ewuraLicense}
                          </p>
                        )}
                      </div>
                    </div>

                    
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Activity size={14} />
                Click on any station to access its detailed dashboard and
                controls.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
