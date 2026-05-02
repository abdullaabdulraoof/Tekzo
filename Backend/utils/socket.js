let io;

module.exports = {
    init: (httpServer) => {
        const { Server } = require("socket.io");
        io = new Server(httpServer, {
            cors: {
                origin: [
                    "https://tekzo-2j88.vercel.app",
                    "http://localhost:3000",
                    "http://localhost:5173"
                ],
                methods: ["GET", "POST"]
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    }
};
