import "./ChatHistory.css";
function ChatHistory({ convo }) {
  const message = convo
    //ignore any 'system' messages
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg, index) => (
      <div
        className={msg.role === "user" ? "message user" : "message ai"}
        key={index}
      >
        {msg.content}
      </div>
    ));
  return (
    <div id="chat_history">
      <h2>Chat History</h2>
      <div id="message_log">{message}</div>
    </div>
  );
}
export default ChatHistory;
