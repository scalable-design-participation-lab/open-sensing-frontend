// utils/getDb.ts
import { useRuntimeConfig } from '#imports'
import type { Sql } from 'postgres'

let sqlClient: Sql | null = null

export default async function getDb(): Promise<Sql> {
  if (sqlClient) return sqlClient

  // dynamically load postgres at runtime
  const postgresMod = await import('postgres')
  const postgres: typeof postgresMod.default = postgresMod.default

  const config = useRuntimeConfig()
  sqlClient = postgres({
    host: config.dbHost,
    port: Number(config.dbPort),
    database: config.dbName,
    username: config.dbUser,
    password: config.dbPassword,
    ssl: !!config.dbSsl,
    // you can add pool here, etc.
  })

  // verify connectivity once (optional)
  try {
    await sqlClient`SELECT 1`
  } catch (err) {
    console.error('Postgres connection failed:', err)
  }

  return sqlClient
}
