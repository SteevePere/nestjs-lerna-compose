module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
};
