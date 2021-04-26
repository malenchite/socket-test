import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./components/Chat";
import dayjs from "dayjs";
import "./App.css"

const ENDPOINT = "http://localhost:4001";

function App() {
  const ID_INFO_EVENT = "id info";
  const TIME_EVENT = "clock";

  const [time, setTime] = useState("");
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState(null);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    const newSocket = process.env.REACT_APP_DEPLOYED ? io() : io(ENDPOINT);

    /* Get unique connection ID and color */
    newSocket.on(ID_INFO_EVENT, info => {
      setId(info.userId);
      setColor(info.color);
    });

    /* Respond to clock data */
    newSocket.on(TIME_EVENT, time => {
      setTime(time);
    });

    /* Store socket in state */
    setSocket(newSocket);

    /* Return socket cleanup function */
    return () => newSocket.disconnect();
  }, []);

  return (
    <>
      <p>
        The server time is <time dateTime={time}>{dayjs(time).format("MM/DD/YYYY HH:mm:ss")}</time>
      </p>
      <Chat socket={socket} color={color} userId={id} />
    </>
  );
}

export default App;