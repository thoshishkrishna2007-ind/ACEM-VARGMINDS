import { Bell, CloudSun, Gauge, LogOut, Map, Settings, ShieldAlert, UserRound, Wind } from 'lucide-react'
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

function Shell({ children }) {
	const { user, signOut } = useAuth(); const navigate = useNavigate()
	const links = [['/dashboard', 'Dashboard', Gauge], ['/weather', 'Weather', CloudSun], ['/alerts', 'Alerts', ShieldAlert], ['/notifications', 'Notifications', Bell], ['/map', 'Map', Map], ['/profile', 'Profile', UserRound], ['/settings', 'Settings', Settings]]
	return <><header className="topbar"><NavLink className="brand" to="/dashboard"><span className="brand-mark"><Wind size={18} /></span>VargMinds</NavLink><div className="top-actions"><button className="icon-button" onClick={() => navigate('/notifications')} aria-label="Notifications"><Bell size={17} /></button><span className="avatar">{(user?.name || 'U')[0]}</span><button className="icon-button" onClick={() => { signOut(); navigate('/login') }} aria-label="Sign out"><LogOut size={17} /></button></div></header><div className="layout"><aside className="sidebar">{links.map(([path, label, Icon]) => <NavLink className="nav-link" to={path} key={path}><Icon size={16} /> {label}</NavLink>)}</aside><main className="main">{children}</main></div></>
}
function Protected({ children }) { return useAuth().isAuthenticated ? <Shell>{children}</Shell> : <Navigate to="/login" replace /> }
function AdminOnly({ children }) { const { isAuthenticated, user } = useAuth(); if (!isAuthenticated) return <Navigate to="/login" replace />; return user?.role === 'admin' ? <Shell>{children}</Shell> : <Navigate to="/dashboard" replace /> }
function Placeholder({ title }) { return <><span className="eyebrow">VargMinds</span><h1>{title}</h1><div className="panel"><p className="muted">This module will use the connected backend data.</p></div></> }
function RoutesView() { return <Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} /><Route path="/admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} /><Route path="/weather" element={<Protected><Placeholder title="Weather" /></Protected>} /><Route path="/alerts" element={<Protected><Placeholder title="Alerts" /></Protected>} /><Route path="/notifications" element={<Protected><Placeholder title="Notifications" /></Protected>} /><Route path="/map" element={<Protected><Placeholder title="Weather map" /></Protected>} /><Route path="/profile" element={<Protected><Placeholder title="Profile" /></Protected>} /><Route path="/settings" element={<Protected><Placeholder title="Settings" /></Protected>} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes> }
export default function App() { return <AuthProvider><RoutesView /></AuthProvider> }
