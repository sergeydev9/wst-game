import { useEffect } from 'react';
import { Button, Title1, BodyMedium, ModalContent } from '@whosaidtrue/ui';
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { selectTargetName, clearTarget, sendRemovePlayerSignal, selectTargetId } from "../../game/gameSlice";
import { setFullModal } from '../modalSlice';

const ConfirmRemovePlayerModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const targetName = useAppSelector(selectTargetName);
    const targetId = useAppSelector(selectTargetId)

    useEffect(() => {

        return () => {
            dispatch(clearTarget())
        }
    }, [dispatch])

    const removePlayer = () => {
        dispatch(sendRemovePlayerSignal(targetId))
        dispatch(setFullModal(''))

    }
    return (
        <ModalContent>
            <Title1 className="mb-8 mt-2">Remove Player?</Title1>
            <BodyMedium >Are you sure you want to remove</BodyMedium>
            <h3 className='font-black text-2xl'>{targetName}</h3>
            <div className="md:w-3/5 my-10 flex flex-col gap-4 mx-auto">
                <Button onClick={removePlayer} type="button">Yes, remove player</Button>
                <Button className="w-full" onClick={() => dispatch(setFullModal(''))} type="button" $secondary>Cancel</Button>
            </div>
        </ModalContent>
    )
}

export default ConfirmRemovePlayerModal;