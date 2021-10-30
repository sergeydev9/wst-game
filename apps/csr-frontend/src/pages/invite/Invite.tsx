import { useEffect } from 'react';
import { NoFlexBox, Button, InviteLinks, Title1, Title3 } from '@whosaidtrue/ui';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAccessCode, setGameStatus, selectIsHost, selectPlayerStatus } from '../../features';
import { useHistory } from "react-router";


const Invite: React.FC = () => {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const isHost = useAppSelector(selectIsHost)
    const status = useAppSelector(selectPlayerStatus)

    // this page should only be accessed by users that
    // have just successfully created a game.
    useEffect(() => {
        if (!isHost || !(status === 'gameCreateSuccess')) {
            history.push('/')
        }
    }, [dispatch, history, isHost, status])

    const accessCode = useAppSelector(selectAccessCode)

    const goToChooseName = () => {
        history.push(`/x/${accessCode}`)
        dispatch(setGameStatus('choosingName'));
    }

    const isForSchools = process.env.NX_IS_FOR_SCHOOLS === 'true';
    const domain = isForSchools ? 'whosaidtrueforschools.com/x' : 'whosaidtrue.com/x';
    const titleDomain = isForSchools ? 'WhoSaidTrueForSchools.com' : 'WhoSaidTrue.com';

    return (
        <NoFlexBox className="md:w-max mx-2 md:mx-auto text-basic-black text-center pb-16">

            <Title1 className="mb-8">Invite Players</Title1>
            <Title3 className="mb-8">Tell Players to Enter Game Code at {titleDomain}</Title3>
            <InviteLinks domain={domain} accessCode={accessCode}>
                <Button type="button" onClick={goToChooseName} >Choose Your Player Name</Button>
            </InviteLinks>
        </NoFlexBox>
    )
}

export default Invite