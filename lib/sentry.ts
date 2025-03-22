import * as Sentry from "@sentry/nextjs"

// Only initialize Sentry if DSN is available
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  })
} else {
  console.warn('Sentry DSN not found. Sentry error tracking is disabled.')
}

export default Sentry

