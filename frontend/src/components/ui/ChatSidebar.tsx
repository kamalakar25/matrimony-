import { useState } from "react";
import { Input } from "./input";
import { Avatar } from "./avatar";
import { Card } from "./card";

const profiles = [
  { id: "1", name: "Priya Sharma", message: "Thank you for your interest!", time: "2:30 PM" },
  { id: "2", name: "Kavya Patel", message: "Would love to connect with you", time: "1:15 PM" },
  { id: "3", name: "Meera Singh", message: "Hi, nice to meet you!", time: "12:45 PM" },
];

export default function ChatSidebar({ onSelectProfile, selectedProfile }) {
  const [search, setSearch] = useState("");

  const filtered = profiles.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-1/3 border-r p-4">
      <Input
        placeholder="Search conversations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      {filtered.map((profile) => (
        <Card
          key={profile.id}
          className={`flex items-center gap-3 p-3 mb-2 cursor-pointer ${selectedProfile?.id === profile.id ? "bg-yellow-100" : ""}`}
          onClick={() => onSelectProfile(profile)}
        >
          <Avatar />
          <div className="flex-1">
            <p className="font-semibold">{profile.name}</p>
            <p className="text-sm text-gray-500">{profile.message}</p>
          </div>
          <span className="text-xs">{profile.time}</span>
        </Card>
      ))}
    </div>
  );
}
