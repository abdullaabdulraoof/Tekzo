import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to Socket.io server");
        });

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
