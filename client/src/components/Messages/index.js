function Messages(props) {
  return (
    <ul id="messages">
      {props.chat.map(msgPacket => <li key={msgPacket.id} style={{ backgroundColor: msgPacket.color }} data-id={msgPacket.id}>{msgPacket.msg}</li>)}
    </ul>
  );
}

export default Messages;