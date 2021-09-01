import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectNameRerolls,
    setRemainingNameOptions,
    setCurrentNameOptions,
    selectCurrentNameOptions
} from './chooseNameSlice';
import { setGameStatus } from '../game/gameSlice';
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
import { NameRequestResponse } from '@whosaidtrue/api-interfaces';
import { api } from '../../api'

const ChooseName: React.FC = () => {
    const dispatch = useAppDispatch();
    const names = useAppSelector(selectCurrentNameOptions);
    const rerolls = useAppSelector(selectNameRerolls);

    // get a batch of 6 names when user first arrives
    useEffect(() => {
        dispatch(setGameStatus('choosingName'));

        // TODO: check url params for a code, and redirect/wipe game state if absent. Need to find out
        // what kind of messages should be displayed.

        // get names from server
        (async () => {
            try {
                const response = await api.get<NameRequestResponse>('/names')
                dispatch(setRemainingNameOptions(response.data.names)) // populate total name pool
                dispatch(setCurrentNameOptions()) // set initial set of options and remove them from pool
            } catch (e) {
                // TODO: figure out error handling
                console.error(e)
                dispatch(setGameStatus('notInGame'))
            }
        })()
    }, [])
    const chooseName = (name: NameObject) => {
        // TODO: find out what the interface with the socket server will be.
        return (e: React.MouseEvent) => {
            e.preventDefault();
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