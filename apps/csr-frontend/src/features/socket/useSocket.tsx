import { useContext } from "react";
import socketContext from "./socketContext";

/**
 * Custom hook that can be used to set or retrieve the socket connection.
 *
 * @example
 *
 * const MyComponent = () => {
 *   const socket = useSocket()
 *
 *   const sendMessage = () => {
 *     socket.emit("myMessage")
 *   }
 *
 *   ...
 * }
 */
const useSocket = () => {
    const context = useContext(socketContext);

    if (!context) {
        throw new Error('useSocket hook must be used within socket context provider')
    }

    return context
}

export default useSocket