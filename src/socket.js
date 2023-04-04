import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    forceNew: true,
    timeout: 10000,
    transports: ["websocket"],
  };
  return io(process.env.REACT_APP_SERVER_URL, options); // return an socket instance
};

// In react we don't need to install or configure dotenv because it is built-in with react but we need to add REACT_APP_ prefix.
