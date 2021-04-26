import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./components/Chat";
import "./App.css"

const ENDPOINT = "http://localhost:4001";

function App() {
  const ID_INFO_STRING = "id info";
  const TIME_STRING = "clock";

  const [time, setTime] = useState("");
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState(null);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    const newSocket = process.env.REACT_APP_DEPLOYED ? io() : io(ENDPOINT);

    /* Get unique connection ID and color */
    newSocket.on(ID_INFO_STRING, info => {
      setId(info.userId);
      setColor(info.color);
    });

    /* Respond to clock data */
    newSocket.on(TIME_STRING, data => {
      setTime(data);
    });

    /* Store socket in state */
    setSocket(newSocket);

    /* Return socket cleanup function */
    return () => newSocket.disconnect();
  }, []);

  return (
    <>
      <p>
        The server time is <time dateTime={time}>{time}</time>
      </p>
      <Chat socket={socket} color={color} userId={id} />
    </>
  );
}

export default App;