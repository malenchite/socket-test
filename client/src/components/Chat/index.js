import { useState, useEffect } from "react";

function Chat(props) {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const handleMessageChange = e => {
    setMessage(e.target.value);
  }

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (message) {
      props.socket.emit("chat message", message);
      setMessage("");
    }
  }

  useEffect(() => {
    if (props.socket) {
      props.socket.on("chat message", msg => setChat([...chat, msg]));
    }
  }, [chat, props.socket]);


  return (
    <>
      <ul id="messages">
        {chat.map(msg => <li key={msg.id}>{msg.msg}</li>)}
      </ul>
      <form id="form" onClick={sendChatMessage}>
        <input id="input" value={message} autoComplete="off" onChange={handleMessageChange} /><button>Send</button>
      </form>
    </>
  );
}

export default Chat;