import { useState, useEffect } from "react";
import Messages from "../Messages";

function Chat(props) {
  const CHAT_MSG_EVENT = "chat message";
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  /* Updates state when message changes */
  const handleMessageChange = e => {
    setMessage(e.target.value);
  }

  /* Sends chat message on socket */
  const sendChatMessage = (e) => {
    e.preventDefault();

    if (message) {
      const msgPacket = {
        msg: message,
        color: props.color,
        userId: props.userId
      };
      props.socket.emit(CHAT_MSG_EVENT, msgPacket);
      setMessage("");
    }
  }

  /* Initializes socket listener */
  useEffect(() => {
    if (props.socket) {
      props.socket.on(CHAT_MSG_EVENT, msgPacket => {
        setChat(prevChat => [...prevChat, msgPacket]);
        window.scrollTo(0, document.body.scrollHeight);
      });

      return () => props.socket.off(CHAT_MSG_EVENT);
    }
  }, [props.socket]);


  return (
    <>
      <div id="welcome">
        Welcome to the socket.io chat test! Your text will appear as <span style={{ backgroundColor: props.color, padding: "0.25rem 0.25rem" }}>this color</span>. Just type something in below and click 'Send'!
      </div>
      <hr />
      <Messages chat={chat} />
      <form id="form" onSubmit={sendChatMessage}>
        <input id="input" value={message} autoComplete="off" onChange={handleMessageChange} /><button>Send</button>
      </form>
    </>
  );
}

export default Chat;