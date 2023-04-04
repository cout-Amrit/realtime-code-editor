import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const HomePage = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room!");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room Id & username is required!");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const enterInputHandler = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="home-page-wrapper">
      <div className="form-wrapper">
        <img
          className="home-page-logo"
          src="/code-sync.png"
          alt="code-sync-logo"
        />
        <h4 className="main-label">Paste invitation ROOM ID</h4>
        <div className="input-group">
          <input
            type="text"
            name="roomId"
            className="input-box"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={enterInputHandler}
          />
          <input
            type="text"
            name="username"
            className="input-box"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={enterInputHandler}
          />
          <button className="btn join-btn" onClick={joinRoom}>
            Join
          </button>
          <span className="create-room">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} className="create-new-room">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with&nbsp;❤️&nbsp;by &nbsp;
          <a href="/github link of this code">Amrit Shukla</a>
        </h4>
      </footer>
    </div>
  );
};

export default HomePage;
