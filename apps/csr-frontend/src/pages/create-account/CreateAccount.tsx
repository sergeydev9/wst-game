import { CreateAccount } from '../../features';
import { NoFlexBox } from "@whosaidtrue/ui";

const CreateAccountPage: React.FC = () => {
    return (
        <NoFlexBox className="mx-auto w-max">
            <CreateAccount />
        </NoFlexBox>
    )
}

export default CreateAccountPage;