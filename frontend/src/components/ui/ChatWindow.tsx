import { Card } from "./card";
import MessageInput from "./MessageInput";

export default function ChatWindow({ profile, messages, onSendMessage }) {
  return (
    <div className="w-2/3 flex flex-col">
      <Card className="p-4 border-b font-semibold">{profile.name}</Card>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded-md max-w-md ${msg.sender === "me" ? "ml-auto bg-yellow-400 text-white" : "bg-white"}`}>
            {msg.text}
            <div className="text-xs text-right mt-1 text-gray-500">{msg.time}</div>
          </div>
        ))}
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  );
}
