export function useKeycloak() {
	const login = async () => {
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
		login,
		logout
	}
}