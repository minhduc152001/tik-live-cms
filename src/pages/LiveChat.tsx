import { Avatar, Button, Input, List } from "antd";
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
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          padding: "0 40px",
        }}
      >
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter TikTok username"
        />
        <Button onClick={handleConnect}>Connect</Button>
      </div>
      {comments?.length ? (
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={comment.profile_picture_url} />}
                title={
                  <div>
                    {comment.customer_name} (ID: {comment.customer_tiktok_id})
                  </div>
                }
                description={comment.comment}
              />
            </List.Item>
          )}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default LiveChat;
