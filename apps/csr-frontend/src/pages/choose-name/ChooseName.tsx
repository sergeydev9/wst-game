import React from 'react';
import { useParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectNameRerolls, setCurrentNameOptions, selectCurrentNameOptions } from '../../features';
import { LargeTitle, Button, LabelBig, RerollNamesButton } from '@whosaidtrue/ui';

const ChooseName: React.FC = () => {
    const dispatch = useAppDispatch();
    const names = useAppSelector(selectCurrentNameOptions);
    const rerolls = useAppSelector(selectNameRerolls);

    const chooseName = (name: string) => {
        // TODO: find out what the interface with the socket server will be.
        return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
        }
    }

    const namesHelper = (names: string[]) => {
        return names.map((name, i) => {
            return <Button key={i} fontSize="label-small" onClick={chooseName(name)} className="w-full" type="button">{name}</Button>
        })
    }

    const rerollHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(setCurrentNameOptions());
    }

    return (
        <section className="flex flex-col items-center gap-8 mx-auto w-max">
            <LargeTitle>Choose Your Player Name</LargeTitle>
            <div className="flex flex-col items-center gap-3 w-96">
                {namesHelper(names)}
                <RerollNamesButton onClick={rerollHandler} rerolls={rerolls} />
            </div>
            <div className="flex flex-col items-center gap-4 mt-3 w-full">
                <LabelBig className="block text-gray-600">Or Customize Name</LabelBig>
                <div className="flex flex-row w-full gap-3 items-stretch">
                    <input type="text" placeholder="Type Your Name" className="form=input text-center focus:outline-none bg-gray-300 rounded-full w-2/3" />
                    <Button className="w-1/3" border="thin">Add Name</Button>
                </div>
            </div>
        </section>
    )
}

export default ChooseName;