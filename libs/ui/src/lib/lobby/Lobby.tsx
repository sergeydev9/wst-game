import tw from 'tailwind-styled-components';
import { useState } from 'react';
import { PlayerRef } from '@whosaidtrue/app-interfaces';
import WideBox from "../containers/wide-box/WideBox";
import GameCardFooter from '../gameplay/GameCardFooter';
import PlayerName from "./PlayerName";
import hourglass from './hourglass.png';

export interface LobbyProps {
    accessCode: string;
    footerMessage?: string;
    otherPlayers: PlayerRef[];
    playerName: string;
    isHost: boolean;
    handlerFactory: (player: PlayerRef) => React.MouseEventHandler; // what happens when a name is clicked on
}

const ShowHide = tw.span`
text-blue-base
underline
cursor-pointer
`

/**
 * Pre game lobby page. Children should be the One liners
 * component
 */
const Lobby: React.FC<LobbyProps> = ({ otherPlayers, footerMessage, accessCode, playerName, handlerFactory, isHost, children }) => {

    const [showingAll, setShowingAll] = useState(false); // toggle show all player names
    const playerNum = 1 + otherPlayers.length;

    const toggle = () => {
        setShowingAll(!showingAll)
    }

    const nameHelper = () => {
        const playerMap = otherPlayers.map((player, i) => (
            <PlayerName
                key={i}
                isHost={isHost}
                handler={handlerFactory(player)}
                name={player.player_name} />
        ))

        return (playerMap.length < 6 || showingAll) ? playerMap : [playerMap.slice(0, 4), <ShowHide key={6} onClick={toggle}>+{playerNum - 5} More...</ShowHide>]
    }

    return (
        <WideBox className="text-basic-black mt-10">
            <h1 className="text-3xl text-center font-black">Game Lobby ({accessCode})</h1>
            <div className="text-xl sm:text-2xl mt-4 text-center mx-auto">
                <img className="inline-block mr-2  mb-2" alt="hourglass" src={hourglass} width='25px' height='25px' />
                <span>{playerNum}{otherPlayers.length > 0 ? ' Players have joined' : ' Player has joined'}...</span>
            </div>

            <div className="font-bold text-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 place-items-center my-6">
                <span className="text-purple-base">{playerName} (you)</span>
                {nameHelper()}
                {showingAll && <ShowHide key={playerNum} onClick={toggle}>Hide</ShowHide>}
            </div>
            {children}
            {footerMessage && <GameCardFooter>{footerMessage}</GameCardFooter>}
        </WideBox>
    )
}

export default Lobby;