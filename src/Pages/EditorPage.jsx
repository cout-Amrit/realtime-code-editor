import React, { useEffect, useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import Client from "../components/Client";
import Editor from "../components/Editor";

import { initSocket } from "../socket";
import actions from "../actions";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef("");

  const navigate = useNavigate();

  const [clients, setClients] = useState([]);

  const { roomId } = useParams();

  const location = useLocation();

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.log(err);
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  useEffect(() => {
    const init = async () => {
      // establishing connection to server
      socketRef.current = await initSocket();

      // error handling
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      // error handler
      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      // emitting "join" event
      socketRef.current.emit(actions.JOIN, {
        roomId,
        username,
      });

      // listening "joined" event
      socketRef.current.on(
        actions.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state.username) {
            toast.success(`${username} joined!`);
            socketRef.current.emit(actions.SYNC_CODE, { code: codeRef.current, socketId });
          }
          setClients(clients);
        }
      );

      // listening to "disconnected" event
      socketRef.current.on(actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prevState) => {
          return prevState.filter((client) => client.socketId !== socketId);
        });
      });
    };

    init();

    return () => {
      socketRef.current.off(actions.JOINED);
      socketRef.current.off(actions.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }
  const username = location.state.username;

  return (
    <div className="main-wrap">
      <div className="aside-wrap">
        <div className="aside-inner">
          <div className="editor-page-logo">
            <img
              className="logo-image"
              src="/code-sync.png"
              alt="code-sync-logo"
            />
          </div>
          <h3>Connected</h3>
          <div className="clients-list">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copy-btn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leave-btn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editor-wrap">
        {/* <div className="menue">
          <select name="" id="languages-dropdown">
            <option value="">Javascript</option>
            <option value="">C++</option>
            <option value="">Python</option>
          </select>
        </div> */}
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => (codeRef.current = code)}
        />
      </div>
    </div>
  );
};

export default EditorPage;
