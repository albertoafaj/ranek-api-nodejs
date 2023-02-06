require('dotenv').config();

module.exports = {
  test: {
    client: 'pg',
    version: '15.1',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_TEST,
    },
    migrations: { directory: 'src/migrations' },
  },
};
