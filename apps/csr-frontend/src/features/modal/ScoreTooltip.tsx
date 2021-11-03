import { useEffect, } from 'react';
import { createPortal } from "react-dom";
import { MessageModal, } from "@whosaidtrue/ui";
import MessageContainer from './MessageContainer';
import trophy from '../../assets/trophy.png';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectScoreTooltipShowing, dismissScoreTooltip } from '../modal/modalSlice';

const FlashMessage: React.FC = () => {
    const dispatch = useAppDispatch();

    const showScoreTooltip = useAppSelector(selectScoreTooltipShowing);
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

    return createPortal((showScoreTooltip &&
        <MessageContainer>
            <MessageModal closeFn={tooltipHandler} >
                <img width="20px" height="20px" src={trophy} alt="trophy" aria-label="trophy" />
                Points are earned based on how close you are to the correct answer.
            </MessageModal>
        </MessageContainer>), el)

}

export default FlashMessage;