module.exports = {
  test: {
    client: 'pg',
    version: '15.1',
    connection: {
      host: process.env.RANEK_HOST,
      user: process.env.RANEK_USER,
      password: process.env.RANEK_PASS,
      database: process.env.RANEK_DB_TEST,
    },
    migrations: { directory: 'src/migrations' },
  },
};
