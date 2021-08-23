import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectNameRerolls, setRemainingNameOptions, setCurrentNameOptions, selectCurrentNameOptions } from '../../features';
import { LargeTitle, Button, RerollNamesButton, Box, TextInput, Headline, WrappedButton } from '@whosaidtrue/ui';
import { NameObject, NameRequestResponse } from '@whosaidtrue/api-interfaces';
import { api } from '../../api'

const ChooseName: React.FC = () => {
    const dispatch = useAppDispatch();
    const names = useAppSelector(selectCurrentNameOptions);
    const rerolls = useAppSelector(selectNameRerolls);

    const [nameRequestErr, setNameRequestErr] = useState('')

    // get a batch of 6 names when user first arrives
    useEffect(() => {
        (async () => {
            try {
                const response = await api.get<NameRequestResponse>('/names')
                dispatch(setRemainingNameOptions(response.data.names))
                dispatch(setCurrentNameOptions())
            } catch (e) {
                // TODO: figure out error handling
                console.error(e)
            }
        })()
    }, [])
    const chooseName = (name: NameObject) => {
        // TODO: find out what the interface with the socket server will be.
        return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
        }
    }

    const namesHelper = (names: NameObject[]) => {
        return names.map((nameObj, i) => {
            return <WrappedButton color="blue" key={i} fontSize="label-big" onClick={chooseName(nameObj)} className="place-self-stretch" type="button">{nameObj.name}</WrappedButton>
        })
    }

    const rerollHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(setCurrentNameOptions());
    }

    return (
        <Box boxstyle='white' className="w-max mx-auto px-8 py-10">
            <LargeTitle>Choose Your Player Name</LargeTitle>
            <div className="flex flex-col gap-3 w-96 mt-12 flex-shrink">
                {namesHelper(names)}
                <div className="flex items-center justify-center mt-4 mb-8">
                    <RerollNamesButton onClick={rerollHandler} rerolls={rerolls} />
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-3 w-full">
                <Headline className="block">Or</Headline>
                <div className="flex flex-row w-full gap-3">
                    <TextInput $border type="text" placeholder="Create your own" />
                    <Button className="w-1/3" border="thick" $pill fontSize="label-big">Submit</Button>
                </div>
            </div>
        </Box>
    )
}

export default ChooseName;