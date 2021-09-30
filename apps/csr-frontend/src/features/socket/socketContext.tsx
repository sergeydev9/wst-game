import { createContext } from "react";
import { Socket } from "socket.io-client";

// Create socket context
const socketContext = createContext<Socket | null>(null);

export default socketContext;