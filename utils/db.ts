// utils/getDb.ts
import postgres, { Sql } from 'postgres'
import { useRuntimeConfig } from '#imports'

let sqlClient: Sql | null = null

export default function getDb(): Sql {
  if (sqlClient) return sqlClient

  // 1️⃣ Are we in a CF Worker with Hyperdrive?
  const hyper = (globalThis as any).env?.HYPERDRIVE

  // 2️⃣ Choose the right connection string:
  //    – Worker: use the injected hyper.connectionString
  //    – Local/SSR: use your own NUXT_POSTGRES_URL env var
  const connectionString = hyper
    ? hyper.connectionString
    : useRuntimeConfig().dbURL

  sqlClient = postgres(connectionString, {
    max: 5,
    fetch_types: false,
  })

  // fire‐and‐forget a health check
  sqlClient`SELECT 1`.catch((err) =>
    console.error('Postgres health check failed:', err)
  )

  return sqlClient
}
