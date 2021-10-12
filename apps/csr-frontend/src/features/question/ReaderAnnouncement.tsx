import { useEffect } from 'react';
import { createPortal } from "react-dom";
import { ReaderAnnouncement as Announcement } from '@whosaidtrue/ui';
import { MessageModal, } from "@whosaidtrue/ui";

const ReaderAnnouncement: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const mount = document.getElementById("flash-message")
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

    return createPortal(<Announcement />, el)
}

export default ReaderAnnouncement;