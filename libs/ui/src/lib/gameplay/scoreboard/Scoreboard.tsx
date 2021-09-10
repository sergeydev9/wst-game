import tw from 'tailwind-styled-components';
import { RiArrowUpLine } from '@react-icons/all-files/ri/RiArrowUpLine';
import { RiArrowDownLine } from '@react-icons/all-files/ri/RiArrowDownLine';


export interface PlayerScore {
    rank: number;
    name: string;
    points: number;
    rankDiff: number;
}

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

    const diffHelper = (diff: number) => {

        if (diff === 0) {
            return;
        } else if (diff > 0) {
            return <RankUp><RiArrowUpLine />{diff}</RankUp>
        } else {
            return <RankDown><RiArrowDownLine />{Math.abs(diff)}</RankDown>
        }

    }

    const listHelper = () => {
        const sorted = scores.sort((p1, p2) => p1.rank >= p2.rank ? 1 : -1)

        return sorted.map(p => {
            return (
                <li className={`
                ${scoreClass}
                border-b
                border-purple-subtle-stroke
                `}>
                    <span>{p.rank}</span>
                    <span className="flex flex-col sm:flex-row  items-center">{p.name} {diffHelper(p.rankDiff)}</span>
                    <span>{p.points.toLocaleString('en-US')}</span>
                </li>
            )
        })
    }
    return (
        <div className="bg-purple-subtle-fill rounded-3xl w-full p-1 sm:p-3">
            <ul className='bg-purple-card-bg rounded-3xl border border-purple-subtle-stroke filter drop-shadow-subtle-stroke'>
                {listHelper()}
            </ul>
            <div className={`${scoreClass} bg-yellow-base filter drop-shadow-yellow-base rounded-3xl mt-3 mb-8`}>
                <span>{currentPlayerScore.rank}</span>
                <span className="flex flex-col sm:flex-row items-center">{currentPlayerScore.name} (You) {diffHelper(currentPlayerScore.rankDiff)}</span>
                <span>{currentPlayerScore.points.toLocaleString('en-US')}</span>
            </div>
        </div>
    )
}

export default ScoreBoard