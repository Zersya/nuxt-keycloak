import { ref, computed } from 'vue'

export const useAuth = () => {
	const user = ref(null)
	const loading = ref(true)
	const sessionValid = ref(false)

	const isAuthenticated = computed(() => !!user.value && sessionValid.value)

	const fetchUser = async () => {
		try {
			loading.value = true
			const response = await $fetch('/api/auth/user')
			user.value = response.user
			sessionValid.value = true
		} catch (error) {
			user.value = null
			sessionValid.value = false
		} finally {
			loading.value = false
		}
	}

	const validateSession = async () => {
		try {
			const response = await $fetch('/api/auth/validate')
			if (response.valid) {
				user.value = response.user
				sessionValid.value = true
				return true
			}
			user.value = null
			sessionValid.value = false
			return false
		} catch (error) {
			user.value = null
			sessionValid.value = false
			return false
		}
	}

	// Fetch user data on composable creation
	fetchUser()

	return {
		user,
		loading,
		isAuthenticated,
		sessionValid,
		fetchUser,
		validateSession
	}
}