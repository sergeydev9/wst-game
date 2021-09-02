import { Title1, Button } from "@whosaidtrue/ui"
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setFullModal } from "../modal/modalSlice";
import { buyWithCredits, clearCart, selectDeckId } from "./cartSlice";

const CreditPurchase: React.FC = () => {
    const dispatch = useAppDispatch()
    const deckId = useAppSelector(selectDeckId)

    const confirm = (e: React.MouseEvent) => {
        e.preventDefault()
        dispatch(buyWithCredits(deckId))
    }

    const cancel = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(clearCart());
        dispatch(setFullModal(''))
    }

    return (
        <>
            <Title1 className="text-center mb-8 mt-1 px-12 text-basic-black">Purchase with Free Deck Credit?</Title1>
            <div className="px-36">
                <Button onClick={confirm}>Yes</Button>
                <Button $secondary className="w-full mt-8 mb-2" onClick={cancel}>No</Button>
            </div>

        </>
    )
}

export default CreditPurchase