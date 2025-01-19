import React, { useState } from "react";
import useWebSocket from "react-use-websocket";

type Comment = {
  room_id: string;
  msg_id: string;
  from_live_of_tiktok_id: string;
  customer_user_id: string;
  customer_tiktok_id: string;
  customer_name: string;
  comment: string;
  profile_picture_url: string;
  created_at: Date;
};

function LiveChat() {
  const [username, setUsername] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [socketUrl, setSocketUrl] = useState("");

  const { lastJsonMessage } = useWebSocket<Comment>(socketUrl, {
    onOpen: () => console.log("WebSocket connected"),
    onClose: () => console.log("WebSocket disconnected"),
    shouldReconnect: () => true, // Reconnect automatically
  });

  // Update comments on receiving new messages
  React.useEffect(() => {
    if (lastJsonMessage) {
      setComments((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  const handleConnect = () => {
    if (username) {
      setSocketUrl(`ws://localhost:8000/api/v1/ws/${username}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Live Chat</h1>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter TikTok username"
        />
        <button onClick={handleConnect}>Connect</button>
      </div>
      <div
        style={{
          border: "1px solid black",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            height: "300px",
            overflowY: "scroll",
            marginTop: "20px",
          }}
        >
          {comments.map((comment, index) => (
            <div
              key={index}
              style={{ borderBottom: "1px solid #ddd", padding: "10px" }}
            >
              <img
                src={comment.profile_picture_url}
                alt={`${comment.customer_name}'s avatar`}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <strong>{comment.customer_name}</strong>{" "}
              <span style={{ color: "#555" }}>({comment.customer_tiktok_id})</span>
              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveChat;
