import { ref, computed } from 'vue'

export const useAuth = () => {
	const user = ref(null)
	const loading = ref(true)

	const isAuthenticated = computed(() => !!user.value)

	const fetchUser = async () => {
		try {
			loading.value = true
			const response = await $fetch('/api/auth/user')
			user.value = response.user
		} catch (error) {
			user.value = null
		} finally {
			loading.value = false
		}
	}

	// Fetch user data on composable creation
	fetchUser()

	return {
		user,
		loading,
		isAuthenticated,
		fetchUser
	}
}