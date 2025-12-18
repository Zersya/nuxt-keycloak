import { defineEventHandler } from 'h3'
import { requireValidSession } from '~/server/utils/auth'

/**
 * GET /api/protected/profile
 * 
 * Example of a protected API endpoint
 * Validates session with Keycloak (ensures cross-domain logout is respected)
 */
export default defineEventHandler(async (event) => {
  // Validate session with Keycloak server (ensures cross-domain logout works)
  const user = await requireValidSession(event)

  return {
    success: true,
    user: {
      id: user.sub,
      email: user.email,
      name: user.name || user.preferred_username,
    }
  }
})
