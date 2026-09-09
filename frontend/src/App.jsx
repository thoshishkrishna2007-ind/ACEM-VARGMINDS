import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { Bell, CloudSun, Gauge, LogOut, Map, Settings, ShieldAlert, UserRound, Wind } from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

function Sidebar() {
	const links = [
		['/dashboard', 'Dashboard', Gauge], ['/weather', 'Weather', CloudSun], ['/alerts', 'Alerts', ShieldAlert],
		['/notifications', 'Notifications', Bell], ['/map', 'Weather map', Map], ['/profile', 'Profile', UserRound], ['/settings', 'Settings', Settings],
	]
	return <aside className="sidebar"><p className="nav-label">Workspace</p>{links.map(([to, label, Icon]) => <NavLink className="nav-link" to={to} key={to}><Icon size={17} />{label}</NavLink>)}</aside>
}

function Topbar() {
	const { user, signOut } = useAuth(); const navigate = useNavigate()
	return <header className="topbar"><NavLink to="/dashboard" className="brand"><span className="brand-mark"><Wind size={19} /></span>VargMinds</NavLink><div className="top-actions"><button className="icon-button" aria-label="Notifications" onClick={() => navigate('/notifications')}><Bell size={18} /></button><span className="avatar">{(user?.name || user?.email || 'W').slice(0, 1).toUpperCase()}</span><button className="icon-button" aria-label="Sign out" onClick={() => { signOut(); navigate('/login') }}><LogOut size={17} /></button></div></header>
}

function Shell({ children }) { return <div className="app-shell"><Topbar /><div className="layout"><Sidebar /><main className="main">{children}</main></div></div> }
function Protected({ children }) { const { isAuthenticated } = useAuth(); return isAuthenticated ? <Shell>{children}</Shell> : <Navigate to="/login" replace /> }
function AdminOnly({ children }) { const { isAuthenticated, user } = useAuth(); if (!isAuthenticated) return <Navigate to="/login" replace />; return user?.role === 'admin' ? <Shell>{children}</Shell> : <Navigate to="/dashboard" replace /> }
function Placeholder({ title }) { return <><span className="eyebrow">VargMinds intelligence</span><h1>{title}</h1><div className="panel panel-pad"><p className="muted">This workspace is ready for the connected {title.toLowerCase()} service.</p></div></> }

function AppRoutes() {
	return <Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} /><Route path="/admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} /><Route path="/weather" element={<Protected><Placeholder title="Weather" /></Protected>} /><Route path="/alerts" element={<Protected><Placeholder title="Alerts" /></Protected>} /><Route path="/notifications" element={<Protected><Placeholder title="Notifications" /></Protected>} /><Route path="/map" element={<Protected><Placeholder title="Weather map" /></Protected>} /><Route path="/profile" element={<Protected><Placeholder title="Profile" /></Protected>} /><Route path="/settings" element={<Protected><Placeholder title="Settings" /></Protected>} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes>
}

export default function App() { return <AuthProvider><AppRoutes /></AuthProvider> }
