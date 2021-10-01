import { createContext, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

// Create socket context
const socketContext = createContext<{ socket: Socket | null, setSocket: Dispatch<SetStateAction<Socket | null>> } | undefined>(undefined);

export default socketContext;