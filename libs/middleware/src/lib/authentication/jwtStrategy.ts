import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

export default passport.use(new Strategy(options, async (payload, done) => {
    try {
        return done(null, payload.user)
    } catch (e) {
        done(e)
    }
}))