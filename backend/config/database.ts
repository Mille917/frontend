import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: env.get('DATABASE_URL')
        ? {
            connectionString: env.get('DATABASE_URL'),
            ssl:
              env.get('DATABASE_URL')?.includes('neon.tech') || env.get('NODE_ENV') === 'production'
                ? { rejectUnauthorized: false }
                : false,
          }
        : {
            host: env.get('DB_HOST'),
            port: env.get('DB_PORT'),
            user: env.get('DB_USER'),
            password: env.get('DB_PASSWORD'),
            database: env.get('DB_DATABASE'),
            ssl:
              env.get('NODE_ENV') === 'production' ||
              env.get('DB_HOST')?.includes('neon.tech') ||
              env.get('DB_HOST')?.includes('render.com')
                ? { rejectUnauthorized: false }
                : false,
          },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})
// Temporary debug: log which DB connection is selected (avoid printing sensitive data)
try {
  if (env.get('DATABASE_URL')) {
    const dbUrl = env.get('DATABASE_URL') as string
    const hostMatch = dbUrl.match(/@([^:/?#]+)(?::|\/|$)/)
    const host = hostMatch ? hostMatch[1] : 'unknown'
    console.info('Using DATABASE_URL, db host:', host)
  } else {
    console.info('Using DB_HOST config, host:', env.get('DB_HOST'))
  }
} catch (e) {
  console.warn('Error while logging DB config debug info', e)
}

export default dbConfig
