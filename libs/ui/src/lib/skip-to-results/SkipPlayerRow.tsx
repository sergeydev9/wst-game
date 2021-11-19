import tw from 'tailwind-styled-components';
import Button from '../button/Button';

const Item = tw.li`
    flex
    justify-between
    items-center
    w-full
    font-bold
    text-basic-black
`

interface SkipPlayerRowProps {
    playerName: string;
    playerId: number;
    handlerFactory: (id: number) => () => void;
}
const SkipPlayerRow: React.FC<SkipPlayerRowProps> = ({ playerName, playerId, handlerFactory }) => {
    return (
        <Item>
            {playerName}
            <Button
                className="min-w-min"
                buttonStyle='inline'
                $secondary
                onClick={handlerFactory(playerId)}>
                Remove from Game
            </Button>
        </Item>
    )
}

export default SkipPlayerRow;