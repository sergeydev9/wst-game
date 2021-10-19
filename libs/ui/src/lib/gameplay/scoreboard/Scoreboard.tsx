import { useMemo, useCallback } from 'react';
import tw from 'tailwind-styled-components';
import { PlayerScore } from '@whosaidtrue/app-interfaces';
import { RiArrowUpLine } from '@react-icons/all-files/ri/RiArrowUpLine';
import { RiArrowDownLine } from '@react-icons/all-files/ri/RiArrowDownLine';



export interface ScoreBoardProps {
    scores: PlayerScore[];
    showDiff?: boolean;
    currentPlayerScore: PlayerScore
}

const diffStyleBase = tw.div`
border
px-2
rounded-full
ml-2
text-sm
sm:text-md
flex
flex-row
items-center
`

const RankUp = tw(diffStyleBase)`
bg-green-subtle-fill
border-green-subtle-stroke
text-green-base
`

const RankDown = tw(diffStyleBase)`
bg-red-subtle-fill
border-red-subtle-stroke
text-red-base
`

const scoreClass = "flex flex-row justify-between text-basic-black font-semibold text-md sm:text-lg text-center px-6 py-2 font-bold"


// DEV_NOTE: filter players before getting here.
const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, currentPlayerScore, showDiff }) => {

    // render a green or red outline depending
    // on whether diff is positive or negative
    const diffHelper = useCallback((diff: number) => {

        if (diff === 0) {
            return;
        } else if (diff > 0) {
            return <RankUp><RiArrowUpLine />{diff}</RankUp>
        } else {
            return <RankDown><RiArrowDownLine />{Math.abs(diff)}</RankDown>
        }

    }, [])


    // list of scores
    const list = useMemo(() => {


        return scores.map((p, i) => {
            return (
                <li key={i} className={`
                ${scoreClass}
                border-b
                border-purple-subtle-stroke
                `}>
                    <span>{p.rank}</span>
                    <span className="flex flex-col sm:flex-row  items-center">{p.name} {showDiff && diffHelper(p.rankDiff)}</span>
                    <span>{p.points.toLocaleString('en-US')}</span>
                </li>
            )
        })
    }, [scores, diffHelper, showDiff])

    return (
        <div className="bg-purple-subtle-fill rounded-3xl w-full p-1 sm:p-3 mb-5">
            <ul className='bg-purple-card-bg rounded-3xl border border-purple-subtle-stroke filter drop-shadow-subtle-stroke'>
                {list}
            </ul>
            <div className={`${scoreClass} bg-yellow-base filter drop-shadow-yellow-base rounded-3xl mt-4 mb-2`}>
                <span>{currentPlayerScore.rank}</span>
                <span className="flex flex-col sm:flex-row items-center">{currentPlayerScore.name} (You) {showDiff && diffHelper(currentPlayerScore.rankDiff)}</span>
                <span>{currentPlayerScore.points.toLocaleString('en-US')}</span>
            </div>
        </div>
    )
}

export default ScoreBoard