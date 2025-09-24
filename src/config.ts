export const API_BASE_URL: string =
  (import.meta as ImportMeta).env.VITE_API_BASE_URL ?? 'http://localhost:3000'
// Tip: configure VITE_API_BASE_URL in .env.development / .env.staging / .env.production
