import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Chat from "./components/Chat";
import "./App.css"

const ENDPOINT = "http://localhost:4001";

function App() {
  const [response, setResponse] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = process.env.REACT_APP_DEPLOYED ? io() : io(ENDPOINT);
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
        It's <time dateTime={response}>{response}</time>
      </p>
      <Chat socket={socket} />
    </>
  );
}

export default App;