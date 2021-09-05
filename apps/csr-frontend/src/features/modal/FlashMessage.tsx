import { useEffect } from 'react';
import { createPortal } from "react-dom";
import { Messages, FlashMessageModalProps } from "@whosaidtrue/ui";

const FlashMessage: React.FC<FlashMessageModalProps> = ({ children, closeFn, ...rest }) => {

    const mount = document.getElementById("flash-message");
    const el = document.createElement("div");

    useEffect(() => {
        if (mount) {
            mount.appendChild(el);
        }

        return () => {
            if (mount) mount.removeChild(el);
        }
    }, [el, mount, closeFn])

    return createPortal(
        <div className="absolute top-28 left-0 right-0 mx-auto w-max">
            <Messages
                closeFn={closeFn}
                {...rest}>
                {children}
            </Messages>
        </div>
        , el)

}

export default FlashMessage;