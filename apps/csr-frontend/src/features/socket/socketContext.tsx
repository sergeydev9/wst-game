import { SendMessageFunction } from "@whosaidtrue/app-interfaces";
import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

// Create socket context
const socketContext = createContext<{
    socket: Socket | null,
    setSocket: Dispatch<SetStateAction<Socket | null>>,
    sendMessage: SendMessageFunction,
    shouldBlock: boolean,
    setShouldBlock: Dispatch<SetStateAction<boolean>>
} | undefined>(undefined);

export default socketContext;