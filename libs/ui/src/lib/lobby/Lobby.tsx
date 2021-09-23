import tw from 'tailwind-styled-components';
import { useState } from 'react';
import WideBox from "../containers/wide-box/WideBox";
import GameCardFooter from '../gameplay/GameCardFooter';
import WhileYouWereWaiting from '../while-you-were-waiting/WhileYouWereWaiting';
import PlayerName from "./PlayerName";
import hourglass from './hourglass.png';

export interface LobbyProps {
    footerMessage: string;
    otherPlayers: string[];
    playerName: string;
    isHost: boolean;
    handlerFactory: (name: string) => React.MouseEventHandler;
    showMoreHandler: React.MouseEventHandler;
}

const ShowHide = tw.span`
text-blue-base
underline
cursor-pointer
`
const Lobby: React.FC<LobbyProps> = ({ otherPlayers, footerMessage, playerName, handlerFactory, isHost }) => {

    const [showingAll, setShowingAll] = useState(false);
    const playerNum = 1 + otherPlayers.length;

    const toggle = () => {
        setShowingAll(!showingAll)
    }

    const nameHelper = () => {
        const playerMap = otherPlayers.map((name, i) => (
            <PlayerName
                key={i}
                isHost={isHost}
                handler={handlerFactory(name)}
                name={name} />
        ))

        return (playerMap.length < 6 || showingAll) ? playerMap : [playerMap.slice(0, 4), <ShowHide key={6} onClick={toggle}>+{playerNum - 5} More...</ShowHide>]
    }

    return (
        <WideBox className="text-basic-black mt-10">
            <h1 className="text-3xl text-center font-black">Game Lobby</h1>
            <div className="text-xl sm:text-2xl mt-4 text-center mx-auto">
                <img className="inline-block mr-2  mb-2" alt="hourglass" src={hourglass} width='25px' height='25px' />
                <span>{playerNum}{otherPlayers.length > 1 ? ' Players have joined' : ' Player has joined'}...</span>
            </div>

            <div className="font-bold text-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 place-items-center my-6">
                <span className="text-purple-base">{playerName} (you)</span>
                {nameHelper()}
                {showingAll && <ShowHide key={playerNum} onClick={toggle}>Hide</ShowHide>}
            </div>
            <WhileYouWereWaiting className="mt-4" />
            <GameCardFooter>{footerMessage}</GameCardFooter>
        </WideBox>
    )
}

export default Lobby;