import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        // On active le SSL si on est en production ou si l'hôte est Neon/Render
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

export default dbConfig
