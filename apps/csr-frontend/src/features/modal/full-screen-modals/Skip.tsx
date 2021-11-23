import { useEffect } from 'react';
import { SkipToResults, SkipToResultsPlayerRow } from "@whosaidtrue/ui";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectHaveNotAnswered } from "../../question/questionSlice";
import { types, payloads } from '@whosaidtrue/api-interfaces';
import { setFullModal, showError } from '../modalSlice';
import { selectGamequestionId, currentScreen } from '../../question/questionSlice';
import { selectPlayerId } from '../../game/gameSlice';
import useSocket from '../../socket/useSocket';

/**
 * Confirmation modal for skipping to game/question results.
 */
const Skip: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sendMessage } = useSocket();
    const haveNotAnswered = useAppSelector(selectHaveNotAnswered);
    const gameQuestionId = useAppSelector(selectGamequestionId);
    const screen = useAppSelector(currentScreen);

    useEffect(() => {
        // if the last player answers, or the host isn't in the waiting room for some reason
        // close the modal. If the host is in the waiting room, then you know they have answered
        // and you doon't need to filter them out from the player list
        if (!haveNotAnswered || !haveNotAnswered.length || screen !== 'waitingRoom') {
            dispatch(setFullModal(''));
        }

    }, [
        haveNotAnswered,
        dispatch,
        screen
    ]);

    const confirm = () => {
        sendMessage(types.MOVE_TO_ANSWER, { gameQuestionId } as payloads.QuestionSkip, (ack) => {
            if (ack === 'error') {
                dispatch(showError('Oops, something went wrong...'));
            } else {
                dispatch(setFullModal(''));
            }
        })
    }

    const handlerFactory = (id: number, player_name: string) => {
        return () => {
            sendMessage(types.REMOVE_PLAYER, { id, player_name } as payloads.PlayerEvent);
        }
    }

    const cancel = () => {
        dispatch(setFullModal(''));
    }

    const playerList = haveNotAnswered.map((player, index) => {
        return (
            <SkipToResultsPlayerRow
                key={index}
                playerName={player.player_name}
                playerId={player.id}
                handlerFactory={handlerFactory} />
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