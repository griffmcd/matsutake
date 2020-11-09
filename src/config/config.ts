export default {
  cookieProps: Object.freeze({
    key: 'ExpressGeneratorTs',
    secret: process.env.COOKIE_SECRET,
    options: {
      httpOnly: true,
      signed: true,
      path: (process.env.COOKIE_PATH),
      maxAge: Number(process.env.COOKIE_EXP),
      domain: (process.env.COOKIE_DOMAIN),
      secure: (process.env.SECURE_COOKIE === 'true'),
    },
  }),
  jwtSecret: process.env.JWT_SECRET || '',
  dirName: process.env.DIR_NAME || './src',
  ext: process.env.EXT || '.ts',
  dbPort: process.env.DB_PORT || 5432,
};
