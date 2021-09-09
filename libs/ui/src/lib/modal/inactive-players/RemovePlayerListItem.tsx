import Button from '../../button/Button';
import { Headline } from '../../typography/Typography';

export interface RemovePlayerListItemProps {
    label: string;
    removeHandler: () => void;
}
const RemovePlayerListItem: React.FC<RemovePlayerListItemProps> = ({ label, removeHandler }) => {
    return (
        <li className="text-basic-black flex flex-row justify-between w-full gap-2 select-none my-2 md:my-4">
            <Headline>{label}</Headline>
            <Button className="w-1/3 sm:w-1/2 md:w-max" buttonStyle='inline' $secondary>Remove from Game</Button>
        </li>
    )
}

export default RemovePlayerListItem;