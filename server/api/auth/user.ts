import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
	const userCookie = getCookie(event, 'auth_user')
	const tokensCookie = getCookie(event, 'auth_tokens')

	if (!userCookie || !tokensCookie) {
		throw createError({
			statusCode: 401,
			message: 'Not authenticated'
		})
	}

	try {
		const user = JSON.parse(userCookie)
		const tokens = JSON.parse(tokensCookie)

		return {
			user,
			...tokens
		}
	} catch (error) {
		throw createError({
			statusCode: 401,
			message: 'Invalid session data'
		})
	}
})