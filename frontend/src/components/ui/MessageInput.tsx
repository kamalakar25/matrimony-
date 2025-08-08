import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-3 flex items-center gap-2 border-t bg-white">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button onClick={send}>Send</Button>
    </div>
  );
}
