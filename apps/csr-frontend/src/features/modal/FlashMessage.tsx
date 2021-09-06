import { useEffect } from 'react';
import { createPortal } from "react-dom";
import { MessageModal, } from "@whosaidtrue/ui";
import partypopper from '../../assets/party-popper-emoji.png';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { selectIsPersistent, selectMessageContent, selectMessageType } from '../modal/modalSlice';
import { clearMessage } from './modalSlice';

const FlashMessage: React.FC = () => {
    const dispatch = useAppDispatch();
    const messageType = useAppSelector(selectMessageType)
    const content = useAppSelector(selectMessageContent)
    const isPersistent = useAppSelector(selectIsPersistent)
    const mount = document.getElementById("flash-message")
    const el = document.createElement("div")

    useEffect(() => {
        if (mount) {
            mount.appendChild(el);
        }
        const timer = isPersistent ? null : setTimeout(() => {
            dispatch(clearMessage())
        }, 2100
        );

        // clear any timers and remove the element if ever this component dismounts
        return () => {
            if (mount) {
                mount.removeChild(el)
            };

            if (timer) clearTimeout(timer)
        }

    }, [el, mount, dispatch, isPersistent])

    const emojiHelper = () => {
        switch (messageType) {
            case 'playerJoined':
                return <img src={partypopper} alt="party popper" aria-label="party popper" />
            default:
                return
        }
    }


    return createPortal((content &&
        <div className={`fixed mx-auto top-36 w-max z-50 left-0 right-0 transform scale-0 ${isPersistent ? 'animate-grow' : 'animate-shrink'}`}>
            <MessageModal
                error={true}>
                error
            </MessageModal>
        </div >), el)

}

export default FlashMessage;