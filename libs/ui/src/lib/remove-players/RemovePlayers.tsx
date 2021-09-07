import { HiOutlineSearch } from '@react-icons/all-files/hi/HiOutlineSearch';
import { Title1 } from '../typography/Typography';
import FormGroup from '../form-group/FormGroup';
import Box from '../box/Box';

export interface RemovePlayerProps {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const RemovePlayers: React.FC<RemovePlayerProps> = ({ children, onChange }) => {
    return (
        <Box boxstyle="white" className="text-basic-black md:w-28rem gap-10 pt-6 pb-14 px-8">
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

        </Box >
    )
}

export default RemovePlayers;