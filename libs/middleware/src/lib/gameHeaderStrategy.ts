import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';

const options = {
    jwtFromRequest: ExtractJwt.fromHeader('wst-game-token'),
    secretOrKey: process.env.JWT_SECRET
};

export default passport.use(new Strategy(options, async (payload, done) => {

    try {
        // yes, payload could just be sent through.
        // This is made explicit for documentation purposes.
        const requestData = {
            player_id: payload.player_id,
            player_name: payload.player_name,
            user_id: payload.user_id,
            game_id: payload.game_id
        }
        return done(null, requestData)
    } catch (e) {
        done(e)
    }
}))