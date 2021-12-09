import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ScoreboardEntry } from '@whosaidtrue/app-interfaces';
import { IoMdArrowRoundUp } from '@react-icons/all-files/io/IoMdArrowRoundUp';
import { IoMdArrowRoundDown } from '@react-icons/all-files/io/IoMdArrowRoundDown';
import Button from '../../button/Button';

export interface ScoreboardProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  currentPlayerScore: ScoreboardEntry;
  scores: ScoreboardEntry[];
  showAll?: boolean;
}

interface RankChangeProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  difference: number;
}

interface ScoreEntryProps extends React.HtmlHTMLAttributes<HTMLLIElement> {
  currentPlayerScore: ScoreboardEntry;
  score: ScoreboardEntry;
}

const RankChange: React.FC<RankChangeProps> = ({ difference }) => {
  const direction = difference > 0 ? 'up' : 'down';
  const className = classNames(
    'flex items-center border font-bold ml-2 pl-2 pr-2.5 rounded-full text-base',
    {
      'bg-green-subtle-fill border-green-subtle-stroke text-green-base':
        direction === 'up',
      'bg-red-subtle-fill border-red-subtle-stroke text-red-base':
        direction === 'down',
    }
  );

  if (difference === 0) {
    return null;
  }

  return (
    <div className={className}>
      {direction === 'up' ? <IoMdArrowRoundUp /> : <IoMdArrowRoundDown />}
      <span>{Math.abs(difference)}</span>
    </div>
  );
};

const ScoreEntry: React.FC<ScoreEntryProps> = ({
  currentPlayerScore,
  score,
}) => {
  const isCurrentPlayer = (score: ScoreboardEntry) => {
    return (
      currentPlayerScore && score.player_name === currentPlayerScore.player_name
    );
  };

  const className = classNames(
    'flex items-center justify-between font-bold px-6 py-2 text-basic-black text-md text-center sm:text-lg',
    {
      'bg-yellow-base': isCurrentPlayer(score),
    }
  );

  return (
    <li className={className}>
      <span>{score.rank}</span>
      <span className="relative flex flex-col items-center sm:flex-row">
        {isCurrentPlayer(score)
          ? `${score.player_name} (You)`
          : score.player_name}{' '}
        <RankChange difference={score.rankDifference} />
      </span>
      <span>{score.score.toLocaleString('en-US')}</span>
    </li>
  );
};

const Scoreboard: React.FC<ScoreboardProps> = ({
  currentPlayerScore,
  scores,
  showAll: showAllDefault = false,
}) => {
  const RANK_CAP = 5;

  const [showAll, setShowAll] = useState(showAllDefault);
  const [filteredScores, setFilteredScores] = useState<ScoreboardEntry[]>([]);

  useEffect(() => {
    setFilteredScores(scores.filter((x) => (showAll ? x : x.rank <= RANK_CAP)));
  }, [scores, showAll]);

  return (
    <div className="bg-purple-subtle-fill p-3 rounded-3xl w-full">
      <ul className="bg-purple-card-bg border border-purple-subtle-stroke divide-y divide-purple-subtle-stroke shadow-sm rounded-2xl overflow-hidden">
        {filteredScores.length > 0 &&
          filteredScores.map((score, i) => (
            <ScoreEntry
              currentPlayerScore={currentPlayerScore}
              score={score}
              key={i}
            />
          ))}
      </ul>

      {scores.length > filteredScores.length && !showAll && (
        <div className="mt-3 text-center">
          <Button
            buttonStyle="inline"
            $secondary
            onClick={() => setShowAll(true)}
          >
            Show All
          </Button>
        </div>
      )}

      {!showAll &&
        currentPlayerScore &&
        currentPlayerScore.rank &&
        currentPlayerScore.rank > RANK_CAP && (
          <ul className="border-purple-subtle-stroke mt-3 shadow-sm rounded-2xl overflow-hidden">
            <ScoreEntry
              currentPlayerScore={currentPlayerScore}
              score={currentPlayerScore}
            />
          </ul>
        )}
    </div>
  );
};

export default Scoreboard;
