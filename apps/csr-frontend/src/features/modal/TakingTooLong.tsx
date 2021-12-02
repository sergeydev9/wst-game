import { useEffect, } from 'react';
import { createPortal } from "react-dom";
import { TakingTooLong } from "@whosaidtrue/ui";
import MessageContainer from './MessageContainer';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectShowTakingTooLong } from '../modal/modalSlice';
import { setFullModal } from '..';

const FlashMessage: React.FC = () => {
    const dispatch = useAppDispatch();
    const showTakingTooLong = useAppSelector(selectShowTakingTooLong);
    const mount = document.getElementById("tooltip");
    const el = document.createElement("div");

    useEffect(() => {

        // mount message element into container div
        if (mount) {
            mount.appendChild(el);
        }

        // clear any timers and remove the element if ever this component dismounts
        return () => {
            if (mount) {
                mount.removeChild(el);
            };
        }

    }, [el, mount])

    const handler = () => {
        dispatch(setFullModal('skipToResults'));
    }

    return createPortal((showTakingTooLong &&
        <MessageContainer>
            <TakingTooLong handler={handler} />
        </MessageContainer>), el)

}

export default FlashMessage;