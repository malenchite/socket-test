import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Chat from "./components/Chat";
import "./App.css"

const ENDPOINT = process.env.ENDPOINT || "http://localhost:4001";

function App() {
  const [response, setResponse] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
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