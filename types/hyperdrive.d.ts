/**
 * The only property Cloudflare injects for PostgreSQL over Hyperdrive
 */
export interface Hyperdrive {
  /** Connection string, e.g. "postgres://…?token=…" */
  connectionString: string
}

// Augment the global Env interface that Workers use
declare global {
  interface Env {
    /** The binding name you chose in wrangler.toml */
    HYPERDRIVE: Hyperdrive
  }
}
