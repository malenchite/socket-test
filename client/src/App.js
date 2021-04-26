import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./components/Chat";
import "./App.css"

const ENDPOINT = "http://localhost:4001";

function App() {
  const [response, setResponse] = useState("");
  const [socket, setSocket] = useState(null);
  const [id, setId] = useState(null);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    const newSocket = process.env.REACT_APP_DEPLOYED ? io() : io(ENDPOINT);

    /* Get unique connection ID and color */
    newSocket.on("id info", info => {
      setId(info.id);
      setColor(info.color);
    });

    newSocket.on("clock", data => {
      setResponse(data);
    });

    setSocket(newSocket);

    // CLEAN UP THE EFFECT
    return () => newSocket.disconnect();
  }, []);

  return (
    <>
      <p>
        The server time is <time dateTime={response}>{response}</time>
      </p>
      <Chat socket={socket} color={color} id={id} />
    </>
  );
}

export default App;