import tw from 'tailwind-styled-components';
import { useState } from 'react';
import Box from "../box/Box";
import WideBox from "../wide-box/WideBox";
import PlayerName from "./PlayerName";
import hourglass from './hourglass.png';
import fencer from './fencer.png';

export interface LobbyProps {
    footerMessage: string;
    otherPlayers: string[];
    playerName: string;
    isHost: boolean;
    handlerFactory: (name: string) => React.MouseEventHandler;
    showMoreHandler: React.MouseEventHandler;
}

const Footer = tw.div`
bg-yellow-base
absolute
bottom-0
left-0
right-0
px-2
rounded-b-3xl
py-2
md:py-5
text-center
text-md
sm:text-lg
font-black
flex
items-center
justify-center
`

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
            <Box boxstyle="purple-subtle" className="md:text-2xl sm:text-xl text-lg sm:py-6 sm:px-4 py-4 px-4 md:py-8 md:px-6 mx-auto mt-4 mb-20 w-max">
                <span>While you were waiting:</span>
                <div>
                    <span className="font-bold inline-block">&#8220;tis but a flesh wound!&#8221;</span>
                    <img className="inline-block ml-1" src={fencer} alt="fencer" width='25px' height='25px' />
                </div>
            </Box>
            <Footer>{footerMessage}</Footer>
        </WideBox>
    )
}

export default Lobby;