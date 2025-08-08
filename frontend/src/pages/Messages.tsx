import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Heart,
  Mail,
} from "lucide-react";
import Header from "@/components/Header";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Priya Sharma",
      lastMessage: "Thank you for your interest!",
      time: "2:30 PM",
      unread: 2,
      avatar:
        "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&w=100",
      online: true,
    },
    {
      id: 2,
      name: "Kavya Patel",
      lastMessage: "Would love to connect with you",
      time: "1:15 PM",
      unread: 0,
      avatar:
        "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&w=100",
      online: false,
    },
    {
      id: 3,
      name: "Meera Singh",
      lastMessage: "Hi, nice to meet you!",
      time: "12:45 PM",
      unread: 1,
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=100",
      online: true,
    },
  ];

  const [messagesPerUser, setMessagesPerUser] = useState({
    1: [
      {
        id: 1,
        text: "Hi! I came across your profile and found it very interesting.",
        sender: "them",
        time: "2:20 PM",
      },
      {
        id: 2,
        text: "Thank you! I'd love to know more about you too.",
        sender: "me",
        time: "2:25 PM",
      },
      {
        id: 3,
        text: "Thank you for your interest!",
        sender: "them",
        time: "2:30 PM",
      },
    ],
    2: [
      {
        id: 1,
        text: "Would love to connect with you",
        sender: "them",
        time: "1:15 PM",
      },
    ],
    3: [
      {
        id: 1,
        text: "Hi, nice to meet you!",
        sender: "them",
        time: "12:45 PM",
      },
    ],
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessagesPerUser((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));

    setNewMessage("");
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversations.find((c) => c.id === selectedChat);
  const selectedMessages = messagesPerUser[selectedChat] || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 w-full px-2 sm:px-4 py-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 md:h-[calc(100vh-280px)]">
          {/* Sidebar */}
          <Card className="md:w-1/3 w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Messages</span>
                <Button size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-md bg-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    searchFocused ? "text-left" : "text-center"
                  }`}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={(e) => !e.target.value && setSearchFocused(false)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 overflow-y-auto max-h-[60vh] md:max-h-[calc(100vh-300px)]">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                      selectedChat === conversation.id
                        ? "bg-yellow-50 border-l-4 border-yellow-500"
                        : ""
                    }`}
                    onClick={() => setSelectedChat(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conversation.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="md:w-2/3 w-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedConversation?.avatar}
                    alt={selectedConversation?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedConversation?.name}
                    </h3>
                    {selectedConversation?.online && (
                      <p className="text-sm text-green-600">Online</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "me"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "me"
                          ? "text-yellow-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <footer className="bg-[#101626] text-white p-6 sm:p-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-yellow-500 p-2 rounded-full">
                <Heart className="text-white w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Public Matrimony</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              India's most trusted matrimonial platform connecting hearts across
              the globe. With over 5 million verified profiles and 50,000+
              success stories, we help you find your perfect life partner with
              complete privacy and security.
            </p>
          </div>
          <div className="text-sm sm:text-base space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-yellow-500" />
              <span>+91 80-4567-8900</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-yellow-500" />
              <span>support@publicmatrimony.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Messages;
