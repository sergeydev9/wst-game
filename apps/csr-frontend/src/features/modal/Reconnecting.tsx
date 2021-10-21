import { useEffect, } from 'react';
import { createPortal } from "react-dom";
import { MessageModal, } from "@whosaidtrue/ui";
import MessageContainer from './MessageContainer';
import { ImSpinner6 } from '@react-icons/all-files/im/ImSpinner6';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectScoreTooltipShowing, dismissScoreTooltip, selectReconnecting } from '../modal/modalSlice';

const FlashMessage: React.FC = () => {
    const dispatch = useAppDispatch();

    const reconnecting = useAppSelector(selectReconnecting);
    const mount = document.getElementById("tooltip")
    const el = document.createElement("div")

    useEffect(() => {

        // mount message element into container div
        if (mount) {
            mount.appendChild(el);
        }

        // clear any timers and remove the element if ever this component dismounts
        return () => {
            if (mount) {
                mount.removeChild(el)
            };
        }

    }, [el, mount])

    const tooltipHandler = () => {
        dispatch(dismissScoreTooltip());
    }

    return createPortal((reconnecting &&
        <MessageContainer>
            <MessageModal>
                <ImSpinner6 className="text-yellow-gradient-to animate-spin text-md" height="24px" width="24px" />
                Connection to game server lost. Reconnecting...
            </MessageModal>
        </MessageContainer>), el)

}

export default FlashMessage;