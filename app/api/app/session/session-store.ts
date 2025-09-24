// app/api/app/session/session-store.ts

export interface SessionData {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  subscription: string
  dashboardUrl: string
  createdAt: string
  expiresAt: string
}

// Shared session storage
export const sessions = new Map<string, SessionData>()

export function cleanupExpiredSessions() {
  const now = new Date()
  for (const [token, session] of sessions.entries()) {
    if (new Date(session.expiresAt) < now) {
      sessions.delete(token)
    }
  }
}