// Database table interfaces for Kysely
export interface Database {
  users: UsersTable
  email_verification_tokens: EmailVerificationTokensTable
  stations: StationsTable
  tanks: TanksTable
  daily_inventory: DailyInventoryTable
  deliveries: DeliveriesTable
  sales_data: SalesDataTable
  daily_checklist: DailyChecklistTable
  alerts: AlertsTable
  system_logs: SystemLogsTable
}

export interface UsersTable {
  id: string
  email: string
  name: string
  role: 'general_manager' | 'station_manager'
  station_id: string | null
  email_verified: number // SQLite boolean as integer
  created_at: string
  updated_at: string
}

export interface EmailVerificationTokensTable {
  id: string
  email: string
  token: string
  expires_at: string
  created_at: string
}

export interface StationsTable {
  id: string
  name: string
  location: string
  manager_id: string | null
  is_active: number // SQLite boolean as integer
  created_at: string
  updated_at: string
}

export interface TanksTable {
  id: string
  station_id: string
  tank_number: number
  fuel_type: 'unleaded' | 'diesel' | 'premium'
  capacity: number
  current_level: number
  water_level: number
  temperature: number
  last_atg_reading: string
  created_at: string
  updated_at: string
}

export interface DailyInventoryTable {
  id: string
  tank_id: string
  date: string
  opening_stock: number
  closing_stock: number
  manual_reading: number
  atg_reading: number
  discrepancy: number
  created_at: string
  updated_at: string
}

export interface DeliveriesTable {
  id: string
  station_id: string
  tank_id: string
  delivery_date: string
  driver_name: string
  truck_number: string
  fuel_type: 'unleaded' | 'diesel' | 'premium'
  quantity_delivered: number
  receipt_number: string
  pre_delivery_reading: number
  post_delivery_reading: number
  temperature: number
  status: 'pending' | 'completed' | 'discrepancy'
  created_at: string
  updated_at: string
}

export interface SalesDataTable {
  id: string
  station_id: string
  date: string
  nozzle_number: number
  fuel_type: 'unleaded' | 'diesel' | 'premium'
  opening_meter: number
  closing_meter: number
  total_sales: number
  price_per_gallon: number
  total_revenue: number
  cash_collected: number
  credit_card_sales: number
  created_at: string
  updated_at: string
}

export interface DailyChecklistTable {
  id: string
  station_id: string
  date: string
  calibration_check: number // SQLite boolean as integer
  leakage_inspection: number // SQLite boolean as integer
  safety_equipment: number // SQLite boolean as integer
  pump_functionality: number // SQLite boolean as integer
  tank_inspection: number // SQLite boolean as integer
  completed_by: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AlertsTable {
  id: string
  station_id: string
  type: 'fuel_discrepancy' | 'cash_shortage' | 'equipment_fault' | 'water_detection' | 'theft_detected'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  is_resolved: number // SQLite boolean as integer
  resolved_by: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface SystemLogsTable {
  id: string
  user_id: string
  action: string
  table_affected: string | null
  record_id: string | null
  old_values: string | null // JSON string
  new_values: string | null // JSON string
  ip_address: string | null
  user_agent: string | null
  created_at: string
}