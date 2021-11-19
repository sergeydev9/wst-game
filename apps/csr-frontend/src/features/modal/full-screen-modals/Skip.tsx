import { useEffect } from 'react';
import { SkipToResults, SkipToResultsPlayerRow } from "@whosaidtrue/ui";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectHaveNotAnswered } from "../../question/questionSlice";
import { setFullModal } from '../modalSlice';

/**
 * Confirmation modal for skipping to game/question results.
 */
const Skip: React.FC = () => {
    const dispatch = useAppDispatch()
    const haveNotAnswered = useAppSelector(selectHaveNotAnswered);


    useEffect(() => {
        // if the last player answers, close the modal
        if (!haveNotAnswered.length) {
            dispatch(setFullModal(''))
        }

    }, [haveNotAnswered, dispatch])


    const confirm = () => {
        console.log('confirm');
    }

    const cancel = () => {
        dispatch(setFullModal(''))
    }

    const playerList = haveNotAnswered.map((player, index) => {
        return (
            <SkipToResultsPlayerRow
                key={index}
                playerName={player.player_name}
                playerId={player.id}
                handlerFactory={(id) => () => console.log(id)} />
        )
    });

    return (
        <SkipToResults
            numHaveNotAnswered={haveNotAnswered.length}
            confirm={confirm}
            cancel={cancel}>
            {playerList}
        </SkipToResults>
    )
}

export default Skip;