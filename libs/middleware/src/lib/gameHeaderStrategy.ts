import { ExtractJwt, Strategy } from 'passport-jwt';

const options = {
    jwtFromRequest: ExtractJwt.fromHeader('wst-game-token'),
    secretOrKey: process.env.JWT_SECRET,
    name: 'game-header'
};

export default new Strategy(options, async (payload, done) => {

    try {
        // yes, payload could just be sent through.
        // This is made explicit for documentation purposes.
        const requestData = {
            playerId: payload.playerId,
            playerName: payload.playerName,
            userId: payload.userId,
            gameId: payload.gameId,
            isHost: payload.isHost
        }
        return done(null, requestData)
    } catch (e) {
        done(e)
    }
})