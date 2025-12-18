import { defineEventHandler } from 'h3'
import { requireAuth } from '~/server/utils/auth'

/**
 * GET /api/protected/profile
 * 
 * Example of a protected API endpoint
 * Uses local session validation (fast, no Keycloak request)
 */
export default defineEventHandler(async (event) => {
  // This will throw 401 if not authenticated
  const session = requireAuth(event)

  return {
    success: true,
    user: {
      id: session.user.sub,
      email: session.user.email,
      name: session.user.name || session.user.preferred_username,
      // Add any other user fields you need
    }
  }
})
