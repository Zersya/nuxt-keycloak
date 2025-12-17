interface LoginCredentials {
	email: string
	password: string
}

interface LoginResponse {
	success: boolean
	user: any
}

export function useKeycloak() {
	const loginWithCredentials = async (credentials: LoginCredentials): Promise<LoginResponse> => {
		try {
			const response = await $fetch<LoginResponse>('/api/auth/login', {
				method: 'POST',
				body: credentials
			})
			return response
		} catch (error: any) {
			console.error('Failed to login:', error)
			throw error
		}
	}

	const loginWithRedirect = async () => {
		try {
			const response = await $fetch('/api/login')
			if (response.url) {
				window.location.href = response.url
			}
		} catch (error) {
			console.error('Failed to initiate Keycloak login:', error)
			throw error
		}
	}

	const logout = async () => {
		try {
			const response = await $fetch('/api/logout')
			if (response.url) {
				window.location.href = response.url
			}
		} catch (error) {
			console.error('Failed to logout:', error)
			throw error
		}
	}

	return {
		loginWithCredentials,
		loginWithRedirect,
		logout
	}
}