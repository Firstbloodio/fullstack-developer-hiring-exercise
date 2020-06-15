/**
 * Taken from https://github.com/ambroiseRabier/typeorm-nestjs-migration-example
 */

import { ConnectionOptions } from 'typeorm';

const environment = process.env.NODE_ENV || 'development';

const DATABASES = {
  development: 'local_db',
  testing: 'local_db_test',
}

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 54320,
  username: 'local_dev',
  password: 'local_dev',
  database: DATABASES[environment],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],

  // We are using migrations for dev and production servers
  synchronize: environment === 'testing',

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,

  // Echo queries to console?
  logging: environment === 'testing',
  // logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '../migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

export = config;