import { useEffect, } from 'react';
import { createPortal } from "react-dom";
import { MessageModal, } from "@whosaidtrue/ui";
import MessageContainer from './MessageContainer';
import { ImSpinner6 } from '@react-icons/all-files/im/ImSpinner6';
import { useAppSelector } from '../../app/hooks';
import { selectLoaderMessage } from './modalSlice';

const LoaderMessage: React.FC = () => {

    const mount = document.getElementById("tooltip")
    const el = document.createElement("div")
    const message = useAppSelector(selectLoaderMessage);

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

    return createPortal((message &&
        <MessageContainer>
            <MessageModal>
                <ImSpinner6 className="text-yellow-gradient-to animate-spin text-md" height="24px" width="24px" />
                {message}
            </MessageModal>
        </MessageContainer>), el)

}

export default LoaderMessage;