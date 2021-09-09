import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectNameRerolls,
    setRemainingNameOptions,
    setCurrentNameOptions,
    selectCurrentNameOptions,
    selectSeen,
    sendReport
} from './chooseNameSlice';
import { setGameStatus, clearGame, joinGame } from '../game/gameSlice';
import {
    Button,
    RerollNamesButton,
    Box,
    TextInput,
    Divider,
    Title3,
    Title1
} from '@whosaidtrue/ui';
import { NameObject } from '@whosaidtrue/app-interfaces';
import { NameRequestResponse, StatusRequestResponse } from '@whosaidtrue/api-interfaces';
import { api } from '../../api'
import { showError } from '../modal/modalSlice';

const ChooseName: React.FC = () => {
    const dispatch = useAppDispatch();
    const { access_code } = useParams<{ access_code: string }>()
    const history = useHistory();
    const names = useAppSelector(selectCurrentNameOptions);
    const rerolls = useAppSelector(selectNameRerolls);
    const seen = useAppSelector(selectSeen)

    // get a batch of 6 names when user first arrives
    useEffect(() => {
        dispatch(setGameStatus('choosingName'));

        // redirect if no access_code
        if (!access_code) {
            dispatch(showError('Access code not found'))
            history.push('/')
        }


        (async () => {
            // check game status
            try {
                const statusResponse = await api.get<StatusRequestResponse>(`/games/status?access_code=${access_code}`)
                dispatch(setGameStatus(statusResponse.status))
            } catch (e) {
                dispatch(showError('Could not find the game you were looking for'))
                dispatch(clearGame())
                history.push('/')
            }
            // get name options
            try {
                const response = await api.get<NameRequestResponse>('/names')
                dispatch(setRemainingNameOptions(response.data.names)) // populate total name pool
                dispatch(setCurrentNameOptions()) // set initial set of options and remove them from pool
            } catch (e) {
                history.push('/')
                dispatch(clearGame())
            }
        })()
    }, [dispatch, history, access_code])

    const join = async (name: string) => {

        api.post('/games/join', { access_code, name }).then(result => {
            dispatch(joinGame(result.data))
            history.push('/game')
        }).catch(e => {
            if (e.status === 401) {
                dispatch(showError('That name is no longer available. Please select another'))
            } else {
                dispatch(showError('An error occurred while attempting to join game'))
                history.push('/')
            }
        })
    }

    const chooseName = (nameObj: NameObject) => {
        dispatch(sendReport({ chosen: nameObj.id, seen: seen.map(n => n.id) }))
        return (e: React.MouseEvent) => {
            join(nameObj.name)
        }
    }

    const namesHelper = (names: NameObject[]) => {
        return names.map((nameObj, i) => {
            return (
                <Button key={i} buttonStyle="big-text" onClick={chooseName(nameObj)} type="button">{nameObj.name}</Button>
            )
        })
    }

    const rerollHandler = (e: React.MouseEvent) => {
        e.preventDefault()
        dispatch(setCurrentNameOptions());
    }

    return (
        <Box boxstyle='white' className="w-max mx-auto px-8 py-10">
            <Title1 className="text-basic-black mx-8">Choose Your Player Name</Title1>
            <div className="flex flex-col gap-3 w-80 mt-8">
                {namesHelper(names)}
                <div className="mt-4 flex justify-center">
                    <RerollNamesButton onClick={rerollHandler} rerolls={rerolls} />
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-10">
                <div className="w-full flex flex-shrink place-items-center gap-3 h-8 px-32">
                    <Divider dividerColor='grey' />
                    <Title3 >OR</Title3>
                    <Divider dividerColor='grey' />
                </div>
                <div className="flex w-full gap-3">
                    <TextInput $border type="text" className="font-semibold text-xl inline w-1/3" placeholder="Create your own" />
                    <Button className="w-2/3 inline" buttonStyle="big-text" $secondary>Submit</Button>
                </div>
            </div>
        </Box>
    )
}

export default ChooseName;