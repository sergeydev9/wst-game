import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { NameRequestResponse } from '@whosaidtrue/api-interfaces';
import { setRemainingNameOptions } from './chooseNameSlice';
import {
    selectNameRerolls,
    setCurrentNameOptions,
    selectCurrentNameOptions,
    selectSeen,
    sendReport,
} from './chooseNameSlice';
import {
    setGameStatus,
    clearGame,
    joinGame,
    selectIsHost,
    endGameFromApi,
    selectGameId,
} from '../game/gameSlice';
import {
    Button,
    RerollNamesButton,
    Box,
    TextInput,
    Divider,
    Title3,
    Title1,
    ErrorText
} from '@whosaidtrue/ui';
import { NameObject } from '@whosaidtrue/app-interfaces';
import { JoinGameResponse, StatusRequestResponse } from '@whosaidtrue/api-interfaces';
import { api } from '../../api'
import { showError } from '../modal/modalSlice';

const ChooseName: React.FC = () => {
    const dispatch = useAppDispatch();
    const [shouldBlock, setShouldBlock] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [hasLeftFocus, setHasLeftFocus] = useState(false);
    const [text, setText] = useState('')
    const { access_code } = useParams<{ access_code: string }>()
    const history = useHistory();
    const names = useAppSelector(selectCurrentNameOptions);
    const rerolls = useAppSelector(selectNameRerolls);
    const seen = useAppSelector(selectSeen)
    const isHost = useAppSelector(selectIsHost);
    const gameId = useAppSelector(selectGameId);


    useEffect(() => {

        const fetchNames = async () => {

            // get 6 name options
            try {
                const response = await api.get<NameRequestResponse>('/names');
                dispatch(setRemainingNameOptions(response.data.names)); // populate total name pool
                dispatch(setCurrentNameOptions()); // set initial set of options and remove them from pool
            } catch (e) {
                history.push('/');
                dispatch(clearGame());
            }
        }

        // show confirmation dialog and clear game state if confirmed
        // eslint-disable-next-line
        const unblock = history.block((...args: any[]) => {

            // DEV_NOTE: react-router-dom's type definitions are incorrect at the moment, so any type
            // has to be used here to prevent compiler errors
            // args[0] is a location object, and args[1] is a navigation action type

            // eslint-disable-next-line
            const path = args[0].pathname as any
            if (path !== '/play' && shouldBlock) {
                const confirmMessage = isHost ? 'Are you sure you want to leave? Since you are the host, this will end the game for everyone' :
                    'Are you sure you want to leave the game?';

                if (window.confirm(confirmMessage)) {
                    dispatch(clearGame());

                    if (isHost) {
                        dispatch(endGameFromApi(gameId))
                    }
                    return true;
                }
                return false
            }
            return true
        })

        // redirect if no access_code
        if (!access_code) {
            dispatch(showError('Access code not found'));
            history.push('/');
        }

        // check if game exists
        const checkStatus = async () => {
            try {

                const statusResponse = await api.get<StatusRequestResponse>(`/games/status?access_code=${access_code}`);
                const { status } = statusResponse.data;

                if (status === 'finished') {
                    setShouldBlock(false)
                    dispatch(showError('The game you are trying to join has already finished'));
                    dispatch(clearGame());
                    history.push('/')
                } else {
                    // if game found, get names
                    fetchNames();
                    dispatch(setGameStatus(statusResponse.data.status));
                    setShouldBlock(true);
                }

            } catch (e) {
                setShouldBlock(false)
                dispatch(showError('Could not find the game you were looking for'));
                dispatch(clearGame());
                history.push('/')
            }
        }
        checkStatus();
        return () => {
            unblock();
        }

    }, [
        dispatch,
        history,
        access_code,
        isHost,
        shouldBlock,
        gameId,
    ])

    // send request to join the game
    const join = async (name: string) => {
        api.post<JoinGameResponse>('/games/join', { access_code, name }).then(result => {
            dispatch(joinGame(result.data));
            history.push('/play');
        }).catch(e => {

            // if name not available, show message and terminate
            if (e.response.status === 422 && e.response.data === 'Name not available') {
                dispatch(showError('That name is not available. Please select another.'));
                return;
            }

            setShouldBlock(false);
            dispatch(clearGame());

            if (e.response.status === 401) {
                dispatch(showError('That name is no longer available. Please select another'));
            } else if (e.response.status === 403) {
                dispatch(showError('The game you are atempting to join has already finished'));
                history.push('/');
            }
            else {
                dispatch(showError('An error occurred while attempting to join game'));
                history.push('/')
            }
        })
    }

    // on click, send name report and join game
    const chooseName = (nameObj: NameObject) => {
        return () => {
            dispatch(sendReport({ chosen: nameObj.id, seen: seen.map(n => n.id) }))
            join(nameObj.name)
        }
    }

    // creates a button for each name
    const namesHelper = (names: NameObject[]) => {
        return names.map((nameObj, i) => {
            return (
                <Button key={i} buttonStyle="big-text" onClick={chooseName(nameObj)} type="button">{nameObj.name}</Button>
            )
        })
    }

    // get the next set of names
    const rerollHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(setCurrentNameOptions());
    }

    // input change
    const changeHandler = (e: React.BaseSyntheticEvent) => {
        const { value } = e.target;

        setText(value)

        if (!isTouched) {
            setIsTouched(true);
        }

        // max length 25
        if (value.length > 25 || value.length < 1) {
            setIsValid(false)
        } else {
            setIsValid(true);
        }


    }

    const clickHandler = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isValid) {
            if (text.length === 0) {
                dispatch(showError('Name cannot be empty'));
            } else {
                dispatch(showError('Name cannot be longer than 25 characters'))
            }
        } else {
            dispatch(sendReport({ seen: seen.map(n => n.id) }));
            join(text);
        }

    }

    const customNameError = isTouched && !isValid && hasLeftFocus;

    return (
        <Box boxstyle='white' className="mx-4 sm:w-max sm:mx-auto px-2 xs:px-8 py-10 text-center">
            <Title1 className="text-basic-black mx-8">Choose Your Player Name</Title1>
            <div className="flex flex-col gap-3 mt-8 xs:w-80">
                {namesHelper(names)}
                <div className="mt-4 flex justify-center">
                    <RerollNamesButton className="max-w-full" onClick={rerollHandler} rerolls={rerolls} />
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-10 w-full">
                <div className="flex flex-shrink place-items-center gap-3 h-8 px-32">
                    <Divider dividerColor='grey' />
                    <Title3 >OR</Title3>
                    <Divider dividerColor='grey' />
                </div>
                <form className="flex flex-col sm:flex-row gap-3 items-center max-w-full">
                    <TextInput
                        $border
                        type="text"
                        className="font-semibold text-xl inline w-1/3"
                        $hasError={customNameError}
                        onChange={changeHandler}
                        onBlur={() => setHasLeftFocus(true)}
                        placeholder="Create your own" />
                    <Button className="w-2/3 inline" buttonStyle="big-text" onClick={clickHandler} $secondary>Submit</Button>
                </form>
            </div>
        </Box>
    )
}

export default ChooseName;
