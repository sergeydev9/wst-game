import { Button, Box, Title3, BodySmall, ModalContent } from "@whosaidtrue/ui"
import { useHistory } from "react-router"
import { setFullModal } from "../.."
import { useAppDispatch } from "../../../app/hooks"

const GuestAccountRedirect = () => {
    const history = useHistory()
    const dispatch = useAppDispatch()

    const goToReset = () => {
        dispatch(setFullModal(''))
        history.push('/reset/send-email')
    }

    return (
        <ModalContent>
            <Title3 className="text-center">You are currently logged in as a guest.</Title3>
            <BodySmall className="text-center"> Please set a password before making any purchases</BodySmall>
            <div className="flex flex-col gap-4 w-full">
                <Button onClick={goToReset}>Set Password</Button>
                <Button $secondary onClick={() => dispatch(setFullModal(''))}>Cancel</Button>
            </div>

        </ModalContent>
    )
}

export default GuestAccountRedirect