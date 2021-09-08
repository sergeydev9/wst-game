import { BiTrash } from '@react-icons/all-files/bi/BiTrash'

export interface PlayerNameProps {
    name: string;
    isHost: boolean;
    handler: React.MouseEventHandler;
}

const PlayerName: React.FC<PlayerNameProps> = ({ name, handler, isHost }) => {
    return (
        <span>{name} {isHost && <BiTrash className="ml-1 inline-block cursor-pointer" onClick={handler} />}</span>
    )
}

export default PlayerName