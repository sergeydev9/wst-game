import ModalContent from '../containers/ModalContent';
import Button from '../button/Button';

interface RemovalNotificationProps {
    handler: () => void
}
const RemovalNotification: React.FC<RemovalNotificationProps> = ({ handler }) => {

    return (
        <ModalContent>
            <h1 className="text-center font-bold text-3xl mt-4">You have been removed from the game by the host</h1>
            <h4 className="text-center text-xl mb-4">You can rejoin the game with a new player name</h4>
            <div className="w-2/3 lg:w-1/3">
                <Button className="w-2/3" type="button" onClick={handler}>Okay</Button>
            </div>
        </ModalContent>
    )
}

export default RemovalNotification;