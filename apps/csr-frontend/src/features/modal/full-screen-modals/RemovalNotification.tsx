import { RemovalNotificationModal } from "@whosaidtrue/ui"
import { useAppDispatch } from "../../../app/hooks"
import { setFullModal } from "../modalSlice";

const RemovalNotification: React.FC = () => {
    const dispatch = useAppDispatch();

    const handler = () => {
        dispatch(setFullModal(''))
    }
    return <RemovalNotificationModal handler={handler} />
}

export default RemovalNotification;