function Messages(props) {
  return (
    <ul id="messages">
      {props.chat.map(msgPacket => <li key={msgPacket.msgId} style={{ backgroundColor: msgPacket.color }} data-id={msgPacket.userId}>{msgPacket.msg}</li>)}
    </ul>
  );
}

export default Messages;