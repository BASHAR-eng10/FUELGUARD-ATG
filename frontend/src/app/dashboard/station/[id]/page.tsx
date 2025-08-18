'use client'

import { useState, useEffect, use } from 'react'
import { Shield, Gauge, Droplets, DollarSign, AlertTriangle, Settings, LogOut, Bell, TrendingUp, Clock, Thermometer, Target, Edit3, Truck, Loader2, RefreshCw } from 'lucide-react'
import apiService from "../../../../lib/services/api"
import { useAuth } from '@/lib/hooks/useAuth'
import { updateCurrentManualCashEntries } from '@/lib/services/externalApiService'
import api from '../../../../lib/services/api'

interface StationData {
  id: number
  name: string
  location: string
  region?: string
  zone?: string
  operatorName?: string
  contactEmail?: string
  contactPhone?: number
  ewuraLicense?: string
  tanks: number
  username?: string
  password?: string
}

interface TankData {
  id: number
  probe_id: string
  date: string
  updated_at: string
  tank_id: string
  tank_name: string
  physical_id: string
  identification_code: string
  product_name: string
  tank_capacity: number
  fuel_lvl_mm: number
  fuel_offset: number
  fuel_volume: number
  fuel_volume_15: number
  water_lvl_mm: number
  water_offset: number
  water_volume: number
  water_volume_15: number
  average_temp: number
  EWURALicenseNo: string
  LicenseeTraSerialNo: string
}

interface NozzleData {
  id: number
  name: string
  sold: number
  percentage: number
  status: boolean 
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  logoSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconButton: {
    position: 'relative' as const,
    padding: '8px',
    color: '#6b7280',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  badge: {
    position: 'absolute' as const,
    top: '-2px',
    right: '-2px',
    width: '16px',
    height: '16px',
    backgroundColor: '#eab308',
    color: 'white',
    fontSize: '10px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signOutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    color: '#6b7280',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px'
  },
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px 24px'
  },
  welcomeSection: {
    marginBottom: '32px'
  },
  welcomeTitle: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px'
  },
  welcomeText: {
    color: '#6b7280'
  },
  tankGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  tankCard: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '24px'
  },
  tankHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  tankInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  tankIcon: {
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tankDetails: {
    flex: 1
  },
  tankName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  tankCapacity: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '9999px'
  },
  levelSection: {
    marginBottom: '16px'
  },
  levelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  levelLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  levelPercentage: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  progressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '9999px',
    transition: 'width 0.3s ease'
  },
  levelDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '8px',
    fontSize: '12px',
    color: '#6b7280'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '16px'
  },
  metricBox: {
    background: '#f9fafb',
    borderRadius: '8px',
    padding: '12px'
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  metricLabel: {
    fontSize: '12px',
    color: '#6b7280'
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  quantitySection: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
    border: '1px solid #e2e8f0'
  },
  quantityTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  quantityGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  quantityItem: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #e2e8f0'
  },
  quantityLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },
  quantityValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  editButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  inputField: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  nozzleSection: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '24px',
    marginBottom: '32px'
  },
  nozzleTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  nozzleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  nozzleCard: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e2e8f0'
  },
  nozzleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  nozzleName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b'
  },
  nozzleStatus: {
    fontSize: '10px',
    fontWeight: '500',
    padding: '2px 6px',
    borderRadius: '6px'
  },
  nozzleMetrics: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  },
  nozzleMetric: {
    textAlign: 'center' as const
  },
  nozzleMetricValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  nozzleMetricLabel: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '2px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '24px',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer'
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  statIcon: {
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '4px'
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '12px'
  },
  statFooter: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#6b7280'
  },
  actionsCard: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '24px',
    marginBottom: '32px'
  },
  actionsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px'
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500'
  },
  successMessage: {
    background: 'linear-gradient(135deg, #dbeafe 0%, #dcfce7 100%)',
    border: '1px solid #3b82f6',
    borderRadius: '16px',
    padding: '24px'
  },
  messageContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  messageIcon: {
    padding: '8px',
    backgroundColor: '#dbeafe',
    borderRadius: '50%'
  },
  messageTitle: {
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: '4px'
  },
  messageText: {
    color: '#1e3a8a'
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#6b7280',
    fontSize: '14px'
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    color: '#6b7280'
  },
  checklistContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px'
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s'
  },
  checklistItemChecked: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid #d1d5db',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  checkboxChecked: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
    color: '#ffffff'
  },
  checklistLabel: {
    fontSize: '16px',
    color: '#374151',
    fontWeight: '500',
    flex: 1
  },
  checklistLabelChecked: {
    color: '#166534'
  },
  modalFooter: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  },
  modalButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  saveButton: {
    backgroundColor: '#16a34a',
    color: '#ffffff'
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  salesRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    marginBottom: '12px'
  },
  salesRowTotal: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    fontWeight: '600'
  },
  salesRowETotals: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
    fontWeight: '600'
  },
  salesLabel: {
    fontSize: '16px',
    color: '#374151',
    fontWeight: '500'
  },
  salesValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  },
  salesValueHighlight: {
    color: '#16a34a',
    fontSize: '20px'
  },
  salesDetails: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px'
  },
  salesIcon: {
    marginRight: '8px'
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  selectField: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  formGroup: {
    marginBottom: '16px'
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  urgentCategory: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626'
  },
  characterCount: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'right' as const,
    marginTop: '4px'
  },
  sendingButton: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  }
}

export default function StationDashboard({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params)
	const { logout } = useAuth()
  const [stationData, setStationData] = useState<StationData | null>(null)
  const [nozzleData, setNozzleData] = useState<NozzleData[]>([])
  const [tankData, setTankData] = useState<TankData[]>([])
  const [loading, setLoading] = useState(true)
  const [pumpsLoading, setPumpsLoading] = useState(true)
  const [tanksLoading, setTanksLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pumpsError, setPumpsError] = useState<string | null>(null)
  const [tanksError, setTanksError] = useState<string | null>(null)
  const [showChecklistModal, setShowChecklistModal] = useState(false)
  const [showSalesModal, setShowSalesModal] = useState(false)
  const [loadingSalesModal, setLoadingSalesModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [issueMessage, setIssueMessage] = useState('')
  const [issueCategory, setIssueCategory] = useState('general')
  const [issueSending, setIssueSending] = useState(false)
  const [checklistItems, setChecklistItems] = useState({
    calibration: false,
    pipelineLeak: false,
    tankLeak: false,
    safetyEquipment: false
  })
  const [managerCash, setManagerCash] = useState('')
  
  // Sales data - normally would come from API
  const [salesData] = useState({
    unleaded: {
      liters: 4220,
      pricePerLiter: 1.45,
      cash: 4220 * 1.45
    },
    diesel: {
      liters: 5800,
      pricePerLiter: 1.52,
      cash: 5800 * 1.52
    },
    eTotalCash: 14629
  })

  // Fetch pump data from API
  const fetchPumpData = async () => {
    try {
      setPumpsLoading(true)
      setPumpsError(null)
			const response = await apiService.getStationPumps()

			if (response.data && Array.isArray(response.data)) {
				setNozzleData(response.data)
			} else {
				throw new Error('Invalid API response structure')
			}

    } catch (err) {
      console.error('Error fetching pump data:', err)
      setPumpsError((err as Error).message)
    } finally {
      setPumpsLoading(false)
    }
  }

  // Fetch tank data from API
  const fetchTankData = async () => {
    try {
      setTanksLoading(true)
      setTanksError(null)
			const response = await apiService.getStationTanks(id)

			if (response.data && Array.isArray(response.data)) {
				setTankData(response.data)
				// console.log(response.data)
			} else {
				throw new Error('Invalid API response structure')
			}

    } catch (err) {
      console.error('Error fetching tank data:', err)
      setTanksError((err as Error).message)
    } finally {
      setTanksLoading(false)
    }
  }
  // Fetch station data from API
  const fetchStationData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching station data for ID:', id)
      
      // Fetch station info
      const station = await apiService.getStation(id)
      console.log('Station API Response:', station)

      if (station && station.data) {
        setStationData({
          id: station.data.id,
          name: station.data.RetailStationName,
          location: `${station.data.WardName}, ${station.data.DistrictName}`,
          region: station.data.RegionName,
          zone: station.data.Zone,
          operatorName: station.data.OperatorName,
          contactEmail: station.data.ContactPersonEmailAddress,
          contactPhone: station.data.ContactPersonPhone,
          ewuraLicense: station.data.EWURALicenseNo,
          tanks: station.data.TotalNoTanks,
          username: station.data.automation_server_username,
          password: station.data.automation_server_pass,
          })
        } else {
        	console.error('Invalid API response structure:', station)
          throw new Error(`Station with ID ${id} not found. Available stations: ${station.id}`)
        }
    } catch (err) {
      console.error('Error fetching station data:', err)
      setError((err as Error).message)
      // Enhanced fallback data
      setStationData({
        id: parseInt(id),
        name: `Station ${id} (Fallback)`,
        location: 'Location unavailable',
        operatorName: 'LAKE OIL',
        tanks: 2,
        ewuraLicense: 'License unavailable'
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshAllData = async () => {
    await Promise.all([fetchStationData(), fetchPumpData(), fetchTankData()])
  }

  useEffect(() => {
    refreshAllData()
  }, [])

  const handleSignOut = async () => {
		await logout()
  }

  const handleChecklistItemChange = (item: keyof typeof checklistItems) => {
    setChecklistItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  const handleSaveChecklist = () => {
    console.log('Checklist saved:', checklistItems)
    // Here you would typically save to your API
    setShowChecklistModal(false)
  }

  const handleCloseModal = () => {
    setShowChecklistModal(false)
  }

  const handleCloseSalesModal = () => {
    setShowSalesModal(false)
  }

  const handleSaveSales = async() => {
    console.log('Sales data recorded:', salesData)
		//TODO: lreajslkjlk HERE I AM
		managerCash && console.log('stationid:', id)
		console.log("Total actual cash:", salesData.diesel.cash*salesData.diesel.liters + salesData.unleaded.cash*salesData.unleaded.liters)
		console.log("Total manual cash:", managerCash)
		const actualCash = salesData.diesel.cash*salesData.diesel.liters + salesData.unleaded.cash*salesData.unleaded.liters
		setLoadingSalesModal(true)
		await api.updateCurrentCashEntry(id,
			actualCash,
			parseFloat(managerCash)).then(() => {
				setLoadingSalesModal(false)
			}).finally(() => {
    		setShowSalesModal(false)
			})
    // Here you would typically save to your API
  }

  const handleCloseIssueModal = () => {
    setShowIssueModal(false)
    setIssueMessage('')
    setIssueCategory('general')
  }

  const handleSendIssueReport = async () => {
    if (!issueMessage.trim()) {
      alert('Please enter an issue description before sending.')
      return
    }

    setIssueSending(true)
    
    try {
      // Simulate API call to send SMS
      const issueData = {
        stationId: stationData?.id,
        stationName: stationData?.name,
        category: issueCategory,
        message: issueMessage,
        timestamp: new Date().toISOString(),
        managerName: 'Station Manager', // Could be from auth context
        urgency: issueCategory === 'emergency' ? 'HIGH' : 'NORMAL'
      }

      console.log('Sending issue report:', issueData)
      
      // Here you would call your SMS API
      // await apiService.sendIssueReport(issueData)
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Issue report sent successfully!\n\nSMS sent to General Manager:\n"STATION ALERT: ${stationData?.name || 'Station'} - ${issueCategory.toUpperCase()}\n${issueMessage}\nReported by: Station Manager\nTime: ${new Date().toLocaleString()}"`)
      
      handleCloseIssueModal()
    } catch (error) {
      console.error('Error sending issue report:', error)
      alert('Failed to send issue report. Please try again.')
    } finally {
      setIssueSending(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <Shield size={32} color="#2563eb" />
            <div>
              <h1 style={styles.logoTitle}>
                {loading ? 'Loading...' : (stationData?.name || 'Station Dashboard')}
              </h1>
              <p style={styles.logoSubtitle}>Station Manager</p>
            </div>
          </div>
          
          <div style={styles.headerActions}>
            <button 
              style={styles.iconButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Bell size={20} />
              <span style={styles.badge}>1</span>
            </button>
            <button 
              style={styles.iconButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Settings size={20} />
            </button>
            <button 
              onClick={handleSignOut}
              style={styles.signOutButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
            {loading ? 'Loading station information...' : 
             error ? `Error: ${error}` :
             `Monitor ${stationData?.name || 'your station'}'s operations and performance in real-time.`}
          </p>
          {stationData && !loading && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '14px',
                color: '#64748b'
              }}>
                <div>📍 <strong>Location:</strong> {stationData.location}</div>
                <div>🏢 <strong>Operator:</strong> {stationData.operatorName}</div>
                <div>📋 <strong>License:</strong> {stationData.ewuraLicense}</div>
                <div>🛢️ <strong>Tanks:</strong> {tanksLoading ? 'Loading...' : tankData.length || stationData.tanks}</div>
                <div>⛽ <strong>Pumps/Nozzles:</strong> {pumpsLoading ? 'Loading...' : nozzleData.length}</div>
              </div>
              
              {(pumpsError || tanksError) && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#dc2626'
                }}>
                  {pumpsError && <div>⚠️ Pump data error: {pumpsError}</div>}
                  {tanksError && <div>⚠️ Tank data error: {tanksError}</div>}
                  <div style={{marginTop: '4px', fontSize: '11px'}}>Using fallback data where available</div>
                </div>
              )}
              
              <button
                onClick={refreshAllData}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RefreshCw size={12} />
                Refresh All Data
              </button>
            </div>
          )}
        </div>

        {/* Tank Monitoring */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
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
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#fee2e2',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertTriangle size={12} />
                Tank data error: {tanksError}
              </div>
            )}
          </div>
          
          {tanksLoading ? (
            <div style={styles.tankGrid}>
              {[1, 2].map((index) => (
                <div key={index} style={{
                  ...styles.tankCard,
                  opacity: 0.6
                }}>
                  <div style={styles.tankHeader}>
                    <div style={styles.tankInfo}>
                      <div style={{...styles.tankIcon, backgroundColor: '#f3f4f6'}}>
                        <Loader2 size={24} color="#9ca3af" className="animate-spin" />
                      </div>
                      <div style={styles.tankDetails}>
                        <h4 style={{...styles.tankName, color: '#9ca3af'}}>Loading Tank {index}...</h4>
                        <p style={{...styles.tankCapacity, color: '#9ca3af'}}>Fetching capacity...</p>
                      </div>
                    </div>
                    <span style={{...styles.statusBadge, color: '#9ca3af', backgroundColor: '#f3f4f6'}}>Loading</span>
                  </div>
                  
                  <div style={styles.levelSection}>
                    <div style={styles.levelHeader}>
                      <span style={styles.levelLabel}>Current Level</span>
                      <span style={{...styles.levelPercentage, color: '#9ca3af'}}>---%</span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: '50%',
                        background: 'linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%)',
                        animation: 'pulse 2s infinite'
                      }}></div>
                    </div>
                    <div style={styles.levelDetails}>
                      <span>Loading...</span>
                      <span style={{fontWeight: '500', color: '#9ca3af'}}>--- liters</span>
                      <span>---</span>
                    </div>
                  </div>
                  
                  <div style={styles.metricsGrid}>
                    <div style={styles.metricBox}>
                      <div style={styles.metricHeader}>
                        <Thermometer size={16} color="#d1d5db" />
                        <span style={styles.metricLabel}>Temperature</span>
                      </div>
                      <p style={{...styles.metricValue, color: '#9ca3af'}}>---°C</p>
                    </div>
                    <div style={styles.metricBox}>
                      <div style={styles.metricHeader}>
                        <Droplets size={16} color="#d1d5db" />
                        <span style={styles.metricLabel}>Water Level</span>
                      </div>
                      <p style={{...styles.metricValue, color: '#9ca3af'}}>--- mm</p>
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
                <div style={{...styles.tankIcon, backgroundColor: '#dbeafe'}}>
                  <Gauge size={24} color="#2563eb" />
                </div>
                <div style={styles.tankDetails}>
                  <h3 style={styles.tankName}>Tank {tank.tank_id} - {tank.tank_name}</h3>
                  <p style={styles.tankCapacity}>{tank.tank_capacity} L capacity</p>
                </div>
              </div>
              <span style={{...styles.statusBadge, color: '#166534', backgroundColor: '#dcfce7'}}>{tank.product_name}</span>
            </div>

            <div style={styles.levelSection}>
              <div style={styles.levelHeader}>
                <span style={styles.levelLabel}>Current Level</span>
                <span style={{...styles.levelPercentage, color: '#2563eb'}}>{(tank.fuel_volume / tank.tank_capacity * 100).toFixed(2)}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${(tank.fuel_volume / tank.tank_capacity * 100).toFixed(2)}%`,
                  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                }}></div>
              </div>
              <div style={styles.levelDetails}>
                <span>0 L</span>
                <span style={{fontWeight: '500', color: '#374151'}}>{tank.fuel_volume} liters</span>
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
                <p style={styles.metricValue}>{tank.water_lvl_mm}mm / {tank.water_volume} L </p>
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
                  <div style={styles.quantityLabel}>Opening (Endpoint)</div>
                  <p style={styles.quantityValue}>75,450 L</p>
                </div>
                <div style={styles.quantityItem}>
                  <div style={styles.quantityLabel}>Closing (Endpoint)</div>
                  <p style={styles.quantityValue}>71,250 L</p>
                </div>
                <div style={styles.quantityItem}>
                  <div style={{...styles.quantityLabel, display: 'flex', alignItems: 'center', gap: '4px'}}>
                    Opening (Manual)
                    <button style={styles.editButton} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <Edit3 size={12} color="#64748b" />
                    </button>
                  </div>
                  <p style={styles.quantityValue}>75,400 L</p>
                </div>
                <div style={styles.quantityItem}>
                  <div style={{...styles.quantityLabel, display: 'flex', alignItems: 'center', gap: '4px'}}>
                    Closing (Manual)
                    <button style={styles.editButton} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <Edit3 size={12} color="#64748b" />
                    </button>
                  </div>
                  <p style={styles.quantityValue}>71,180 L</p>
                </div>
              </div>
            </div>

            {/* Daily Filling Section */}
            <div style={styles.quantitySection}>
              <div style={styles.quantityTitle}>
                <Truck size={16} color="#dc2626" />
                Daily Filling
              </div>
              <div style={{...styles.quantityGrid, gridTemplateColumns: '1fr'}}>
                <div style={styles.quantityItem}>
                  <div style={styles.quantityLabel}>Tanker Name</div>
                  <input 
                    type="text" 
                    placeholder="Enter tanker name"
                    style={styles.inputField}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>
                <div style={styles.quantityItem}>
                  <div style={styles.quantityLabel}>Truck Number</div>
                  <input 
                    type="text" 
                    placeholder="Enter truck number"
                    style={styles.inputField}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.quantityItem}>
                  <div style={styles.quantityLabel}>Filling Value (Manual)</div>
                  <input 
                    type="number" 
                    placeholder="Enter filling amount"
                    style={styles.inputField}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div style={styles.quantityItem}>
                  <div style={styles.quantityLabel}>ATG Value (Endpoint)</div>
                  <p style={{...styles.quantityValue, color: '#6366f1'}}>15,250 L</p>
                </div>
                <div style={styles.quantityItem}>
                  <div style={styles.quantityLabel}>Difference (Manual - ATG)</div>
                  <p style={{...styles.quantityValue, color: '#dc2626'}}>-150 L</p>
                  <div style={{fontSize: '11px', color: '#dc2626', marginTop: '2px'}}>
                    Manual value lower than ATG
                  </div>
                </div>
              </div>
            </div>
          </div>
                ))
              ) : (
                <div style={{
                  ...styles.tankCard,
                  textAlign: 'center',
                  padding: '48px 24px'
                }}>
                  <AlertTriangle size={48} color="#f59e0b" style={{marginBottom: '16px'}} />
                  <h3 style={{color: '#374151', marginBottom: '8px'}}>No Tank Data Available</h3>
                  <p style={{color: '#6b7280'}}>Unable to load tank information. Please check your connection or try again later.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fuel Pricing Section */}
        <div style={styles.nozzleSection}>
          <h3 style={styles.nozzleTitle}>
            <DollarSign size={20} color="#16a34a" />
            Fuel Pricing & Sales
          </h3>
          <div style={styles.nozzleGrid}>
            <div style={styles.nozzleCard}>
              <div style={styles.nozzleHeader}>
                <span style={styles.nozzleName}>Unleaded Price</span>
                <span style={{
                  ...styles.nozzleStatus,
                  color: '#166534',
                  backgroundColor: '#dcfce7'
                }}>
                  Active
                </span>
              </div>
              <div style={styles.nozzleMetrics}>
                <div style={styles.nozzleMetric}>
                  <p style={{...styles.nozzleMetricValue, fontSize: '20px'}}>1.45 TSH</p>
                  <p style={styles.nozzleMetricLabel}>Per Liter</p>
                </div>
                <div style={styles.nozzleMetric}>
                  <p style={styles.nozzleMetricValue}>4,220 L</p>
                  <p style={styles.nozzleMetricLabel}>Sold Today</p>
                </div>
              </div>
            </div>
            <div style={styles.nozzleCard}>
              <div style={styles.nozzleHeader}>
                <span style={styles.nozzleName}>Diesel Price</span>
                <span style={{
                  ...styles.nozzleStatus,
                  color: '#166534',
                  backgroundColor: '#dcfce7'
                }}>
                  Active
                </span>
              </div>
              <div style={styles.nozzleMetrics}>
                <div style={styles.nozzleMetric}>
                  <p style={{...styles.nozzleMetricValue, fontSize: '20px'}}>1.52 TSH</p>
                  <p style={styles.nozzleMetricLabel}>Per Liter</p>
                </div>
                <div style={styles.nozzleMetric}>
                  <p style={styles.nozzleMetricValue}>5,800 L</p>
                  <p style={styles.nozzleMetricLabel}>Sold Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Analysis - Separated by Fuel Type */}

{/* Unleaded Sales Analysis */}
<div style={styles.nozzleSection}>
  <h3 style={styles.nozzleTitle}>
    <TrendingUp size={20} color="#2563eb" />
    ⛽ Unleaded Sales Analysis
  </h3>
  <div style={styles.nozzleGrid}>
    <div style={styles.nozzleCard}>
      <div style={styles.nozzleHeader}>
        <span style={styles.nozzleName}>E_Total Sales</span>
        
      </div>
      <div style={styles.nozzleMetrics}>
        <div style={styles.nozzleMetric}>
          <p style={styles.nozzleMetricValue}>4,220 L</p>
          <p style={styles.nozzleMetricLabel}>Total Liters</p>
        </div>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#16a34a'}}> 6,119 TSH</p>
          <p style={styles.nozzleMetricLabel}>Cash Value</p>
        </div>
      </div>
    </div>

    <div style={styles.nozzleCard}>
      <div style={styles.nozzleHeader}>
        <span style={styles.nozzleName}>V_Total Sales</span>
        
      </div>
      <div style={styles.nozzleMetrics}>
        <div style={styles.nozzleMetric}>
          <p style={styles.nozzleMetricValue}>4,150 L</p>
          <p style={styles.nozzleMetricLabel}>Total Liters</p>
        </div>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#7c3aed'}}>Volume Only</p>
          <p style={styles.nozzleMetricLabel}>No Price</p>
        </div>
      </div>
    </div>

    <div style={styles.nozzleCard}>
      <div style={styles.nozzleHeader}>
        <span style={styles.nozzleName}>E_Total vs V_Total</span>
        
      </div>
      <div style={styles.nozzleMetrics}>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#ca8a04'}}>+70 L</p>
          <p style={styles.nozzleMetricLabel}>Difference</p>
        </div>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#ca8a04'}}>+1.7%</p>
          <p style={styles.nozzleMetricLabel}>Variance</p>
        </div>
      </div>
    </div>

    <div style={styles.nozzleCard}>
      <div style={styles.nozzleHeader}>
        <span style={styles.nozzleName}>M_Total Sales</span>
        
      </div>
      <div style={styles.nozzleMetrics}>
        <div style={styles.nozzleMetric}>
          <p style={styles.nozzleMetricValue}>4,200 L</p>
          <p style={styles.nozzleMetricLabel}>Total Liters</p>
        </div>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#dc2626'}}>Manual Entry</p>
          <p style={styles.nozzleMetricLabel}>User Input</p>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Diesel Sales Analysis */}
<div style={styles.nozzleSection}>
  <h3 style={styles.nozzleTitle}>
    <TrendingUp size={20} color="#16a34a" />
    🚛 Diesel Sales Analysis
  </h3>
  <div style={styles.nozzleGrid}>
    <div style={styles.nozzleCard}>
      <div style={styles.nozzleHeader}>
        <span style={styles.nozzleName}>E_Total Sales</span>
        
      </div>
      <div style={styles.nozzleMetrics}>
        <div style={styles.nozzleMetric}>
          <p style={styles.nozzleMetricValue}>5,800 L</p>
          <p style={styles.nozzleMetricLabel}>Total Liters</p>
        </div>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#16a34a'}}> 8,816 TSH</p>
          <p style={styles.nozzleMetricLabel}>Cash Value</p>
        </div>
      </div>
    </div>

    <div style={styles.nozzleCard}>
      <div style={styles.nozzleHeader}>
        <span style={styles.nozzleName}>V_Total Sales</span>
        
      </div>
      <div style={styles.nozzleMetrics}>
        <div style={styles.nozzleMetric}>
          <p style={styles.nozzleMetricValue}>5,750 L</p>
          <p style={styles.nozzleMetricLabel}>Total Liters</p>
        </div>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#7c3aed'}}>Volume Only</p>
          <p style={styles.nozzleMetricLabel}>No Price</p>
        </div>
      </div>
    </div>

    <div style={styles.nozzleCard}>
      <div style={styles.nozzleHeader}>
        <span style={styles.nozzleName}>E_Total vs V_Total</span>
        
      </div>
      <div style={styles.nozzleMetrics}>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#ca8a04'}}>+50 L</p>
          <p style={styles.nozzleMetricLabel}>Difference</p>
        </div>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#ca8a04'}}>+0.9%</p>
          <p style={styles.nozzleMetricLabel}>Variance</p>
        </div>
      </div>
    </div>

    <div style={styles.nozzleCard}>
      <div style={styles.nozzleHeader}>
        <span style={styles.nozzleName}>M_Total Sales</span>
       
      </div>
      <div style={styles.nozzleMetrics}>
        <div style={styles.nozzleMetric}>
          <p style={styles.nozzleMetricValue}>5,780 L</p>
          <p style={styles.nozzleMetricLabel}>Total Liters</p>
        </div>
        <div style={styles.nozzleMetric}>
          <p style={{...styles.nozzleMetricValue, color: '#dc2626'}}>Manual Entry</p>
          <p style={styles.nozzleMetricLabel}>User Input</p>
        </div>
      </div>
    </div>
  </div>
</div>
{/* Performance Metrics */}
        <div style={styles.statsGrid}>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <div style={styles.statHeader}>
              <div style={{...styles.statIcon, backgroundColor: '#dcfce7'}}>
  <span style={{fontSize: '18px', fontWeight: 'bold', color: '#16a34a'}}>TSH</span>
</div>
              <span style={{...styles.statusBadge, color: '#166534', backgroundColor: '#dcfce7'}}>+15%</span>
            </div>
            <h3 style={styles.statValue}>14,629 TSH</h3>
            <p style={styles.statLabel}>E_Total Revenue</p>
            <div style={styles.statFooter}>
              <TrendingUp size={12} style={{marginRight: '4px'}} />
              vs yesterday
            </div>
          </div>

                  <div 
          style={styles.statCard}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
        >
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, backgroundColor: '#f0fdf4'}}>
              <span style={{fontSize: '18px', fontWeight: 'bold', color: '#16a34a'}}>💰</span>
            </div>
            <span style={{...styles.statusBadge, color: '#166534', backgroundColor: '#dcfce7'}}>Manual</span>
          </div>
          <h3 style={styles.statValue}>
            {managerCash ? `${parseFloat(managerCash).toLocaleString()} TSH` : 'No Entry'}
          </h3>
          <p style={styles.statLabel}>Manager's Cash</p>
          <div style={styles.statFooter}>
            <Clock size={12} style={{marginRight: '4px'}} />
            Manual count
          </div>
        </div>

          <div 
            style={styles.statCard}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <div style={styles.statHeader}>
              <div style={{...styles.statIcon, backgroundColor: '#f3e8ff'}}>
                <Target size={24} color="#9333ea" />
              </div>
              <span style={{...styles.statusBadge, color: '#166534', backgroundColor: '#dcfce7'}}>
                {pumpsLoading ? 'Loading...' : `${nozzleData.filter(n => n.status).length}/${nozzleData.length} Online`}
              </span>
            </div>
            <h3 style={styles.statValue}>
              {pumpsLoading ? '...' : `${nozzleData.filter(n => n.status).length}/${nozzleData.length}`}
            </h3>
            <p style={styles.statLabel}>Pumps/Nozzles Active</p>
            <div style={styles.statFooter}>
              <TrendingUp size={12} style={{marginRight: '4px'}} />
              {pumpsLoading ? 'Loading...' : `${Math.round((nozzleData.filter(n => n.status).length / nozzleData.length) * 100)}% uptime`}
            </div>
          </div>

          <div 
            style={styles.statCard}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <div style={styles.statHeader}>
              <div style={{...styles.statIcon, backgroundColor: '#fef3c7'}}>
                <AlertTriangle size={24} color="#d97706" />
              </div>
              <span style={{...styles.statusBadge, color: '#ca8a04', backgroundColor: '#fef3c7'}}>Monitor</span>
            </div>
            <h3 style={styles.statValue}>+70 L</h3>
            <p style={styles.statLabel}>E vs V Difference</p>
            <div style={styles.statFooter}>
              <AlertTriangle size={12} color="#ca8a04" style={{marginRight: '4px'}} />
              Check variance
            </div>
          </div>
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
  <div style={{marginBottom: '32px'}}>
    <h4 style={{
      fontSize: '16px',
      fontWeight: '600',
      color: '#2563eb',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      ⛽ Unleaded Nozzles
    </h4>
    <div style={styles.nozzleGrid}>
      {nozzleData
        .filter(nozzle => nozzle.name.toLowerCase().includes('unleaded') || 
                          nozzle.name.toLowerCase().includes('petrol') || 
                          nozzle.name.toLowerCase().includes('pms') ||
                          nozzle.name.includes('A2'))
        .map((nozzle) => (
          <div key={nozzle.id} style={{
            ...styles.nozzleCard,
            padding: '20px'
          }}>
            <div style={styles.nozzleHeader}>
              <span style={styles.nozzleName}>{nozzle.name}</span>
              <span style={{
                ...styles.nozzleStatus,
                color: nozzle.status ? '#166534' : '#dc2626',
                backgroundColor: nozzle.status ? '#dcfce7' : '#fee2e2'
              }}>
                {nozzle.status ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {/* 4 Metrics Grid - All Same Color */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '16px'
            }}>
              {/* 1. Sold Today */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {nozzle.sold.toLocaleString()} L
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#64748b',
                  margin: '2px 0 0 0'
                }}>
                  Sold Today
                </p>
              </div>

              {/* 2. E-Total */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {(nozzle.sold * 0.95).toFixed(0)} L
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#64748b',
                  margin: '2px 0 0 0'
                }}>
                  E-Total
                </p>
              </div>

              {/* 3. V-Total */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {(nozzle.sold * 0.92).toFixed(0)} L
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#64748b',
                  margin: '2px 0 0 0'
                }}>
                  V-Total
                </p>
              </div>

              {/* 4. M-Total (Manual Entry) */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '8px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <input
                  type="number"
                  placeholder="Enter"
                  style={{
                    width: '100%',
                    padding: '4px 6px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#1e293b',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <p style={{
                  fontSize: '10px',
                  color: '#64748b',
                  margin: '4px 0 0 0'
                }}>
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
    <h4 style={{
      fontSize: '16px',
      fontWeight: '600',
      color: '#16a34a',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      🚛 Diesel Nozzles
    </h4>
    <div style={styles.nozzleGrid}>
      {nozzleData
        .filter(nozzle => nozzle.name.toLowerCase().includes('diesel') || 
                          nozzle.name.toLowerCase().includes('ago') ||
                          nozzle.name.includes('A1'))
        .map((nozzle) => (
          <div key={nozzle.id} style={{
            ...styles.nozzleCard,
            padding: '20px'
          }}>
            <div style={styles.nozzleHeader}>
              <span style={styles.nozzleName}>{nozzle.name}</span>
              <span style={{
                ...styles.nozzleStatus,
                color: nozzle.status ? '#166534' : '#dc2626',
                backgroundColor: nozzle.status ? '#dcfce7' : '#fee2e2'
              }}>
                {nozzle.status ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {/* 4 Metrics Grid - All Same Color */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '16px'
            }}>
              {/* 1. Sold Today */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {nozzle.sold.toLocaleString()} L
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#64748b',
                  margin: '2px 0 0 0'
                }}>
                  Sold Today
                </p>
              </div>

              {/* 2. E-Total */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {(nozzle.sold * 0.95).toFixed(0)} L
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#64748b',
                  margin: '2px 0 0 0'
                }}>
                  E-Total
                </p>
              </div>

              {/* 3. V-Total */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {(nozzle.sold * 0.92).toFixed(0)} L
                </p>
                <p style={{
                  fontSize: '10px',
                  color: '#64748b',
                  margin: '2px 0 0 0'
                }}>
                  V-Total
                </p>
              </div>

              {/* 4. M-Total (Manual Entry) */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '8px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <input
                  type="number"
                  placeholder="Enter"
                  style={{
                    width: '100%',
                    padding: '4px 6px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#1e293b',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <p style={{
                  fontSize: '10px',
                  color: '#64748b',
                  margin: '4px 0 0 0'
                }}>
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
              style={{...styles.actionButton, backgroundColor: '#dbeafe', color: '#1e40af'}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bfdbfe')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
            >
              <Gauge size={24} style={{marginBottom: '8px'}} />
              <span>Update Levels</span>
            </button>
           <button 
  onClick={() => setShowSalesModal(true)}
  style={{...styles.actionButton, backgroundColor: '#dcfce7', color: '#166534'}}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bbf7d0')}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dcfce7')}
>
  <div style={{fontSize: '24px', marginBottom: '8px'}}>💰</div>
  <span>Record Sales</span>
</button>
            <button 
              onClick={() => setShowChecklistModal(true)}
              style={{...styles.actionButton, backgroundColor: '#f3e8ff', color: '#7c3aed'}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9d5ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3e8ff')}
            >
              <Clock size={24} style={{marginBottom: '8px'}} />
              <span>Checklist</span>
            </button>
            <button 
              onClick={() => setShowIssueModal(true)}
              style={{...styles.actionButton, backgroundColor: '#fed7aa', color: '#c2410c'}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdba74')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fed7aa')}
            >
              <AlertTriangle size={24} style={{marginBottom: '8px'}} />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div style={styles.successMessage}>
          <div style={styles.messageContent}>
            <div style={styles.messageIcon}>
              <Shield size={24} color="#2563eb" />
            </div>
            <div>
              <h3 style={styles.messageTitle}>🎉 Station System Active</h3>
              <p style={styles.messageText}>
                Your station monitoring tools are running perfectly! Tank levels, sales tracking, pump monitoring, and alert systems are all operational.
                {!pumpsLoading && ` Currently monitoring ${nozzleData.length} pumps/nozzles.`}
              </p>
            </div>
          </div>
        </div>

        {/* Checklist Modal */}
        {showChecklistModal && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Daily Safety Checklist</h3>
                <button 
                  onClick={handleCloseModal}
                  style={styles.closeButton}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  ✕
                </button>
              </div>
              
              <div style={styles.checklistContainer}>
                <div 
                  style={{
                    ...styles.checklistItem,
                    ...(checklistItems.calibration ? styles.checklistItemChecked : {})
                  }}
                  onClick={() => handleChecklistItemChange('calibration')}
                >
                  <div 
                    style={{
                      ...styles.checkbox,
                      ...(checklistItems.calibration ? styles.checkboxChecked : {})
                    }}
                  >
                    {checklistItems.calibration && '✓'}
                  </div>
                  <span 
                    style={{
                      ...styles.checklistLabel,
                      ...(checklistItems.calibration ? styles.checklistLabelChecked : {})
                    }}
                  >
                    Calibration completed and verified?
                  </span>
                </div>

                <div 
                  style={{
                    ...styles.checklistItem,
                    ...(checklistItems.pipelineLeak ? styles.checklistItemChecked : {})
                  }}
                  onClick={() => handleChecklistItemChange('pipelineLeak')}
                >
                  <div 
                    style={{
                      ...styles.checkbox,
                      ...(checklistItems.pipelineLeak ? styles.checkboxChecked : {})
                    }}
                  >
                    {checklistItems.pipelineLeak && '✓'}
                  </div>
                  <span 
                    style={{
                      ...styles.checklistLabel,
                      ...(checklistItems.pipelineLeak ? styles.checklistLabelChecked : {})
                    }}
                  >
                    Pipeline inspected for leaks or damage?
                  </span>
                </div>

                <div 
                  style={{
                    ...styles.checklistItem,
                    ...(checklistItems.tankLeak ? styles.checklistItemChecked : {})
                  }}
                  onClick={() => handleChecklistItemChange('tankLeak')}
                >
                  <div 
                    style={{
                      ...styles.checkbox,
                      ...(checklistItems.tankLeak ? styles.checkboxChecked : {})
                    }}
                  >
                    {checklistItems.tankLeak && '✓'}
                  </div>
                  <span 
                    style={{
                      ...styles.checklistLabel,
                      ...(checklistItems.tankLeak ? styles.checklistLabelChecked : {})
                    }}
                  >
                    Storage tanks checked for leaks or structural issues?
                  </span>
                </div>

                <div 
                  style={{
                    ...styles.checklistItem,
                    ...(checklistItems.safetyEquipment ? styles.checklistItemChecked : {})
                  }}
                  onClick={() => handleChecklistItemChange('safetyEquipment')}
                >
                  <div 
                    style={{
                      ...styles.checkbox,
                      ...(checklistItems.safetyEquipment ? styles.checkboxChecked : {})
                    }}
                  >
                    {checklistItems.safetyEquipment && '✓'}
                  </div>
                  <span 
                    style={{
                      ...styles.checklistLabel,
                      ...(checklistItems.safetyEquipment ? styles.checklistLabelChecked : {})
                    }}
                  >
                    Safety equipment functional and accessible?
                  </span>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  onClick={handleCloseModal}
                  style={{...styles.modalButton, ...styles.cancelButton}}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveChecklist}
                  style={{...styles.modalButton, ...styles.saveButton}}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
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
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Daily Sales Record</h3>
                <button 
                  onClick={handleCloseSalesModal}
                  style={styles.closeButton}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  ✕
                </button>
              </div>
              
              <div style={styles.checklistContainer}>
                {/* Unleaded Sales */}
                <div style={styles.salesRow}>
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>⛽</span>
                      Unleaded Sales
                    </div>
                    <div style={styles.salesDetails}>
                      {salesData.unleaded.liters.toLocaleString()} L × TSH {salesData.unleaded.pricePerLiter}
                    </div>
                  </div>
                  <div style={styles.salesValue}>
                    TSH{salesData.unleaded.cash.toLocaleString()}
                  </div>
                </div>

                {/* Diesel Sales */}
                <div style={styles.salesRow}>
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>🚛</span>
                      Diesel Sales
                    </div>
                    <div style={styles.salesDetails}>
                      {salesData.diesel.liters.toLocaleString()} L × TSH{salesData.diesel.pricePerLiter}
                    </div>
                  </div>
                  <div style={styles.salesValue}>
                    TSH{salesData.diesel.cash.toLocaleString()}
                  </div>
                </div>

                {/* Combined Fuel Sales */}
                <div style={{...styles.salesRow, ...styles.salesRowTotal}}>
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>📊</span>
                      Total Fuel Sales (Unleaded + Diesel)
                    </div>
                    <div style={styles.salesDetails}>
                      Combined cash from both fuel types
                    </div>
                  </div>
                  <div style={{...styles.salesValue, color: '#1d4ed8'}}>
                    TSH{(salesData.unleaded.cash + salesData.diesel.cash).toLocaleString()}
                  </div>
                </div>

                {/* E_Total System Sales */}
                <div style={{...styles.salesRow, ...styles.salesRowETotals}}>
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>💰</span>
                      E_Total System Revenue
                    </div>
                    <div style={styles.salesDetails}>
                      Electronic system total (includes all transactions)
                    </div>
                  </div>
                  <div style={{...styles.salesValue, ...styles.salesValueHighlight}}>
                    TSH{salesData.eTotalCash.toLocaleString()}
                  </div>
                </div>
                {/* Manager's Cash - Manual Entry */}
                <div style={{
                  ...styles.salesRow,
                  backgroundColor: '#f0fdf4',
                  borderColor: '#22c55e'
                }}>
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>💰</span>
                      Manager's Cash (Manual Entry)
                    </div>
                    <div style={styles.salesDetails}>
                      Cash counted by station manager
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <input
                    type="number"
                    placeholder="Enter amount"
                    value={managerCash}
                    onChange={(e) => setManagerCash(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #22c55e',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '600',
                      width: '140px',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                    <span style={{fontSize: '16px', fontWeight: '600', color: '#16a34a'}}>TSH</span>
                  </div>
                </div>

                {/* Variance Analysis */}
                <div style={{
                  ...styles.salesRow,
                  backgroundColor: '#fef3c7',
                  borderColor: '#f59e0b'
                }}>
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>📈</span>
                      Variance Analysis
                    </div>
                    <div style={styles.salesDetails}>
                      Difference between manual calculation and E_Total
                    </div>
                  </div>
                  <div style={{
                    ...styles.salesValue,
                    color: salesData.eTotalCash - (salesData.unleaded.cash + salesData.diesel.cash) >= 0 ? '#16a34a' : '#dc2626'
                  }}>
                    TSH{" "}{" "}
                    {salesData.eTotalCash - (parseFloat(managerCash) || 0) >= 0 ? '+' : ''}
                    { (salesData.eTotalCash - (parseFloat(managerCash) || 0)).toLocaleString()}
                  </div>
                </div>
              </div>
             


              <div style={styles.modalFooter}>
                <button 
                  onClick={handleCloseSalesModal}
                  style={{...styles.modalButton, ...styles.cancelButton}}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  Close
                </button>
                <button 
                  onClick={handleSaveSales}
                  style={{...styles.modalButton, ...styles.saveButton}}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                >
									{
										loadingSalesModal ? (
											<span>Loading...</span>
										) : (
											<span>Record Sales</span>
										)
									}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Issue Modal */}
        {showIssueModal && (
          <div style={styles.modalOverlay} onClick={handleCloseIssueModal}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>🚨 Report Station Issue</h3>
                <button 
                  onClick={handleCloseIssueModal}
                  style={styles.closeButton}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
                      ...(issueCategory === 'emergency' ? styles.urgentCategory : {})
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
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
                    {issueCategory === 'emergency' && <span style={{color: '#dc2626'}}> (URGENT)</span>}
                  </label>
                  <textarea
                    value={issueMessage}
                    onChange={(e) => setIssueMessage(e.target.value)}
                    placeholder="Please describe the issue in detail. Include location, time noticed, severity, and any immediate actions taken..."
                    style={{
                      ...styles.textarea,
                      ...(issueCategory === 'emergency' ? styles.urgentCategory : {})
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    maxLength={500}
                  />
                  <div style={styles.characterCount}>
                    {issueMessage.length}/500 characters
                  </div>
                </div>

                {/* SMS Preview */}
                <div style={{
                  ...styles.salesRow,
                  backgroundColor: '#f0f9ff',
                  borderColor: '#0ea5e9'
                }}>
                  <div>
                    <div style={styles.salesLabel}>
                      <span style={styles.salesIcon}>📱</span>
                      SMS Preview to General Manager
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#374151',
                      marginTop: '8px',
                      fontStyle: 'italic',
                      padding: '8px',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}>
                      "STATION ALERT: {stationData?.name || 'Station'} - {issueCategory.toUpperCase()}<br/>
                      {issueMessage || '[Issue description will appear here]'}<br/>
                      Reported by: Station Manager<br/>
                      Time: {new Date().toLocaleString()}"
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button 
                  onClick={handleCloseIssueModal}
                  style={{...styles.modalButton, ...styles.cancelButton}}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendIssueReport}
                  disabled={issueSending || !issueMessage.trim()}
                  style={{
                    ...styles.modalButton,
                    ...(issueCategory === 'emergency' ? {backgroundColor: '#dc2626'} : styles.saveButton),
                    ...(issueSending ? styles.sendingButton : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!issueSending && issueMessage.trim()) {
                      e.currentTarget.style.backgroundColor = issueCategory === 'emergency' ? '#b91c1c' : '#15803d'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!issueSending && issueMessage.trim()) {
                      e.currentTarget.style.backgroundColor = issueCategory === 'emergency' ? '#dc2626' : '#16a34a'
                    }
                  }}
                >
                  {issueSending ? (
                    <>
                      <Loader2 size={16} style={{marginRight: '8px', animation: 'spin 1s linear infinite'}} />
                      Sending SMS...
                    </>
                  ) : (
                    <>
                      📱 Send SMS Alert
                      {issueCategory === 'emergency' && ' (URGENT)'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}