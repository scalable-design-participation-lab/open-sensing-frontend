import type { Sql } from 'postgres'
import { useRuntimeConfig } from '#imports'
import postgres from 'postgres'

let sqlClient: Sql | null = null

export default async function getDb(): Promise<Sql> {
  if (sqlClient) return sqlClient

  // On Workers, Hyperdrive binding is injected
  if (typeof globalThis.HYPERDRIVE !== 'undefined') {
    sqlClient = postgres(globalThis.HYPERDRIVE.connectionString, {
      max: 5,
      fetch_types: false,
    })
  } else {
    // Local / non‑Workers fallback: use direct GCP Cloud SQL URL
    const { dbURL } = useRuntimeConfig()
    sqlClient = postgres(dbURL)
  }

  // Optional health check
  try {
    await sqlClient`SELECT 1`
  } catch (e) {
    console.error('DB check failed:', e)
  }
  return sqlClient
}
