import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	
	if (config.public.keycloakDisabled === 'true') {
		throw createError({
			statusCode: 400,
			message: 'Keycloak authentication is disabled'
		})
	}
	
	const keycloakBaseUrl = config.public.keycloakUrl.endsWith('/') 
		? config.public.keycloakUrl 
		: `${config.public.keycloakUrl}/`
	const realm = config.public.keycloakRealm
	const clientId = config.public.keycloakClientId
	const redirectUri = `${config.public.baseUrl}api/auth/keycloak/callback`
	
	const authUrl = new URL(`${keycloakBaseUrl}realms/${realm}/protocol/openid-connect/auth`)
	
	authUrl.searchParams.append('client_id', clientId)
	authUrl.searchParams.append('response_type', 'code')
	authUrl.searchParams.append('scope', 'openid profile email')
	authUrl.searchParams.append('redirect_uri', redirectUri)
	
	const state = Math.random().toString(36).substring(7)
	authUrl.searchParams.append('state', state)
	
	console.log('Authorization URL generated:', {
		url: authUrl.toString(),
		clientId,
		redirectUri,
		realm
	})
	
	return { url: authUrl.toString() }
})

