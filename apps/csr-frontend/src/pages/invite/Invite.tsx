import { useEffect } from 'react';
import { NoFlexBox, Button, InviteLinks, Title1, Title3 } from '@whosaidtrue/ui';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAccessCode, setGameStatus, selectIsHost, selectPlayerStatus, clearGame, clearHost, selectGameId, endGameFromApi, endGame } from '../../features';
import { useHistory } from "react-router";


const Invite: React.FC = () => {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const isHost = useAppSelector(selectIsHost)
    const status = useAppSelector(selectPlayerStatus)
    const gameId = useAppSelector(selectGameId)

    // this page should only be accessed by users that
    // have just successfully created a game.
    useEffect(() => {
        if (!isHost || !(status === 'gameCreateSuccess')) {
            history.push('/')
        }

        // show confirmation dialog and clear game state if confirmed
        // eslint-disable-next-line
        const unblock = history.block((...args: any[]) => {

            // DEV_NOTE: react-router-dom's type definitions are incorrect at the moment, so any type
            // has to be used here to prevent compiler errors
            // args[0] is a location object, and args[1] is a navigation action type

            // eslint-disable-next-line
            const path = args[0].pathname as any
            if (!path.includes('/game/')) {
                const confirmMessage = 'Are you sure you want to leave? If you leave now the game will be cancelled';

                if (window.confirm(confirmMessage)) {
                    dispatch(clearGame());
                    dispatch(clearHost());
                    dispatch(endGameFromApi(gameId))
                    return true;
                }

                return false
            }
            return true
        })


        return () => {
            unblock();
        }
    }, [dispatch, history, isHost, status, gameId])



    const accessCode = useAppSelector(selectAccessCode)

    const goToChooseName = () => {
        history.push(`/game/${accessCode}`)
        dispatch(setGameStatus('choosingName'));
    }

    const isForSchools = process.env.NX_IS_FOR_SCHOOLS === 'true';
    const domain = isForSchools ? 'whosaidtrueforschools.com/game' : 'whosaidtrue.com/game';
    const titleDomain = isForSchools ? 'WhoSaidTrueForSchools.com' : 'WhoSaidTrue.com';

    return (
        <NoFlexBox className="md:w-max mx-2 md:mx-auto text-basic-black text-center pb-16">

            <Title1 className="mb-8">Invite Players</Title1>
            <Title3 className="mb-8">Tell Players to Enter Game Code at {titleDomain}</Title3>
            <InviteLinks domain={domain} accessCode={accessCode}>
                <Button type="button" onClick={goToChooseName} >Next: Choose Your Player Name</Button>
            </InviteLinks>
        </NoFlexBox>
    )
}

export default Invite