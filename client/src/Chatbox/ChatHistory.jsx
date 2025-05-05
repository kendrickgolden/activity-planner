import "./ChatHistory.css";
function ChatHistory({ convo }) {
  const message = convo.map((message, index) => {
    return (
      <div className={message[1]==0 ? "message user" : "message ai"} key={index}>
        {message[0]}
      </div>
    );
  });

  return (
    <div id="chat_history">
      <h2>Chat History</h2>
      <div id="message_log">{message}</div>
    </div>
  );
}
export default ChatHistory;
