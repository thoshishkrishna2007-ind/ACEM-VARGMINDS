import { createContext, useContext, useState } from 'react'
import { login as loginRequest } from '../services/auth'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('vargminds_token'))
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('vargminds_user') || 'null'))
	const signIn = async (credentials) => { const response = await loginRequest(credentials); const nextToken = response.data.access_token; const nextUser = response.data.user; if (!nextToken) throw new Error('The server did not return an access token.'); setToken(nextToken); setUser(nextUser); localStorage.setItem('vargminds_token', nextToken); localStorage.setItem('vargminds_user', JSON.stringify(nextUser)); return nextUser }
	const signOut = () => { setToken(null); setUser(null); localStorage.removeItem('vargminds_token'); localStorage.removeItem('vargminds_user') }
	return <AuthContext.Provider value={{ token, user, isAuthenticated: Boolean(token), signIn, signOut }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
