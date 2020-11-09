export default {
  jwtSecret: process.env.JWT_SECRET || '',
  dirName: process.env.DIR_NAME || './src',
  ext: process.env.EXT || '.ts',
  dbPort: process.env.DB_PORT || 5432,
};
