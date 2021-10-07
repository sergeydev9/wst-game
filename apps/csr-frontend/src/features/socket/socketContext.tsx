import { SendMessageFunction } from "@whosaidtrue/app-interfaces";
import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

// Create socket context
const socketContext = createContext<{
    socket: Socket | null,
    setSocket: Dispatch<SetStateAction<Socket | null>>,
    sendMessage: SendMessageFunction
} | undefined>(undefined);

export default socketContext;