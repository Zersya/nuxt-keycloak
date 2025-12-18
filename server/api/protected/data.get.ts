import { defineEventHandler } from 'h3'
import { requireAuth, getAccessToken } from '~/server/utils/auth'

/**
 * GET /api/protected/data
 * 
 * Example: Fetch data from an external API using the user's access token
 * The access token can be used to call other services that trust the same Keycloak
 */
export default defineEventHandler(async (event) => {
  // Require authentication
  const session = requireAuth(event)
  
  // Get access token to call other services
  const accessToken = getAccessToken(event)

  // Example: You could call another microservice with the token
  // const externalData = await $fetch('https://api.example.com/data', {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`
  //   }
  // })

  return {
    success: true,
    message: 'This is protected data',
    user: session.user.preferred_username || session.user.email,
    // Include access token info (for demo purposes - don't expose in production)
    tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : null,
    data: [
      { id: 1, name: 'Sample Item 1' },
      { id: 2, name: 'Sample Item 2' },
      { id: 3, name: 'Sample Item 3' }
    ]
  }
})
