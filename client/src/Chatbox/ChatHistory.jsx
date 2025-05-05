import "./ChatHistory.css";
function ChatHistory({ convo }) {
  const message = convo.map((text, index) => {
    return (
      <div className="message" key={index}>
        {text}
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
