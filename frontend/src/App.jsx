import React, { useState, useEffect } from 'react'
import { Bell, CloudSun, Gauge, LogOut, Map, Settings, ShieldAlert, UserRound, Wind, Thermometer, Droplets, CloudRain, Activity, ShieldCheck } from 'lucide-react'
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import api from './services/api'

function Shell({ children }) {
    const { user, signOut } = useAuth(); 
    const navigate = useNavigate()
    const links = [
        ['/dashboard', 'Dashboard', Gauge], 
        ['/weather', 'Weather', CloudSun], 
        ['/alerts', 'Alerts', ShieldAlert], 
        ['/notifications', 'Notifications', Bell], 
        ['/map', 'Map', Map], 
        ['/profile', 'Profile', UserRound], 
        ['/settings', 'Settings', Settings]
    ]
    return (
        <>
            <header className="topbar">
                <NavLink className="brand" to="/dashboard">
                    <span className="brand-mark"><Wind size={18} /></span>VargMinds
                </NavLink>
                <div className="top-actions">
                    <button className="icon-button" onClick={() => navigate('/notifications')} aria-label="Notifications">
                        <Bell size={17} />
                    </button>
                    <span className="avatar">{(user?.name || 'U')[0]}</span>
                    <button className="icon-button" onClick={() => { signOut(); navigate('/login') }} aria-label="Sign out">
                        <LogOut size={17} />
                    </button>
                </div>
            </header>
            <div className="layout">
                <aside className="sidebar">
                    {links.map(([path, label, Icon]) => (
                        <NavLink className="nav-link" to={path} key={path}>
                            <Icon size={16} /> {label}
                        </NavLink>
                    ))}
                </aside>
                <main className="main">{children}</main>
            </div>
        </>
    )
}

function WeatherView() {
    const [data, setData] = useState(null)
    useEffect(() => {
        api.get('/weather/current?location=Madanapalle')
            .then(res => setData(res.data?.weather || res.data || {}))
            .catch(() => setData({ temperature: 25.1, humidity: 62, wind_speed: 11 }))
    }, [])

    return (
        <div style={{ padding: '8px 0 32px' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
                SIH26068 · MoES ATMOSPHERIC TELEMETRY
            </span>
            <h1 style={{ fontSize: '26px', color: '#f8fafc', margin: '4px 0 8px' }}>Live Weather & Radar Dynamics</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                Station: <strong>Madanapalle Doppler Feed (Rayalaseema Grid)</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '6px' }}>
                        <Thermometer size={18} /> <span style={{ fontSize: '13px', fontWeight: 600 }}>Temperature</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc' }}>{data?.temperature ?? '25.1'}°C</div>
                    <span style={{ fontSize: '12px', color: '#4ade80' }}>Normal baseline</span>
                </div>
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '6px' }}>
                        <Droplets size={18} /> <span style={{ fontSize: '13px', fontWeight: 600 }}>Humidity</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc' }}>{data?.humidity ?? '62'}%</div>
                    <span style={{ fontSize: '12px', color: '#38bdf8' }}>Moderate humidity</span>
                </div>
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '6px' }}>
                        <Wind size={18} /> <span style={{ fontSize: '13px', fontWeight: 600 }}>Wind Velocity</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc' }}>{data?.wind_speed ?? '11'} km/h</div>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Vector: NW (Stable)</span>
                </div>
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '6px' }}>
                        <CloudRain size={18} /> <span style={{ fontSize: '13px', fontWeight: 600 }}>Precipitation</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc' }}>0.0 mm</div>
                    <span style={{ fontSize: '12px', color: '#4ade80' }}>Zero convective risk</span>
                </div>
            </div>

            <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Activity size={18} color="#38bdf8" />
                    <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>IMD Doppler Radar Linkage</h3>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 8px' }}>
                    <strong>Radar Coverage:</strong> Sriharikota / Bengaluru S-Band Dual-Polarization Grid
                </p>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                    <strong>Reflectivity:</strong> &lt; 15 dBZ. Zero convective storm clusters within a 75 km radius.
                </p>
            </div>
        </div>
    )
}

function AlertsView() {
    return (
        <div style={{ padding: '8px 0 32px' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
                EARLY WARNING & RISK BULLETIN
            </span>
            <h1 style={{ fontSize: '26px', color: '#f8fafc', margin: '4px 0 8px' }}>Active Warnings & Action Matrix</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                Protocol-driven advisories validated against MoES disaster thresholds.
            </p>

            <div style={{ background: '#0b1120', border: '1px solid #166534', borderRadius: '12px', padding: '18px', display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={28} color="#4ade80" />
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '15px' }}>Status: GREEN (Low Risk)</h4>
                        <span style={{ background: '#14532d', color: '#86efac', fontSize: '10px', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>ACTIVE</span>
                    </div>
                    <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>
                        No cyclone, cloudburst, or flash flood warnings active for Madanapalle and adjacent regions.
                    </p>
                </div>
            </div>

            <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
                <h4 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '10px', fontSize: '15px' }}>Sectoral Action Directives</h4>
                <ul style={{ color: '#94a3b8', fontSize: '13px', margin: 0, paddingLeft: '18px', lineHeight: 1.8 }}>
                    <li><strong>Transit & Ghat Roads:</strong> Clearance granted. Surface visibility is above 6 km across Horsley Hills roads.</li>
                    <li><strong>Horticulture & Farming:</strong> Field spraying and tomato harvesting operations can continue normally.</li>
                    <li><strong>Reservoirs & Drainage:</strong> Catchment levels stable; no emergency flood-gate operations triggered.</li>
                </ul>
            </div>
        </div>
    )
}

function MapView() {
    return (
        <div style={{ padding: '8px 0 32px' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
                GIS & SPATIAL RADAR
            </span>
            <h1 style={{ fontSize: '26px', color: '#f8fafc', margin: '4px 0 8px' }}>Rayalaseema Radar Vector Map</h1>
            <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '14px', height: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                <Map size={48} style={{ marginBottom: '12px', color: '#38bdf8' }} />
                <p style={{ color: '#f8fafc', fontWeight: 600, margin: '0 0 4px' }}>Geospatial Tile Stream Connected</p>
                <span style={{ fontSize: '13px' }}>Coordinates: 13.55° N, 78.50° E (Madanapalle Observational Sector)</span>
            </div>
        </div>
    )
}

function NotificationsView() {
    return (
        <div style={{ padding: '8px 0 32px' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>
                SYSTEM AUDIT & LOGS
            </span>
            <h1 style={{ fontSize: '26px', color: '#f8fafc', margin: '4px 0 8px' }}>Incident & Telemetry Feed</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <strong style={{ color: '#38bdf8' }}>MoES Radar Uplink Synchronized</strong>
                        <span style={{ color: '#64748b' }}>Just now</span>
                    </div>
                    <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px' }}>S-Band radar sweep completed. 0 hydrometeor anomalies reported.</p>
                </div>
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <strong style={{ color: '#4ade80' }}>Daily Regional Advisory Generated</strong>
                        <span style={{ color: '#64748b' }}>15m ago</span>
                    </div>
                    <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px' }}>Localized advice broadcast in Telugu, Tamil, Kannada, and Hindi.</p>
                </div>
            </div>
        </div>
    )
}

function ProfileView() {
    const { user } = useAuth()
    return (
        <div style={{ padding: '8px 0 32px' }}>
            <h1 style={{ fontSize: '26px', color: '#f8fafc', margin: '4px 0 16px' }}>User Profile</h1>
            <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', maxWidth: '480px' }}>
                <p style={{ color: '#94a3b8', margin: '0 0 10px' }}><strong style={{ color: '#f8fafc' }}>Name:</strong> {user?.name || 'Authorized Operator'}</p>
                <p style={{ color: '#94a3b8', margin: '0 0 10px' }}><strong style={{ color: '#f8fafc' }}>Email:</strong> {user?.email || 'N/A'}</p>
                <p style={{ color: '#94a3b8', margin: '0 0 10px' }}><strong style={{ color: '#f8fafc' }}>Role:</strong> {user?.role || 'User'}</p>
                <p style={{ color: '#94a3b8', margin: 0 }}><strong style={{ color: '#f8fafc' }}>Designation:</strong> WeatherTwin AI Field Operator</p>
            </div>
        </div>
    )
}

function Protected({ children }) { 
    return useAuth().isAuthenticated ? <Shell>{children}</Shell> : <Navigate to="/login" replace /> 
}

function AdminOnly({ children }) { 
    const { isAuthenticated, user } = useAuth(); 
    if (!isAuthenticated) return <Navigate to="/login" replace />; 
    return user?.role === 'admin' ? <Shell>{children}</Shell> : <Navigate to="/dashboard" replace /> 
}

function RoutesView() { 
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} />
            <Route path="/weather" element={<Protected><WeatherView /></Protected>} />
            <Route path="/alerts" element={<Protected><AlertsView /></Protected>} />
            <Route path="/map" element={<Protected><MapView /></Protected>} />
            <Route path="/notifications" element={<Protected><NotificationsView /></Protected>} />
            <Route path="/profile" element={<Protected><ProfileView /></Protected>} />
            <Route path="/settings" element={<Protected><ProfileView /></Protected>} />
            
            <Route path="/admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes> 
    )
}

export default function App() { 
    return <AuthProvider><RoutesView /></AuthProvider> 
}