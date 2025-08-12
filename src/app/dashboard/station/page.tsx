'use client'

import { useState, useEffect } from 'react'
import { Shield, Gauge, Droplets, DollarSign, AlertTriangle, Settings, LogOut, Bell, TrendingUp, Clock, Thermometer, Target, Edit3, Truck, Loader2, RefreshCw } from 'lucide-react'
import apiService from "../../../services/api"

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

interface NozzleData {
  id: number
  name: string
  sold: number
  percentage: number
  status: string
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
  }
}

export default function StationDashboard() {
  const [stationData, setStationData] = useState<StationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get station ID from URL
  const getStationId = (): string => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('id') || '1'
    }
    return '1'
  }

  // Fetch station data from API
  const fetchStationData = async () => {
    try {
      setLoading(true)
      setError(null)
      const stationId = getStationId()
      
      console.log('Fetching station data for ID:', stationId)
      
      // Fetch station info

      const result = await apiService.getAllStations()
      console.log('Station API Response:', result)
      
      if (result.data && Array.isArray(result.data)) {
        console.log('Available stations:', result.data.map((s: any) => ({ id: s.id, name: s.RetailStationName })))
        
        const station = result.data.find((s: any) => s.id.toString() === stationId)
        console.log('Found station:', station)
        
        if (station) {
          setStationData({
            id: station.id,
            name: station.name,
            location: `${station.location.ward}, ${station.location.district}`,
            region: station.location.region,
            zone: station.zone,
            operatorName: station.operator.name,
            contactEmail: station.contact.email,
            contactPhone: station.contact.phone,
            ewuraLicense: station.ewuraLicense,
            tanks: station.technical.totalTanks,
            username: station.automation.username,
            password: station.automation.password
          })
        } else {
          throw new Error(`Station with ID ${stationId} not found. Available stations: ${result.data.map((s: any) => s.id).join(', ')}`)
        }
      } else {
        console.error('Invalid API response structure:', result)
        throw new Error('Invalid data format received from API')
      }
    } catch (err) {
      console.error('Error fetching station data:', err)
      setError((err as Error).message)
      // Enhanced fallback data
      const stationId = getStationId()
      setStationData({
        id: parseInt(stationId),
        name: `Station ${stationId} (Fallback)`,
        location: 'Location unavailable',
        operatorName: 'LAKE OIL',
        tanks: 2,
        ewuraLicense: 'License unavailable'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStationData()
  }, [])

  // Sample data - will come from endpoints later
  const nozzleData: NozzleData[] = [
    { id: 1, name: 'Nozzle 1', sold: 1250, percentage: 15.2, status: 'active' },
    { id: 2, name: 'Nozzle 2', sold: 980, percentage: 12.8, status: 'active' },
    { id: 3, name: 'Nozzle 3', sold: 1450, percentage: 18.5, status: 'active' },
    { id: 4, name: 'Nozzle 4', sold: 750, percentage: 9.1, status: 'inactive' },
    { id: 5, name: 'Nozzle 5', sold: 1120, percentage: 14.3, status: 'active' },
    { id: 6, name: 'Nozzle 6', sold: 890, percentage: 11.7, status: 'active' }
  ]

  const handleSignOut = () => {
    window.location.href = '/signin'
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
          <h2 style={styles.welcomeTitle}>Station Overview 🏪</h2>
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
                <div>⛽ <strong>Tanks:</strong> {stationData.tanks}</div>
              </div>
              <button
                onClick={fetchStationData}
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
                Refresh Data
              </button>
            </div>
          )}
        </div>

        {/* Tank Monitoring */}
        <div style={styles.tankGrid}>
          {/* Tank 1 - Unleaded */}
          <div style={styles.tankCard}>
            <div style={styles.tankHeader}>
              <div style={styles.tankInfo}>
                <div style={{...styles.tankIcon, backgroundColor: '#dbeafe'}}>
                  <Gauge size={24} color="#2563eb" />
                </div>
                <div style={styles.tankDetails}>
                  <h3 style={styles.tankName}>Tank 1 - Unleaded</h3>
                  <p style={styles.tankCapacity}>95,000 L capacity</p>
                </div>
              </div>
              <span style={{...styles.statusBadge, color: '#166534', backgroundColor: '#dcfce7'}}>Normal</span>
            </div>

            <div style={styles.levelSection}>
              <div style={styles.levelHeader}>
                <span style={styles.levelLabel}>Current Level</span>
                <span style={{...styles.levelPercentage, color: '#2563eb'}}>75%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: '75%',
                  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                }}></div>
              </div>
              <div style={styles.levelDetails}>
                <span>0 L</span>
                <span style={{fontWeight: '500', color: '#374151'}}>71,250 liters</span>
                <span>95,000 L</span>
              </div>
            </div>

            <div style={styles.metricsGrid}>
              <div style={styles.metricBox}>
                <div style={styles.metricHeader}>
                  <Thermometer size={16} color="#f59e0b" />
                  <span style={styles.metricLabel}>Temperature</span>
                </div>
                <p style={styles.metricValue}>20°C</p>
              </div>
              <div style={styles.metricBox}>
                <div style={styles.metricHeader}>
                  <Droplets size={16} color="#3b82f6" />
                  <span style={styles.metricLabel}>Water Level</span>
                </div>
                <p style={styles.metricValue}>0.5cm</p>
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

          {/* Tank 2 - Diesel */}
          <div style={styles.tankCard}>
            <div style={styles.tankHeader}>
              <div style={styles.tankInfo}>
                <div style={{...styles.tankIcon, backgroundColor: '#dcfce7'}}>
                  <Gauge size={24} color="#16a34a" />
                </div>
                <div style={styles.tankDetails}>
                  <h3 style={styles.tankName}>Tank 2 - Diesel</h3>
                  <p style={styles.tankCapacity}>95,000 L capacity</p>
                </div>
              </div>
              <span style={{...styles.statusBadge, color: '#ca8a04', backgroundColor: '#fef3c7'}}>Monitor</span>
            </div>

            <div style={styles.levelSection}>
              <div style={styles.levelHeader}>
                <span style={styles.levelLabel}>Current Level</span>
                <span style={{...styles.levelPercentage, color: '#16a34a'}}>60%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: '60%',
                  background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                }}></div>
              </div>
              <div style={styles.levelDetails}>
                <span>0 L</span>
                <span style={{fontWeight: '500', color: '#374151'}}>57,000 liters</span>
                <span>95,000 L</span>
              </div>
            </div>

            <div style={styles.metricsGrid}>
              <div style={styles.metricBox}>
                <div style={styles.metricHeader}>
                  <Thermometer size={16} color="#f59e0b" />
                  <span style={styles.metricLabel}>Temperature</span>
                </div>
                <p style={styles.metricValue}>22°C</p>
              </div>
              <div style={styles.metricBox}>
                <div style={styles.metricHeader}>
                  <Droplets size={16} color="#eab308" />
                  <span style={styles.metricLabel}>Water Level</span>
                </div>
                <p style={{...styles.metricValue, color: '#ca8a04'}}>2.0cm</p>
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
                  <p style={styles.quantityValue}>62,800 L</p>
                </div>
                <div style={styles.quantityItem}>
                  <div style={styles.quantityLabel}>Closing (Endpoint)</div>
                  <p style={styles.quantityValue}>57,000 L</p>
                </div>
                <div style={styles.quantityItem}>
                  <div style={{...styles.quantityLabel, display: 'flex', alignItems: 'center', gap: '4px'}}>
                    Opening (Manual)
                    <button style={styles.editButton} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <Edit3 size={12} color="#64748b" />
                    </button>
                  </div>
                  <p style={styles.quantityValue}>62,750 L</p>
                </div>
                <div style={styles.quantityItem}>
                  <div style={{...styles.quantityLabel, display: 'flex', alignItems: 'center', gap: '4px'}}>
                    Closing (Manual)
                    <button style={styles.editButton} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <Edit3 size={12} color="#64748b" />
                    </button>
                  </div>
                  <p style={styles.quantityValue}>56,920 L</p>
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
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                  <p style={{...styles.quantityValue, color: '#6366f1'}}>12,800 L</p>
                </div>
                <div style={styles.quantityItem}>
                  <div style={styles.quantityLabel}>Difference (Manual - ATG)</div>
                  <p style={{...styles.quantityValue, color: '#16a34a'}}>+80 L</p>
                  <div style={{fontSize: '11px', color: '#16a34a', marginTop: '2px'}}>
                    Manual value higher than ATG
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  <p style={{...styles.nozzleMetricValue, fontSize: '20px'}}>$1.45</p>
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
                  <p style={{...styles.nozzleMetricValue, fontSize: '20px'}}>$1.52</p>
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

        {/* Sales Metrics */}
        <div style={styles.nozzleSection}>
          <h3 style={styles.nozzleTitle}>
            <TrendingUp size={20} color="#059669" />
            Sales Analysis
          </h3>
          <div style={styles.nozzleGrid}>
            <div style={styles.nozzleCard}>
              <div style={styles.nozzleHeader}>
                <span style={styles.nozzleName}>E_Total Sales</span>
                <span style={{
                  ...styles.nozzleStatus,
                  color: '#1d4ed8',
                  backgroundColor: '#dbeafe'
                }}>
                  System
                </span>
              </div>
              <div style={styles.nozzleMetrics}>
                <div style={styles.nozzleMetric}>
                  <p style={styles.nozzleMetricValue}>10,020 L</p>
                  <p style={styles.nozzleMetricLabel}>Total Liters</p>
                </div>
                <div style={styles.nozzleMetric}>
                  <p style={{...styles.nozzleMetricValue, color: '#16a34a'}}>$14,629</p>
                  <p style={styles.nozzleMetricLabel}>Cash Value</p>
                </div>
              </div>
            </div>

            <div style={styles.nozzleCard}>
              <div style={styles.nozzleHeader}>
                <span style={styles.nozzleName}>V_Total Sales</span>
                <span style={{
                  ...styles.nozzleStatus,
                  color: '#7c3aed',
                  backgroundColor: '#f3e8ff'
                }}>
                  Volume
                </span>
              </div>
              <div style={styles.nozzleMetrics}>
                <div style={styles.nozzleMetric}>
                  <p style={styles.nozzleMetricValue}>9,950 L</p>
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
                <span style={{
                  ...styles.nozzleStatus,
                  color: '#ca8a04',
                  backgroundColor: '#fef3c7'
                }}>
                  Variance
                </span>
              </div>
              <div style={styles.nozzleMetrics}>
                <div style={styles.nozzleMetric}>
                  <p style={{...styles.nozzleMetricValue, color: '#ca8a04'}}>+70 L</p>
                  <p style={styles.nozzleMetricLabel}>Difference</p>
                </div>
                <div style={styles.nozzleMetric}>
                  <p style={{...styles.nozzleMetricValue, color: '#ca8a04'}}>+0.7%</p>
                  <p style={styles.nozzleMetricLabel}>Variance</p>
                </div>
              </div>
            </div>

            <div style={styles.nozzleCard}>
              <div style={styles.nozzleHeader}>
                <span style={styles.nozzleName}>M_Total Sales</span>
                <span style={{
                  ...styles.nozzleStatus,
                  color: '#dc2626',
                  backgroundColor: '#fee2e2'
                }}>
                  Manual
                </span>
              </div>
              <div style={styles.nozzleMetrics}>
                <div style={styles.nozzleMetric}>
                  <p style={styles.nozzleMetricValue}>9,980 L</p>
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

        {/* Nozzle Performance */}
        <div style={styles.nozzleSection}>
          <h3 style={styles.nozzleTitle}>
            <Target size={20} color="#6366f1" />
            Nozzle Performance
          </h3>
          <div style={styles.nozzleGrid}>
            {nozzleData.map((nozzle) => (
              <div key={nozzle.id} style={styles.nozzleCard}>
                <div style={styles.nozzleHeader}>
                  <span style={styles.nozzleName}>{nozzle.name}</span>
                  <span style={{
                    ...styles.nozzleStatus,
                    color: nozzle.status === 'active' ? '#166534' : '#dc2626',
                    backgroundColor: nozzle.status === 'active' ? '#dcfce7' : '#fee2e2'
                  }}>
                    {nozzle.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={styles.nozzleMetrics}>
                  <div style={styles.nozzleMetric}>
                    <p style={styles.nozzleMetricValue}>{nozzle.sold.toLocaleString()} L</p>
                    <p style={styles.nozzleMetricLabel}>Sold Today</p>
                  </div>
                  <div style={styles.nozzleMetric}>
                    <p style={styles.nozzleMetricValue}>{nozzle.percentage}%</p>
                    <p style={styles.nozzleMetricLabel}>of Total</p>
                  </div>
                </div>
              </div>
            ))}
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
                <DollarSign size={24} color="#16a34a" />
              </div>
              <span style={{...styles.statusBadge, color: '#166534', backgroundColor: '#dcfce7'}}>+15%</span>
            </div>
            <h3 style={styles.statValue}>$14,629</h3>
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
              <div style={{...styles.statIcon, backgroundColor: '#dbeafe'}}>
                <Droplets size={24} color="#2563eb" />
              </div>
              <span style={{...styles.statusBadge, color: '#1d4ed8', backgroundColor: '#dbeafe'}}>Normal</span>
            </div>
            <h3 style={styles.statValue}>10,020</h3>
            <p style={styles.statLabel}>Liters Sold (E_Total)</p>
            <div style={styles.statFooter}>
              <Clock size={12} style={{marginRight: '4px'}} />
              Since 6:00 AM
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
              <span style={{...styles.statusBadge, color: '#166534', backgroundColor: '#dcfce7'}}>All Online</span>
            </div>
            <h3 style={styles.statValue}>6/6</h3>
            <p style={styles.statLabel}>Nozzles Active</p>
            <div style={styles.statFooter}>
              <TrendingUp size={12} style={{marginRight: '4px'}} />
              100% uptime
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
              style={{...styles.actionButton, backgroundColor: '#dcfce7', color: '#166534'}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bbf7d0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dcfce7')}
            >
              <DollarSign size={24} style={{marginBottom: '8px'}} />
              <span>Record Sales</span>
            </button>
            <button 
              style={{...styles.actionButton, backgroundColor: '#f3e8ff', color: '#7c3aed'}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e9d5ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3e8ff')}
            >
              <Clock size={24} style={{marginBottom: '8px'}} />
              <span>Daily Checklist</span>
            </button>
            <button 
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
                Your station monitoring tools are running perfectly! Tank levels, sales tracking, and alert systems are all operational.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}