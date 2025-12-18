import { defineEventHandler, readBody } from 'h3'
import { requireValidSession } from '~/server/utils/auth'

/**
 * POST /api/protected/sensitive
 * 
 * Example: Sensitive operation that validates session with Keycloak in real-time
 * Use this for critical operations (payments, account changes, etc.)
 * 
 * This ensures the user hasn't been logged out from another device
 */
export default defineEventHandler(async (event) => {
  // This validates the token with Keycloak server (slower but more secure)
  // Will throw 401 if session was terminated from another device
  const user = await requireValidSession(event)

  const body = await readBody(event)

  // Perform your sensitive operation here
  console.log(`Sensitive operation by user: ${user.email}`, body)

  return {
    success: true,
    message: 'Sensitive operation completed',
    performedBy: user.email,
    timestamp: new Date().toISOString()
  }
})
