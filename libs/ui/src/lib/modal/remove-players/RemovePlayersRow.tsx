import Button from '../../button/Button';
import { Headline } from '../../typography/Typography';

export interface RemovePlayerRowProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    name: string;
    handler: () => void;
}

const RemovePlayersRow: React.FC<RemovePlayerRowProps> = ({ name, handler }) => {
    return (
        <div className="flex items-center justify-between">
            <Headline>{name}</Headline> <Button type="button" onClick={handler} buttonStyle="inline">Remove</Button>
        </div>)
}

export default RemovePlayersRow;