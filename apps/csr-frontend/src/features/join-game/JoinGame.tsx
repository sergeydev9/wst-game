import { useState } from 'react'
import { useHistory } from "react-router-dom";

import { Title1, TextInput, WrappedButton } from '@whosaidtrue/ui';
import React from 'react';



const JoinGame: React.FC = () => {
    const history = useHistory();

    const [code, setCode] = useState('');

    // TODO: finish
    const joinGameHandler = () => {
        // history.push(`/game/join?access_code=${code}`)
    }

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value)
    }

    return (
        <section className="flex flex-col gap-4 items-center p-8">
            <Title1>Join a Game</Title1>
            <div className="flex flex-row gap-6">
                <TextInput $border placeholder="Enter Game Code" onChange={inputHandler} />
                <WrappedButton type="button" color="blue" className="w-max" fontSize="label-big" onClick={joinGameHandler}>Join Game</WrappedButton>
            </div>
        </section>
    )
}

export default JoinGame