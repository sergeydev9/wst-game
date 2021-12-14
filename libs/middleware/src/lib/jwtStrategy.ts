import passport from 'passport';
import { Strategy as AnonymousStrategy } from 'passport-anonymous';
import { ExtractJwt, Strategy } from 'passport-jwt';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new AnonymousStrategy());

export default passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      return done(null, payload.user);
    } catch (e) {
      done(e);
    }
  })
);
