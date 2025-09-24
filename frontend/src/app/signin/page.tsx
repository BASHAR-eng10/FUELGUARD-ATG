'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Shield, Mail, ArrowRight, CheckCircle, AlertCircle, Loader2, Lock, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

interface Account {
  password: string
  role: string
  redirect: string
  canAccessAll: boolean
  stationId?: number
  displayName: string
  location?: string
  operator?: string
}

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const stationAccounts = {
        'manager@fuelstation.com': { 
          password: 'manager123', 
          role: 'General Manager', 
          redirect: '/dashboard/general',
          canAccessAll: true,
          displayName: 'General Manager - Access to all stations',
          location: 'Ilala, Dar es Salaam',
          operator: 'LAKE OIL'
        },
        'ungaltd@manager.com': { 
          password: 'unga1441', 
          role: 'UNGA LTD STATION', 
          redirect: '/dashboard/station/1',
          canAccessAll: false,
          stationId: 1,
          displayName: 'UNGA LTD STATION Manager',
          location: 'Kipunguni, Ilala MC Kipawa',
          operator: 'LAKE OIL'
        }
      } as const
  const router = useRouter()

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setMessage('')

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })
    console.log(`Sign in page result:`, result);

    if (result?.error) {
      setMessage('Invalid credentials')
      setIsSuccess(false)
    } else {
      setIsSuccess(true)
      setMessage('Login successful! Redirecting...')
      
      // Get the session to determine redirect path
      const session = await getSession()
      
      setTimeout(() => {
        if (session?.user.canAccessAll) {
          router.push('/dashboard/general')
        } else {
          router.push(`/dashboard/station/${session?.user.stationId}`)
        }
      }, 1000)
    }
  } catch (error) {
    setMessage('Login failed')
    setIsSuccess(false)
  } finally {
    setIsLoading(false)
  }
}

  const fillDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div style={{
  minHeight: '100vh',
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '48px 24px',
  fontFamily: 'system-ui, -apple-system, sans-serif'
}}>
      <div style={{
        position: 'relative',
        margin: '0 auto',
        width: '100%',
        maxWidth: '28rem'
      }}>
        
        {/* Header */}
<div style={{ textAlign: 'center', marginBottom: '32px' }}>
  {/* Company Logo */}
  <div style={{
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Image
      src="/Guardlogo.png"
      alt="FuelGuard Logo"
      width={250}
      height={150}
      style={{
        objectFit: 'contain'
      }}
    />
  </div>
  
  <h2 style={{
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px'
  }}>
    Welcome Back
  </h2>
  <p style={{ color: '#6b7280', marginBottom: '8px' }}>Lake Oil Group</p>
  <p style={{ fontSize: '14px', color: '#9ca3af' }}>
    Fuel Station Monitoring System
  </p>
</div>

        {/* Sign In Form */}
        <div style={{
          marginTop: '32px',
          background: '#ffffff',
          padding: '32px 24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '16px',
          border: '1px solid #e5e7eb'
        }}>
          
          {/* Email Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <Mail size={20} color="#9ca3af" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  display: 'block',
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <Lock size={20} color="#9ca3af" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  display: 'block',
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '40px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db'
                  e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px 16px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '12px',
              color: '#ffffff',
              background: isLoading ? '#9ca3af' : '#2563eb',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#1d4ed8'
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#2563eb'
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            {isLoading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </>
            )}
          </button>

          {/* Message Display */}
          {message && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid',
              display: 'flex',
              alignItems: 'center',
              background: isSuccess ? '#f0fdf4' : '#fef2f2',
              borderColor: isSuccess ? '#bbf7d0' : '#fecaca',
              color: isSuccess ? '#166534' : '#dc2626'
            }}>
              {isSuccess ? (
                <CheckCircle size={20} style={{ marginRight: '12px', flexShrink: 0 }} />
              ) : (
                <AlertCircle size={20} style={{ marginRight: '12px', flexShrink: 0 }} />
              )}
              <p style={{ fontSize: '14px', fontWeight: '500', margin: 0 }}>{message}</p>
            </div>
          )}

          {/* Demo Accounts */}
					{
						process.env.NODE_ENV === 'development' ? (
          <div style={{ marginTop: '32px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f9fafb 0%, #dbeafe 100%)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Shield size={16} color="#2563eb" style={{ marginRight: '8px' }} />
                Available Accounts
              </h3>
              
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(stationAccounts).map(([emailKey, account]) => (
                    <button
                      key={emailKey}
                      onClick={() => fillDemoAccount(emailKey, account.password)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db'
                        e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#111827',
                            margin: 0
                          }}>
                            {emailKey}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            margin: 0
                          }}>
                            {account.displayName}
                          </p>
                          {account.location && (
                            <p style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                              margin: 0
                            }}>
                              📍 {account.location}
                            </p>
                          )}
                          {account.operator && (
                            <p style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                              margin: 0
                            }}>
                              🏢 {account.operator}
                            </p>
                          )}
                          <p style={{
                            fontSize: '10px',
                            color: '#9ca3af',
                            marginTop: '2px',
                            margin: 0
                          }}>
                            Password: {account.password}
                          </p>
                        </div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: account.canAccessAll ? '#3b82f6' : '#10b981'
                        }}></div>
                      </div>
                    </button>
                  ))}
                </div>
            </div>
          </div>
      ) : null}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            Secure role-based authentication system
          </p>
        </div>
      </div>
    </div>
  )
}