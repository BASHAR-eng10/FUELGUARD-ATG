"use client";

import { useState, useEffect, use } from "react";
import {
  Shield,
  Gauge,
  Droplets,
  DollarSign,
  AlertTriangle,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Clock,
  Thermometer,
  Target,
  Edit3,
  Truck,
  Loader2,
  RefreshCw,
} from "lucide-react";
import apiService from "../../../../lib/services/api";
import { useAuth } from "@/lib/hooks/useAuth";
import { updateCurrentManualCashEntries } from "@/lib/services/externalApiService";
import api from "../../../../lib/services/api";

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

interface NozzleData {
  id: number;
  name: string;
  sold: number;
  price: number;
  percentage: number;
  status: boolean;
  e_total?: number;
  v_total?: number;
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
  welcomeTitle: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "8px",
  },
  welcomeText: {
    color: "#6b7280",
  },
  tankGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  tankCard: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "24px",
  },
  tankHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  tankInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  tankIcon: {
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tankDetails: {
    flex: 1,
  },
  tankName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  tankCapacity: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  statusBadge: {
    fontSize: "12px",
    fontWeight: "500",
    padding: "4px 8px",
    borderRadius: "9999px",
  },
  levelSection: {
    marginBottom: "16px",
  },
  levelHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  levelLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  levelPercentage: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  progressBar: {
    width: "100%",
    height: "12px",
    backgroundColor: "#e5e7eb",
    borderRadius: "9999px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.3s ease",
  },
  levelDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
    fontSize: "12px",
    color: "#6b7280",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "16px",
  },
  metricBox: {
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "12px",
  },
  metricHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
  },
  metricLabel: {
    fontSize: "12px",
    color: "#6b7280",
  },
  metricValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  quantitySection: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "16px",
    border: "1px solid #e2e8f0",
  },
  quantityTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  quantityGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  quantityItem: {
    background: "#ffffff",
    borderRadius: "8px",
    padding: "12px",
    border: "1px solid #e2e8f0",
  },
  quantityLabel: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  quantityValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },
  editButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  inputField: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
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
  nozzleStatus: {
    fontSize: "10px",
    fontWeight: "500",
    padding: "2px 6px",
    borderRadius: "6px",
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "24px",
    transition: "box-shadow 0.2s",
    cursor: "pointer",
  },
  statHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  statIcon: {
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "4px",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "12px",
  },
  statFooter: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: "#6b7280",
  },
  actionsCard: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    padding: "24px",
    marginBottom: "32px",
  },
  actionsTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "24px",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "16px",
  },
  actionButton: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "14px",
    fontWeight: "500",
  },
  successMessage: {
    background: "linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)",
    border: "1px solid #3b82f6",
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
    backgroundColor: "#dbeafe",
    borderRadius: "50%",
  },
  messageTitle: {
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: "4px",
  },
  messageText: {
    color: "#1e3a8a",
  },
  loadingState: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6b7280",
    fontSize: "14px",
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
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  closeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    color: "#6b7280",
  },
  checklistContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  checklistItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s",
  },
  checklistItemChecked: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    border: "2px solid #d1d5db",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  checkboxChecked: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
    color: "#ffffff",
  },
  checklistLabel: {
    fontSize: "16px",
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  checklistLabelChecked: {
    color: "#166534",
  },
  modalFooter: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  modalButton: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  saveButton: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
  },
  salesRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "12px",
  },
  salesRowTotal: {
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
    fontWeight: "600",
  },
  salesRowETotals: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
    fontWeight: "600",
  },
  salesLabel: {
    fontSize: "16px",
    color: "#374151",
    fontWeight: "500",
  },
  salesValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
  },
  salesValueHighlight: {
    color: "#16a34a",
    fontSize: "20px",
  },
  salesDetails: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },
  salesIcon: {
    marginRight: "8px",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical" as const,
    outline: "none",
    transition: "border-color 0.2s",
  },
  selectField: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    outline: "none",
    transition: "border-color 0.2s",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
  },
  urgentCategory: {
    backgroundColor: "#fee2e2",
    borderColor: "#dc2626",
  },
  characterCount: {
    fontSize: "12px",
    color: "#6b7280",
    textAlign: "right" as const,
    marginTop: "4px",
  },
  sendingButton: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
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
  const [nozzleData, setNozzleData] = useState<NozzleData[]>([]);
  const [tankData, setTankData] = useState<TankData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pumpsLoading, setPumpsLoading] = useState(true);
  const [tanksLoading, setTanksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pumpsError, setPumpsError] = useState<string | null>(null);
  const [tanksError, setTanksError] = useState<string | null>(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [loadingSalesModal, setLoadingSalesModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueMessage, setIssueMessage] = useState("");
  const [issueCategory, setIssueCategory] = useState("general");
  const [issueSending, setIssueSending] = useState(false);
  const [checklistItems, setChecklistItems] = useState({
    calibration: false,
    pipelineLeak: false,
    tankLeak: false,
    safetyEquipment: false,
  });

  const [managerCash, setManagerCash] = useState("");
  // Add this with your other state declarations
  const [dailyReportData, setDailyReportData] = useState(null);
  const [dailyReportLoading, setDailyReportLoading] = useState(true);
  const [dailyReportError, setDailyReportError] = useState<string | null>(null);

  // Sales data - normally would come from API
  const [salesData] = useState({
    unleaded: {
      liters: 4220,
      pricePerLiter: 1.45,
      cash: 4220 * 1.45,
    },
    diesel: {
      liters: 5800,
      pricePerLiter: 1.52,
      cash: 5800 * 1.52,
    },
    eTotalCash: 14629,
  });

  // Fetch pump data from API
  // Replace your fetchDailyReportData function with this:
  const fetchDailyReportData = async (license: string) => {
    try {
      setDailyReportLoading(true);
      setPumpsLoading(true);
      setDailyReportError(null);

      console.log("Fetching daily report data for station ID:", id);

      // Call your new EWURA daily report API using fetch directly
      const response = await apiService.getStationDailyReport(license);
      console.log("Daily Report API Response:", response);

      if (response) {
        setDailyReportData(response.report);
        setNozzleData(
          response.report.pumps_list.map(
            (pump: {
              id: any;
              pump: any;
              total_volume: any;
              Price: any;
              sales_count: any;
              electronic_totalizer: any;
              virtual_totalizer: any;
            }) => ({
              id: pump.id,
              name: pump.pump,
              liters: pump.total_volume,
              price: pump.Price,
              sold: pump.total_volume,
              e_total: pump.electronic_totalizer,
              v_total: pump.virtual_totalizer,
            })
          )
        );
      } else {
        throw new Error("Invalid daily report response structure");
      }
    } catch (err) {
      console.error("Error fetching daily report data:", err);
      setDailyReportError((err as Error).message);
    } finally {
      setDailyReportLoading(false);
      setPumpsLoading(false);
    }
  };
  const fetchPumpData = async () => {
    try {
      setPumpsLoading(true);
      setPumpsError(null);
      const response = await apiService.getStationPumps();
      console.log("Pump API Response:", response);

      if (response.data && Array.isArray(response.data)) {
        setNozzleData(response.data);
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Error fetching pump data:", err);
      setPumpsError((err as Error).message);
    } finally {
      setPumpsLoading(false);
    }
  };

  // Fetch tank data from API
  const fetchTankData = async (license: string) => {
    try {
      setTanksLoading(true);
      setTanksError(null);
      const response = await apiService.getStationTanks(license);

      if (response) {
        setTankData(
          response.map(
            (tank: {
              id: any;
              tank_name: any;
              tank_capacity: any;
              product_name: any;
              fuel_volume: any;
              water_volume: any;
              water_lvl_mm: any;
              average_temp: any;
            }) => ({
              id: tank.id,
              name: tank.tank_name,
              tank_capacity: tank.tank_capacity,
              product_name: tank.product_name,
              fuel_volume: tank.fuel_volume,
              water_lvl_mm: tank.water_lvl_mm,
              water_volume: tank.water_volume,
              average_temp: tank.average_temp,
            })
          )
        ); // console.log(response.data)
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Error fetching tank data:", err);
      setTanksError((err as Error).message);
    } finally {
      setTanksLoading(false);
    }
  };
  // Fetch station data from API
  const fetchStationData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching station data for ID:", id);

      // Fetch station info
      const station = await apiService.getStation(id);
      console.log("Station API Response:", station);

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
        });
      } else {
        console.error("Invalid API response structure:", station);
        throw new Error(
          `Station with ID ${id} not found. Available stations: ${station.id}`
        );
      }
    } catch (err) {
      console.error("Error fetching station data:", err);
      setError((err as Error).message);
      // Enhanced fallback data
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
      console.log(
        "Station data loaded, now fetching daily report with license:",
        stationData.ewuraLicense
      );
      fetchDailyReportData(stationData.ewuraLicense);
      fetchTankData(stationData.ewuraLicense);
    }
  }, [stationData]);

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleSignOut = async () => {
    await logout();
  };

  const handleChecklistItemChange = (item: keyof typeof checklistItems) => {
    setChecklistItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleSaveChecklist = () => {
    console.log("Checklist saved:", checklistItems);
    // Here you would typically save to your API
    setShowChecklistModal(false);
  };

  const handleCloseModal = () => {
    setShowChecklistModal(false);
  };

  const handleCloseSalesModal = () => {
    setShowSalesModal(false);
  };

  const handleSaveSales = async () => {
    console.log("Sales data recorded:", salesData);
    //TODO: lreajslkjlk HERE I AM
    managerCash && console.log("stationid:", id);
    console.log(
      "Total actual cash:",
      salesData.diesel.cash * salesData.diesel.liters +
        salesData.unleaded.cash * salesData.unleaded.liters
    );
    console.log("Total manual cash:", managerCash);
    const actualCash =
      salesData.diesel.cash * salesData.diesel.liters +
      salesData.unleaded.cash * salesData.unleaded.liters;
    setLoadingSalesModal(true);
    await api
      .updateCurrentCashEntry(id, actualCash, parseFloat(managerCash))
      .then(() => {
        setLoadingSalesModal(false);
      })
      .finally(() => {
        setShowSalesModal(false);
      });
    // Here you would typically save to your API
  };

  const handleCloseIssueModal = () => {
    setShowIssueModal(false);
    setIssueMessage("");
    setIssueCategory("general");
  };

  const handleSendIssueReport = async () => {
    if (!issueMessage.trim()) {
      alert("Please enter an issue description before sending.");
      return;
    }

    setIssueSending(true);

    try {
      // Simulate API call to send SMS
      const issueData = {
        stationId: stationData?.id,
        stationName: stationData?.name,
        category: issueCategory,
        message: issueMessage,
        timestamp: new Date().toISOString(),
        managerName: "Station Manager", // Could be from auth context
        urgency: issueCategory === "emergency" ? "HIGH" : "NORMAL",
      };

      console.log("Sending issue report:", issueData);

      // Here you would call your SMS API
      // await apiService.sendIssueReport(issueData)

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        `Issue report sent successfully!\n\nSMS sent to General Manager:\n"STATION ALERT: ${
          stationData?.name || "Station"
        } - ${issueCategory.toUpperCase()}\n${issueMessage}\nReported by: Station Manager\nTime: ${new Date().toLocaleString()}"`
      );

      handleCloseIssueModal();
    } catch (error) {
      console.error("Error sending issue report:", error);
      alert("Failed to send issue report. Please try again.");
    } finally {
      setIssueSending(false);
    }
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
          <h2 style={styles.welcomeTitle}>Station Overview </h2>
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
                  📍 <strong>Location:</strong> {stationData.location}
                </div>
                <div>
                  🏢 <strong>Operator:</strong> {stationData.operatorName}
                </div>
                <div>
                  📋 <strong>License:</strong> {stationData.ewuraLicense}
                </div>
                <div>
                  🛢️ <strong>Tanks:</strong>{" "}
                  {tanksLoading
                    ? "Loading..."
                    : tankData.length || stationData.tanks}
                </div>
                <div>
                  ⛽ <strong>Pumps/Nozzles:</strong>{" "}
                  {pumpsLoading ? "Loading..." : nozzleData.length}
                </div>
              </div>

              {(pumpsError || tanksError) && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    backgroundColor: "#fee2e2",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#dc2626",
                  }}
                >
                  {pumpsError && <div>⚠️ Pump data error: {pumpsError}</div>}
                  {tanksError && <div>⚠️ Tank data error: {tanksError}</div>}
                  <div style={{ marginTop: "4px", fontSize: "11px" }}>
                    Using fallback data where available
                  </div>
                </div>
              )}

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
        {/* Fuel Pricing Section - Enhanced with Colored Backgrounds */}
        <div
          style={{
            ...styles.nozzleSection,
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            border: "2px solid #e2e8f0",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            padding: "24px",
          }}
        >
          <h3 style={styles.nozzleTitle}>
            <DollarSign size={20} color="#16a34a" />
            Fuel Pricing & Sales
          </h3>
          <div style={styles.nozzleGrid}>
            {/* Unleaded Price Card - Green Background */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                border: "3px solid #16a34a",
                borderRadius: "16px",
                boxShadow: "0 6px 20px rgba(22, 163, 74, 0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Green accent stripe */}
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

              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    color: "#14532d",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  Unleaded Price
                </span>
                <span
                  style={{
                    ...styles.nozzleStatus,
                    color: "#166534",
                    backgroundColor: "#dcfce7",
                    border: "1px solid #16a34a",
                  }}
                >
                  Active
                </span>
              </div>
              <div style={styles.nozzleMetrics}>
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "24px",
                      color: "#14532d",
                    }}
                  >
                    {nozzleData.find((nozzle) => nozzle.name.includes("A1"))
                      ?.price + " TSH" || "??? TSH"}
                  </p>
                  <p style={{ ...styles.nozzleMetricLabel, color: "#15803d" }}>
                    Per Liter
                  </p>
                </div>
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "24px",
                      color: "#14532d",
                    }}
                  >
                    {nozzleData
                      .filter((nozzle) => nozzle.name.includes("A1"))
                      .reduce((sum, nozzle) => sum + nozzle.sold, 0)
                      .toLocaleString() + " L"}
                  </p>
                  <p style={{ ...styles.nozzleMetricLabel, color: "#15803d" }}>
                    Sold Today
                  </p>
                </div>
              </div>
            </div>

            {/* Diesel Price Card - Blue Background */}
            <div
              style={{
                ...styles.nozzleCard,
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                border: "3px solid #3b82f6",
                borderRadius: "16px",
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Blue accent stripe */}
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

              <div style={styles.nozzleHeader}>
                <span
                  style={{
                    ...styles.nozzleName,
                    color: "#1e3a8a",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  Diesel Price
                </span>
                <span
                  style={{
                    ...styles.nozzleStatus,
                    color: "#1e40af",
                    backgroundColor: "#dbeafe",
                    border: "1px solid #3b82f6",
                  }}
                >
                  Active
                </span>
              </div>
              <div style={styles.nozzleMetrics}>
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "24px",
                      color: "#1e3a8a",
                    }}
                  >
                    {nozzleData.find((nozzle) => nozzle.name.includes("A2"))
                      ?.price + " TSH" || "??? TSH"}
                  </p>
                  <p style={{ ...styles.nozzleMetricLabel, color: "#1d4ed8" }}>
                    Per Liter
                  </p>
                </div>
                <div style={styles.nozzleMetric}>
                  <p
                    style={{
                      ...styles.nozzleMetricValue,
                      fontSize: "24px",
                      color: "#1e3a8a",
                    }}
                  >
                    {nozzleData
                      .filter((nozzle) => nozzle.name.includes("A2"))
                      .reduce((sum, nozzle) => sum + nozzle.sold, 0)
                      .toLocaleString() + " L"}{" "}
                  </p>
                  <p style={{ ...styles.nozzleMetricLabel, color: "#1d4ed8" }}>
                    Sold Today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unleaded Sales Analysis - Enhanced with Green Background */}
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
          {/* Green accent border */}
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
            <TrendingUp size={20} color="#16a34a" />⛽ Unleaded Sales Analysis
          </h3>
          <div style={styles.nozzleGrid}>
            {/* E_Total Sales - Enhanced */}
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
                  E_Total Sales
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
                    {nozzleData
                      .filter((nozzle) => nozzle.name.includes("A1"))
                      .reduce((sum, nozzle) => sum + nozzle.e_total!, 0)
                      .toLocaleString() + " L"}{" "}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Total Liters</p>
                </div>
              </div>
            </div>

            {/* V_Total Sales - Enhanced */}
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
                  V_Total Sales
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
                    {nozzleData
                      .filter((nozzle) => nozzle.name.includes("A1"))
                      .reduce((sum, nozzle) => sum + nozzle.v_total!, 0)
                      .toLocaleString() + " L"}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Total Liters</p>
                </div>
              </div>
            </div>

            {/* E_Total vs V_Total - Enhanced */}
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
                  Difference of E_Total vs V_Total
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
                    {(
                      nozzleData
                        .filter((nozzle: NozzleData) =>
                          nozzle.name.includes("A1")
                        )
                        .reduce(
                          (sum: number, nozzle: NozzleData) =>
                            sum + (nozzle.e_total || 0),
                          0
                        ) -
                      nozzleData
                        .filter((nozzle: NozzleData) =>
                          nozzle.name.includes("A1")
                        )
                        .reduce(
                          (sum: number, nozzle: NozzleData) =>
                            sum + (nozzle.v_total || 0),
                          0
                        )
                    ).toLocaleString()}{" "}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Difference</p>
                </div>
              </div>
            </div>

            {/* M_Total Sales - Enhanced with Input */}

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
                  M_Total Sales
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
                  <input
                    type="number"
                    placeholder="29,800"
                    style={{
                      width: "120px",
                      padding: "8px 12px",
                      border: "2px solid #bbf7d0",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#14532d",
                      background: "#ffffff",
                      textAlign: "center",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#22c55e";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(34, 197, 94, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#bbf7d0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <p style={styles.nozzleMetricLabel}>Manual Reading</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Unleaded Order Analysis - Enhanced with Green Background */}
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
          {/* Green accent border */}
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
                    30,000 L
                  </p>
                  <p style={styles.nozzleMetricLabel}>Order Quantity</p>
                </div>
              </div>
            </div>

            {/* Order (ATG) */}
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
                  Order (ATG)
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
                    30,000 L
                  </p>
                  <p style={styles.nozzleMetricLabel}>ATG Reading</p>
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
                    0 L
                  </p>
                  <p style={styles.nozzleMetricLabel}>Difference</p>
                </div>
              </div>
            </div>

            {/* Order (Manual) - Enhanced with Input */}
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
                  <input
                    type="number"
                    placeholder="29,800"
                    style={{
                      width: "120px",
                      padding: "8px 12px",
                      border: "2px solid #bbf7d0",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#14532d",
                      background: "#ffffff",
                      textAlign: "center",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#22c55e";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(34, 197, 94, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#bbf7d0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <p style={styles.nozzleMetricLabel}>Manual Reading</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diesel Sales Analysis - Enhanced with Blue Background */}
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
          {/* Blue accent border */}
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
            🚛 Diesel Sales Analysis
          </h3>
          <div style={styles.nozzleGrid}>
            {/* E_Total Sales - Enhanced */}
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
                  E_Total Sales
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
{nozzleData
                      .filter((nozzle) => nozzle.name.includes("A2"))
                      .reduce((sum, nozzle) => sum + nozzle.e_total!, 0)
                      .toLocaleString() + " L"}{" "}                  </p>
                  <p style={styles.nozzleMetricLabel}>Total Liters</p>
                </div>
              </div>
            </div>

            {/* V_Total Sales - Enhanced */}
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
                  V_Total Sales
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
                     {nozzleData
                      .filter((nozzle) => nozzle.name.includes("A2"))
                      .reduce((sum, nozzle) => sum + nozzle.v_total!, 0)
                      .toLocaleString() + " L"}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Total Liters</p>
                </div>
              </div>
            </div>

            {/* E_Total vs V_Total - Enhanced */}
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
                  Difference of E_Total vs V_Total
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
                    {(
                      nozzleData
                        .filter((nozzle: NozzleData) =>
                          nozzle.name.includes("A2")
                        )
                        .reduce(
                          (sum: number, nozzle: NozzleData) =>
                            sum + (nozzle.e_total || 0),
                          0
                        ) -
                      nozzleData
                        .filter((nozzle: NozzleData) =>
                          nozzle.name.includes("A2")
                        )
                        .reduce(
                          (sum: number, nozzle: NozzleData) =>
                            sum + (nozzle.v_total || 0),
                          0
                        )
                    ).toLocaleString()}{" "}
                  </p>
                  <p style={styles.nozzleMetricLabel}>Difference</p>
                </div>
              </div>
            </div>

            {/* M_Total Sales - Enhanced with Input */}

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
                  M_Total Sales
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
                  <input
                    type="number"
                    placeholder="29,800"
                    style={{
                      width: "120px",
                      padding: "8px 12px",
                      border: "2px solid #bbf7d0",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#14532d",
                      background: "#ffffff",
                      textAlign: "center",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#22c55e";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(34, 197, 94, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#bbf7d0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <p style={styles.nozzleMetricLabel}>Manual Reading</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Diesel Order Analysis - Enhanced with Blue Background */}
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
          {/* Blue accent border */}
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
                    25,000 L
                  </p>
                  <p style={styles.nozzleMetricLabel}>Order Quantity</p>
                </div>
              </div>
            </div>

            {/* Order (ATG) */}
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
                  Order (ATG)
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
                    25,000 L
                  </p>
                  <p style={styles.nozzleMetricLabel}>ATG Reading</p>
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
                    0 L
                  </p>
                  <p style={styles.nozzleMetricLabel}>Difference</p>
                </div>
              </div>
            </div>

            {/* Order (Manual) - Enhanced with Input */}
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
                  <input
                    type="number"
                    placeholder="29,800"
                    style={{
                      width: "120px",
                      padding: "8px 12px",
                      border: "2px solid #bbf7d0",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#14532d",
                      background: "#ffffff",
                      textAlign: "center",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#22c55e";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(34, 197, 94, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#bbf7d0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <p style={styles.nozzleMetricLabel}>Manual Reading</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={styles.statsGrid}>
          <div
            style={styles.statCard}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIcon, backgroundColor: "#dcfce7" }}>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#16a34a",
                  }}
                >
                  TSH
                </span>
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  color: "#166534",
                  backgroundColor: "#dcfce7",
                }}
              >
                E_total
              </span>
            </div>
            <h3 style={styles.statValue}>31,695,000 TSH</h3>
            <p style={styles.statLabel}>E_Total Revenue</p>
            <div style={styles.statFooter}>
              <TrendingUp size={12} style={{ marginRight: "4px" }} />
              vs yesterday
            </div>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIcon, backgroundColor: "#f0fdf4" }}>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#16a34a",
                  }}
                >
                  💰
                </span>
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  color: "#166534",
                  backgroundColor: "#dcfce7",
                }}
              >
                Manual
              </span>
            </div>
            <h3 style={styles.statValue}>
              {managerCash
                ? `${parseFloat(managerCash).toLocaleString()} TSH`
                : "No Entry"}
            </h3>
            <p style={styles.statLabel}>Manager's Cash</p>
            <div style={styles.statFooter}>
              <Clock size={12} style={{ marginRight: "4px" }} />
              Manual count
            </div>
          </div>

          {/* UNLEADED CASH CARD - Green themed */}
          <div
            style={{
              ...styles.statCard,
              background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
              border: "2px solid #16a34a",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(22, 163, 74, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIcon, backgroundColor: "#dbeafe" }}>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#2563eb",
                  }}
                >
                  ⛽
                </span>
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  color: "#166534",
                  backgroundColor: "#dcfce7",
                }}
              >
                Unleaded
              </span>
            </div>
            <h3 style={{ ...styles.statValue, color: "#16a34a" }}>
              13,715,000 TSH
            </h3>
            <p style={styles.statLabel}>Unleaded Cash</p>
            <div style={styles.statFooter}>
              <TrendingUp size={12} style={{ marginRight: "4px" }} />
              4,220 L sold
            </div>
          </div>

          {/* DIESEL CASH CARD - Blue themed */}
          <div
            style={{
              ...styles.statCard,
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              border: "2px solid #3b82f6",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(59, 130, 246, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 1px 3px 0 rgba(0, 0, 0, 0.1)")
            }
          >
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIcon, backgroundColor: "#f3e8ff" }}>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#3b82f6",
                  }}
                >
                  🚛
                </span>
              </div>
              <span
                style={{
                  ...styles.statusBadge,
                  color: "#1e40af",
                  backgroundColor: "#dbeafe",
                }}
              >
                Diesel
              </span>
            </div>
            <h3 style={{ ...styles.statValue, color: "#1d4ed8" }}>
              17,980,000 TSH
            </h3>
            <p style={styles.statLabel}>Diesel Cash</p>
            <div style={styles.statFooter}>
              <TrendingUp size={12} style={{ marginRight: "4px" }} />
              5,800 L sold
            </div>
          </div>
        </div>

        {/* Tank Monitoring */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Gauge size={20} color="#2563eb" />
              Tank Monitoring
              {tanksLoading && (
                <div style={styles.loadingState}>
                  <Loader2 size={16} className="animate-spin" />
                  Loading tank data...
                </div>
              )}
            </h3>
            {tanksError && (
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#fee2e2",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <AlertTriangle size={12} />
                Tank data error: {tanksError}
              </div>
            )}
          </div>

          {tanksLoading ? (
            <div style={styles.tankGrid}>
              {[1, 2].map((index) => (
                <div
                  key={index}
                  style={{
                    ...styles.tankCard,
                    opacity: 0.6,
                  }}
                >
                  <div style={styles.tankHeader}>
                    <div style={styles.tankInfo}>
                      <div
                        style={{
                          ...styles.tankIcon,
                          backgroundColor: "#f3f4f6",
                        }}
                      >
                        <Loader2
                          size={24}
                          color="#9ca3af"
                          className="animate-spin"
                        />
                      </div>
                      <div style={styles.tankDetails}>
                        <h4 style={{ ...styles.tankName, color: "#9ca3af" }}>
                          Loading Tank {index}...
                        </h4>
                        <p style={{ ...styles.tankCapacity, color: "#9ca3af" }}>
                          Fetching capacity...
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        color: "#9ca3af",
                        backgroundColor: "#f3f4f6",
                      }}
                    >
                      Loading
                    </span>
                  </div>

                  <div style={styles.levelSection}>
                    <div style={styles.levelHeader}>
                      <span style={styles.levelLabel}>Current Level</span>
                      <span
                        style={{ ...styles.levelPercentage, color: "#9ca3af" }}
                      >
                        ---%
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: "50%",
                          background:
                            "linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%)",
                          animation: "pulse 2s infinite",
                        }}
                      ></div>
                    </div>
                    <div style={styles.levelDetails}>
                      <span>Loading...</span>
                      <span style={{ fontWeight: "500", color: "#9ca3af" }}>
                        --- liters
                      </span>
                      <span>---</span>
                    </div>
                  </div>

                  <div style={styles.metricsGrid}>
                    <div style={styles.metricBox}>
                      <div style={styles.metricHeader}>
                        <Thermometer size={16} color="#d1d5db" />
                        <span style={styles.metricLabel}>Temperature</span>
                      </div>
                      <p style={{ ...styles.metricValue, color: "#9ca3af" }}>
                        ---°C
                      </p>
                    </div>
                    <div style={styles.metricBox}>
                      <div style={styles.metricHeader}>
                        <Droplets size={16} color="#d1d5db" />
                        <span style={styles.metricLabel}>Water Level</span>
                      </div>
                      <p style={{ ...styles.metricValue, color: "#9ca3af" }}>
                        --- mm
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.tankGrid}>
              {tankData.length > 0 ? (
                tankData.map((tank: TankData) => (
                  <div key={tank.id} style={styles.tankCard}>
                    <div style={styles.tankHeader}>
                      <div style={styles.tankInfo}>
                        <div
                          style={{
                            ...styles.tankIcon,
                            backgroundColor: "#dbeafe",
                          }}
                        >
                          <Gauge size={24} color="#2563eb" />
                        </div>
                        <div style={styles.tankDetails}>
                          <h3 style={styles.tankName}>
                            Tank {tank.tank_id} - {tank.tank_name}
                          </h3>
                          <p style={styles.tankCapacity}>
                            {tank.tank_capacity} L capacity
                          </p>
                        </div>
                      </div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          color: "#166534",
                          backgroundColor: "#dcfce7",
                        }}
                      >
                        {tank.product_name}
                      </span>
                    </div>

                    <div style={styles.levelSection}>
                      <div style={styles.levelHeader}>
                        <span style={styles.levelLabel}>Current Level</span>
                        <span
                          style={{
                            ...styles.levelPercentage,
                            color: "#2563eb",
                          }}
                        >
                          {(
                            (tank.fuel_volume / tank.tank_capacity) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${(
                              (tank.fuel_volume / tank.tank_capacity) *
                              100
                            ).toFixed(2)}%`,
                            background:
                              "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                          }}
                        ></div>
                      </div>
                      <div style={styles.levelDetails}>
                        <span>0 L</span>
                        <span style={{ fontWeight: "500", color: "#374151" }}>
                          {tank.fuel_volume} liters
                        </span>
                        <span>{tank.tank_capacity} L</span>
                      </div>
                    </div>

                    <div style={styles.metricsGrid}>
                      <div style={styles.metricBox}>
                        <div style={styles.metricHeader}>
                          <Thermometer size={16} color="#f59e0b" />
                          <span style={styles.metricLabel}>Temperature</span>
                        </div>
                        <p style={styles.metricValue}>{tank.average_temp}°C</p>
                      </div>
                      <div style={styles.metricBox}>
                        <div style={styles.metricHeader}>
                          <Droplets size={16} color="#3b82f6" />
                          <span style={styles.metricLabel}>Water Level</span>
                        </div>
                        <p style={styles.metricValue}>
                          {tank.water_lvl_mm}mm / {tank.water_volume} L{" "}
                        </p>
                      </div>
                    </div>

                    {/* Daily Quantity Section */}
                    <div style={styles.quantitySection}>
                      <div style={styles.quantityTitle}>
                        <Target size={16} color="#6366f1" />
                        Daily Quantities
                      </div>
                      <div style={styles.quantityGrid}>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>Opening (ATG)</div>
                          <p style={styles.quantityValue}>75,450 L</p>
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>Closing (ATG)</div>
                          <p style={styles.quantityValue}>71,250 L</p>
                        </div>
                        <div style={styles.quantityItem}>
                          <div
                            style={{
                              ...styles.quantityLabel,
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            Opening (Manual)
                            <button
                              style={styles.editButton}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f1f5f9")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              <Edit3 size={12} color="#64748b" />
                            </button>
                          </div>
                          <p style={styles.quantityValue}>75,400 L</p>
                        </div>
                        <div style={styles.quantityItem}>
                          <div
                            style={{
                              ...styles.quantityLabel,
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            Closing (Manual)
                            <button
                              style={styles.editButton}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f1f5f9")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              <Edit3 size={12} color="#64748b" />
                            </button>
                          </div>
                          <p style={styles.quantityValue}>71,180 L</p>
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>
                            Difference of Opening and Closing(ATG)
                          </div>
                          <p style={styles.quantityValue}>0 L</p>
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>
                            Difference of Opening and Closing(Dipstick)
                          </div>
                          <p style={styles.quantityValue}>0 L</p>
                        </div>
                      </div>
                    </div>

                    {/* Loading Information Section */}
                    <div style={styles.quantitySection}>
                      <div style={styles.quantityTitle}>
                        <Truck size={16} color="#10b981" />
                        Loading Information
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "8px",
                        }}
                      >
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>Date</div>
                          <input
                            type="date"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>
                            Loading Order No
                          </div>
                          <input
                            type="text"
                            placeholder="Order No"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>Truck No</div>
                          <input
                            type="text"
                            placeholder="Truck No"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>Driver Name</div>
                          <input
                            type="text"
                            placeholder="Driver Name"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>Product</div>
                          <input
                            type="text"
                            placeholder="Product"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>Truck Short</div>
                          <input
                            type="number"
                            placeholder="Truck Short"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>
                            Underground Short
                          </div>
                          <input
                            type="number"
                            placeholder="Underground Short"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>
                            Fuel as Per Order
                          </div>
                          <input
                            type="number"
                            placeholder="Fuel as Per Order"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                        <div style={styles.quantityItem}>
                          <div style={styles.quantityLabel}>Received</div>
                          <input
                            type="number"
                            placeholder="Received"
                            style={{
                              ...styles.inputField,
                              fontSize: "12px",
                              padding: "6px 8px",
                            }}
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#3b82f6")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = "#e2e8f0")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    ...styles.tankCard,
                    textAlign: "center",
                    padding: "48px 24px",
                  }}
                >
                  <AlertTriangle
                    size={48}
                    color="#f59e0b"
                    style={{ marginBottom: "16px" }}
                  />
                  <h3 style={{ color: "#374151", marginBottom: "8px" }}>
                    No Tank Data Available
                  </h3>
                  <p style={{ color: "#6b7280" }}>
                    Unable to load tank information. Please check your
                    connection or try again later.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nozzle Performance - Separated by Fuel Type */}
        <div style={styles.nozzleSection}>
          <h3 style={styles.nozzleTitle}>
            <Target size={20} color="#6366f1" />
            Pump/Nozzle Performance
            {pumpsLoading && (
              <div style={styles.loadingState}>
                <Loader2 size={16} className="animate-spin" />
                Loading pump data...
              </div>
            )}
          </h3>

          {/* Unleaded Nozzles */}
          <div style={{ marginBottom: "32px" }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#2563eb",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⛽ Unleaded Nozzles
            </h4>
            <div style={styles.nozzleGrid}>
              {nozzleData
                .filter(
                  (nozzle) =>
                    nozzle.name.toLowerCase().includes("unleaded") ||
                    nozzle.name.toLowerCase().includes("petrol") ||
                    nozzle.name.toLowerCase().includes("pms") ||
                    nozzle.name.includes("A2")
                )
                .map((nozzle) => (
                  <div
                    key={nozzle.id}
                    style={{
                      ...styles.nozzleCard,
                      padding: "20px",
                    }}
                  >
                    <div style={styles.nozzleHeader}>
                      <span style={styles.nozzleName}>{nozzle.name}</span>
                      <span
                        style={{
                          ...styles.nozzleStatus,
                          color: nozzle.status ? "#dc2626" : "#166534",
                          backgroundColor: nozzle.status
                            ? "#fee2e2"
                            : "#dcfce7",
                        }}
                      >
                        {nozzle.status ? "Inactive" : "Active"}
                      </span>
                    </div>

                    {/* 4 Metrics Grid - All Same Color */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginTop: "16px",
                      }}
                    >
                      {/* 1. Sold Today */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#1e293b",
                            margin: 0,
                          }}
                        >
                          {nozzle.sold.toLocaleString()} L
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            margin: "2px 0 0 0",
                          }}
                        >
                          Sold Today
                        </p>
                      </div>

                      {/* 2. E-Total */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#1e293b",
                            margin: 0,
                          }}
                        >
                          {nozzle.e_total} L
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            margin: "2px 0 0 0",
                          }}
                        >
                          E-Total
                        </p>
                      </div>

                      {/* 3. V-Total */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#1e293b",
                            margin: 0,
                          }}
                        >
                          {nozzle.v_total} L
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            margin: "2px 0 0 0",
                          }}
                        >
                          V-Total
                        </p>
                      </div>

                      {/* 4. M-Total (Manual Entry) */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "8px",
                          padding: "8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="number"
                          placeholder="Enter"
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#1e293b",
                            outline: "none",
                            background: "#ffffff",
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#3b82f6")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#cbd5e1")
                          }
                        />
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            margin: "4px 0 0 0",
                          }}
                        >
                          M-Total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Diesel Nozzles */}
          <div>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#16a34a",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🚛 Diesel Nozzles
            </h4>
            <div style={styles.nozzleGrid}>
              {nozzleData
                .filter(
                  (nozzle) =>
                    nozzle.name.toLowerCase().includes("diesel") ||
                    nozzle.name.toLowerCase().includes("ago") ||
                    nozzle.name.includes("A1")
                )
                .map((nozzle) => (
                  <div
                    key={nozzle.id}
                    style={{
                      ...styles.nozzleCard,
                      padding: "20px",
                    }}
                  >
                    <div style={styles.nozzleHeader}>
                      <span style={styles.nozzleName}>{nozzle.name}</span>
                      <span
                        style={{
                          ...styles.nozzleStatus,
                          color: nozzle.status ? "#dc2626" : "#16a34a",
                          backgroundColor: nozzle.status
                            ? "#fee2e2"
                            : "#dcfce7",
                        }}
                      >
                        {nozzle.status ? "Inactive" : "Active"}
                      </span>
                    </div>

                    {/* 4 Metrics Grid - All Same Color */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginTop: "16px",
                      }}
                    >
                      {/* 1. Sold Today */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#1e293b",
                            margin: 0,
                          }}
                        >
                          {nozzle.sold.toLocaleString()} L
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            margin: "2px 0 0 0",
                          }}
                        >
                          Sold Today
                        </p>
                      </div>

                      {/* 2. E-Total */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#1e293b",
                            margin: 0,
                          }}
                        >
                          {nozzle.e_total} L
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            margin: "2px 0 0 0",
                          }}
                        >
                          E-Total
                        </p>
                      </div>

                      {/* 3. V-Total */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#1e293b",
                            margin: 0,
                          }}
                        >
                          {nozzle.v_total} L
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            margin: "2px 0 0 0",
                          }}
                        >
                          V-Total
                        </p>
                      </div>

                      {/* 4. M-Total (Manual Entry) */}
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: "8px",
                          padding: "8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="number"
                          placeholder="Enter"
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#1e293b",
                            outline: "none",
                            background: "#ffffff",
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#3b82f6")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#cbd5e1")
                          }
                        />
                        <p
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            margin: "4px 0 0 0",
                          }}
                        >
                          M-Total
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsCard}>
          <h3 style={styles.actionsTitle}>Quick Actions</h3>
          <div style={styles.actionsGrid}>
            <button
              style={{
                ...styles.actionButton,
                backgroundColor: "#dbeafe",
                color: "#1e40af",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#bfdbfe")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#dbeafe")
              }
            >
              <Gauge size={24} style={{ marginBottom: "8px" }} />
              <span>Update Levels</span>
            </button>
            <button
              onClick={() => setShowSalesModal(true)}
              style={{
                ...styles.actionButton,
                backgroundColor: "#dcfce7",
                color: "#166534",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#bbf7d0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#dcfce7")
              }
            >
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>💰</div>
              <span>Record Sales</span>
            </button>
            <button
              onClick={() => setShowChecklistModal(true)}
              style={{
                ...styles.actionButton,
                backgroundColor: "#f3e8ff",
                color: "#7c3aed",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e9d5ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3e8ff")
              }
            >
              <Clock size={24} style={{ marginBottom: "8px" }} />
              <span>Checklist</span>
            </button>
            <button
              onClick={() => setShowIssueModal(true)}
              style={{
                ...styles.actionButton,
                backgroundColor: "#fed7aa",
                color: "#c2410c",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#fdba74")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fed7aa")
              }
            >
              <AlertTriangle size={24} style={{ marginBottom: "8px" }} />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Checklist Modal */}
        {showChecklistModal && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Daily Safety Checklist</h3>
                <button
                  onClick={handleCloseModal}
                  style={styles.closeButton}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  ✕
                </button>
              </div>

              <div style={styles.checklistContainer}>
                <div
                  style={{
                    ...styles.checklistItem,
                    ...(checklistItems.calibration
                      ? styles.checklistItemChecked
                      : {}),
                  }}
                  onClick={() => handleChecklistItemChange("calibration")}
                >
                  <div
                    style={{
                      ...styles.checkbox,
                      ...(checklistItems.calibration
                        ? styles.checkboxChecked
                        : {}),
                    }}
                  >
                    {checklistItems.calibration && "✓"}
                  </div>
                  <span
                    style={{
                      ...styles.checklistLabel,
                      ...(checklistItems.calibration
                        ? styles.checklistLabelChecked
                        : {}),
                    }}
                  >
                    Calibration completed and verified?
                  </span>
                </div>

                <div
                  style={{
                    ...styles.checklistItem,
                    ...(checklistItems.pipelineLeak
                      ? styles.checklistItemChecked
                      : {}),
                  }}
                  onClick={() => handleChecklistItemChange("pipelineLeak")}
                >
                  <div
                    style={{
                      ...styles.checkbox,
                      ...(checklistItems.pipelineLeak
                        ? styles.checkboxChecked
                        : {}),
                    }}
                  >
                    {checklistItems.pipelineLeak && "✓"}
                  </div>
                  <span
                    style={{
                      ...styles.checklistLabel,
                      ...(checklistItems.pipelineLeak
                        ? styles.checklistLabelChecked
                        : {}),
                    }}
                  >
                    Pipeline inspected for leaks or damage?
                  </span>
                </div>

                <div
                  style={{
                    ...styles.checklistItem,
                    ...(checklistItems.tankLeak
                      ? styles.checklistItemChecked
                      : {}),
                  }}
                  onClick={() => handleChecklistItemChange("tankLeak")}
                >
                  <div
                    style={{
                      ...styles.checkbox,
                      ...(checklistItems.tankLeak
                        ? styles.checkboxChecked
                        : {}),
                    }}
                  >
                    {checklistItems.tankLeak && "✓"}
                  </div>
                  <span
                    style={{
                      ...styles.checklistLabel,
                      ...(checklistItems.tankLeak
                        ? styles.checklistLabelChecked
                        : {}),
                    }}
                  >
                    Storage tanks checked for leaks or structural issues?
                  </span>
                </div>

                <div
                  style={{
                    ...styles.checklistItem,
                    ...(checklistItems.safetyEquipment
                      ? styles.checklistItemChecked
                      : {}),
                  }}
                  onClick={() => handleChecklistItemChange("safetyEquipment")}
                >
                  <div
                    style={{
                      ...styles.checkbox,
                      ...(checklistItems.safetyEquipment
                        ? styles.checkboxChecked
                        : {}),
                    }}
                  >
                    {checklistItems.safetyEquipment && "✓"}
                  </div>
                  <span
                    style={{
                      ...styles.checklistLabel,
                      ...(checklistItems.safetyEquipment
                        ? styles.checklistLabelChecked
                        : {}),
                    }}
                  >
                    Safety equipment functional and accessible?
                  </span>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  onClick={handleCloseModal}
                  style={{ ...styles.modalButton, ...styles.cancelButton }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e5e7eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChecklist}
                  style={{ ...styles.modalButton, ...styles.saveButton }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#15803d")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#16a34a")
                  }
                >
                  Save Checklist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sales Record Modal */}
        {showSalesModal && (
          <div style={styles.modalOverlay} onClick={handleCloseSalesModal}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Daily Sales Record</h3>
                <button
                  onClick={handleCloseSalesModal}
                  style={styles.closeButton}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  ✕
                </button>
              </div>

              <div style={styles.checklistContainer}>
                {/* E_Total System Sales */}
                <div style={{ ...styles.salesRow, ...styles.salesRowETotals }}>
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>💰</span>
                      E_Total System Revenue
                    </div>
                    <div style={styles.salesDetails}>
                      Electronic system total (includes all transactions)
                    </div>
                  </div>
                  <div
                    style={{
                      ...styles.salesValue,
                      ...styles.salesValueHighlight,
                    }}
                  >
                    TSH{salesData.eTotalCash.toLocaleString()}
                  </div>
                </div>
                {/* Manager's Cash - Manual Entry */}
                <div
                  style={{
                    ...styles.salesRow,
                    backgroundColor: "#f0fdf4",
                    borderColor: "#22c55e",
                  }}
                >
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>💰</span>
                      Manager's Cash (Manual Entry)
                    </div>
                    <div style={styles.salesDetails}>
                      Cash counted by station manager
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={managerCash}
                      onChange={(e) => setManagerCash(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #22c55e",
                        borderRadius: "6px",
                        fontSize: "16px",
                        fontWeight: "600",
                        width: "140px",
                        textAlign: "right",
                        outline: "none",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#16a34a",
                      }}
                    >
                      TSH
                    </span>
                  </div>
                </div>

                {/* Variance Analysis */}
                <div
                  style={{
                    ...styles.salesRow,
                    backgroundColor: "#fef3c7",
                    borderColor: "#f59e0b",
                  }}
                >
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>📈</span>
                      Variance Analysis
                    </div>
                    <div style={styles.salesDetails}>
                      Difference between manual calculation and E_Total
                    </div>
                  </div>
                  <div
                    style={{
                      ...styles.salesValue,
                      color:
                        salesData.eTotalCash -
                          (salesData.unleaded.cash + salesData.diesel.cash) >=
                        0
                          ? "#16a34a"
                          : "#dc2626",
                    }}
                  >
                    TSH{" "}
                    {salesData.eTotalCash - (parseFloat(managerCash) || 0) >= 0
                      ? "+"
                      : ""}
                    {(
                      salesData.eTotalCash - (parseFloat(managerCash) || 0)
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  onClick={handleCloseSalesModal}
                  style={{ ...styles.modalButton, ...styles.cancelButton }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e5e7eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                >
                  Close
                </button>
                <button
                  onClick={handleSaveSales}
                  style={{ ...styles.modalButton, ...styles.saveButton }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#15803d")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#16a34a")
                  }
                >
                  {loadingSalesModal ? (
                    <span>Loading...</span>
                  ) : (
                    <span>Record Sales</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Issue Modal */}
        {showIssueModal && (
          <div style={styles.modalOverlay} onClick={handleCloseIssueModal}>
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>🚨 Report Station Issue</h3>
                <button
                  onClick={handleCloseIssueModal}
                  style={styles.closeButton}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  ✕
                </button>
              </div>

              <div style={styles.checklistContainer}>
                {/* Issue Category */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Issue Category</label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                    style={{
                      ...styles.selectField,
                      ...(issueCategory === "emergency"
                        ? styles.urgentCategory
                        : {}),
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  >
                    <option value="general">🔧 General Issue</option>
                    <option value="equipment">⚙️ Equipment Malfunction</option>
                    <option value="safety">⚠️ Safety Concern</option>
                    <option value="fuel">⛽ Fuel System Problem</option>
                    <option value="power">🔌 Power/Electrical Issue</option>
                    <option value="emergency">🚨 EMERGENCY</option>
                  </select>
                </div>

                {/* Issue Description */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    Issue Description
                    {issueCategory === "emergency" && (
                      <span style={{ color: "#dc2626" }}> (URGENT)</span>
                    )}
                  </label>
                  <textarea
                    value={issueMessage}
                    onChange={(e) => setIssueMessage(e.target.value)}
                    placeholder="Please describe the issue in detail. Include location, time noticed, severity, and any immediate actions taken..."
                    style={{
                      ...styles.textarea,
                      ...(issueCategory === "emergency"
                        ? styles.urgentCategory
                        : {}),
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    maxLength={500}
                  />
                  <div style={styles.characterCount}>
                    {issueMessage.length}/500 characters
                  </div>
                </div>

                {/* SMS Preview */}
                <div
                  style={{
                    ...styles.salesRow,
                    backgroundColor: "#f0f9ff",
                    borderColor: "#0ea5e9",
                  }}
                >
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>📱</span>
                      SMS Preview to General Manager
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#374151",
                        marginTop: "8px",
                        fontStyle: "italic",
                        padding: "8px",
                        backgroundColor: "#ffffff",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      "STATION ALERT: {stationData?.name || "Station"} -{" "}
                      {issueCategory.toUpperCase()}
                      <br />
                      {issueMessage || "[Issue description will appear here]"}
                      <br />
                      Reported by: Station Manager
                      <br />
                      Time: {new Date().toLocaleString()}"
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  onClick={handleCloseIssueModal}
                  style={{ ...styles.modalButton, ...styles.cancelButton }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e5e7eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendIssueReport}
                  disabled={issueSending || !issueMessage.trim()}
                  style={{
                    ...styles.modalButton,
                    ...(issueCategory === "emergency"
                      ? { backgroundColor: "#dc2626" }
                      : styles.saveButton),
                    ...(issueSending ? styles.sendingButton : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!issueSending && issueMessage.trim()) {
                      e.currentTarget.style.backgroundColor =
                        issueCategory === "emergency" ? "#b91c1c" : "#15803d";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!issueSending && issueMessage.trim()) {
                      e.currentTarget.style.backgroundColor =
                        issueCategory === "emergency" ? "#dc2626" : "#16a34a";
                    }
                  }}
                >
                  {issueSending ? (
                    <>
                      <Loader2
                        size={16}
                        style={{
                          marginRight: "8px",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Sending SMS...
                    </>
                  ) : (
                    <>
                      📱 Send SMS Alert
                      {issueCategory === "emergency" && " (URGENT)"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
