import { useEffect, useMemo } from 'react';
import { createPortal } from "react-dom";
import { MessageModal, } from "@whosaidtrue/ui";
import partypopper from '../../assets/party-popper-emoji.png';
import goodbye from '../../assets/waving-hand.png';
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

        // mount message element into container div
        if (mount) {
            mount.appendChild(el);
        }

        // if not persistent, clear message after 2100 ms
        const timer = isPersistent ? null : setTimeout(() => {
            dispatch(clearMessage())
        }, 2100);

        // clear any timers and remove the element if ever this component dismounts
        return () => {
            if (mount) {
                mount.removeChild(el)
            };
            if (timer) clearTimeout(timer) // clear any timers on component dismount
        }

    }, [el, mount, dispatch, isPersistent])

    const GoodbyeEmoji = <img width="20px" height="20px" src={goodbye} alt="party popper" aria-label="party popper" />;

    // Returns an image element based on message type
    const emojiHelper = () => {
        switch (messageType) {
            case 'playerJoined':
                return <img width="20px" height="20px" src={partypopper} alt="party popper" aria-label="party popper" />
            case 'playerRemoved':
                return GoodbyeEmoji
            case 'playerLeft':
                return GoodbyeEmoji
            default:
                return
        }
    }


    // TODO: This logic could be cleaned up
    return createPortal((content &&
        <div className={`fixed mx-auto top-24 w-max z-50 left-0 right-0 transform scale-0 ${isPersistent ? 'animate-grow' : 'animate-shrink'}`}>
            <MessageModal
                error={messageType === 'error'}
                success={messageType === 'success'}>
                {emojiHelper()}
                {content}
            </MessageModal>
        </div >), el)

}

export default FlashMessage;