import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginRequest } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('vargminds_token'))
	const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('vargminds_user') || 'null'))

	useEffect(() => {
		if (token) localStorage.setItem('vargminds_token', token)
		else localStorage.removeItem('vargminds_token')
	}, [token])

	const signIn = async (credentials) => {
		const response = await loginRequest(credentials)
		const nextToken = response.data?.access_token || response.data?.token
		if (!nextToken) throw new Error('The server did not return an access token.')
		const nextUser = response.data?.user || { email: credentials.email, name: 'Weather member', role: 'user' }
		setToken(nextToken); setUser(nextUser); localStorage.setItem('vargminds_user', JSON.stringify(nextUser))
		return nextUser
	}

	const signOut = () => { setToken(null); setUser(null); localStorage.removeItem('vargminds_user') }
	return <AuthContext.Provider value={{ token, user, isAuthenticated: Boolean(token), signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
