import jwt from 'jwt-decode';
import { TokenPayload } from '@whosaidtrue/api-interfaces';
import { PlayerScore, ScoreMap } from '@whosaidtrue/app-interfaces';

// This just makes it so the type doesn't have to be re-specified every time
export function decodeUserToken(token: string): { user: TokenPayload } {
    return jwt(token)
}

export function buildScoreboardAndMap(scores: string[], rankDifferences: Record<string, string>): [ScoreMap, PlayerScore[]] {
    const scoreMap: ScoreMap = {}; // save scores/ranks by name
    const scoreboard: PlayerScore[] = [];

    let rank = 1;
    scores.forEach((item, index) => {
        if (index % 2 !== 0) {
            const name = scores[index - 1];
            const prevScore = Number(scores[index - 2]);

            if (!isNaN(prevScore) && prevScore > Number(item)) {
                rank++; // don't increase rank if scores equal
            }

            scoreMap[name] = {
                rank: rank,
                points: Number(item),
                rankDiff: Number(rankDifferences[name]),
                name
            };

            // add top 5, and all tied with top 5
            if (scoreboard.length < 5) {
                scoreboard.push(scoreMap[name]);
            } else if (scoreboard[scoreboard.length - 1] && scoreboard[scoreboard.length - 1].points === Number(item)) {
                scoreboard.push(scoreMap[name]);
            }

        }
    });

    return [scoreMap, scoreboard]
}