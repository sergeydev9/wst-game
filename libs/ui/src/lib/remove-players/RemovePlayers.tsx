import { HiOutlineSearch } from '@react-icons/all-files/hi/HiOutlineSearch';
import ModalContent from '../containers/ModalContent';
import { Title1 } from '../typography/Typography';
import FormGroup from '../inputs/form-group/FormGroup';

export interface RemovePlayerProps {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const RemovePlayers: React.FC<RemovePlayerProps> = ({ children, onChange }) => {
    return (
        <ModalContent $narrow>
            <Title1 className="text-center">Remove Players</Title1>
            <h2 className="text-xl text-center ">They can rejoin later by re-entering the game code.</h2>
            <div className="flex flex-col gap-4 w-full">
                <FormGroup className="w-full self-center">
                    <HiOutlineSearch className="text-purple-base absolute transform translate-y-3 translate-x-4" />
                    <input
                        type="text"
                        className={`
                        rounded-xl
                        w-full
                        bg-purple-subtle-fill
                        border
                        border-purple-subtle-stroke
                        form-input
                        text-center
                        font-semibold
                        `}
                        onChange={onChange}
                        placeholder="Search for Player" />
                </FormGroup>
                {children}
            </div>

        </ModalContent>
    )
}

export default RemovePlayers;