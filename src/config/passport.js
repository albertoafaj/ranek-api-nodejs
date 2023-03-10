const passport = require('passport');
const passportJwt = require('passport-jwt');
require('dotenv').config();

const secret = process.env.JWTSEC;

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, async (payload, done) => {
    try {
      const users = await app.services.user.findOne(payload);
      if (users) return done(null, { id: users.id, email: users.email });
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
