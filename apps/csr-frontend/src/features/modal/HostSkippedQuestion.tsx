import { useEffect, } from 'react';
import { createPortal } from "react-dom";
import { MessageModal, HostSkippedQuestion } from "@whosaidtrue/ui";
import MessageContainer from './MessageContainer';
import trophy from '../../assets/trophy.png';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { dismissScoreTooltip, selectMessageType } from '../modal/modalSlice';

const ScoreTooltip: React.FC = () => {
    const dispatch = useAppDispatch();
    const messageType = useAppSelector(selectMessageType)
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

    return createPortal((messageType === 'hostSkippedQuestion' &&
        <MessageContainer>
            <HostSkippedQuestion />
        </MessageContainer>), el)

}

export default ScoreTooltip;