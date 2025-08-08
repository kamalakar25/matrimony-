import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Heart, MessageSquare, Users, Check, Trash2 } from "lucide-react";
import Header from "@/components/Header";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "interest",
      title: "New Interest Received",
      message: "Ananya K. showed interest in your profile",
      time: "2 hours ago",
      read: false,
      icon: Heart
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "You have a new message from Divya N.",
      time: "5 hours ago",
      read: false,
      icon: MessageSquare
    },
    {
      id: 3,
      type: "match",
      title: "New Matches Found",
      message: "3 new profiles match your preferences",
      time: "1 day ago",
      read: false,
      icon: Users
    },
    {
      id: 4,
      type: "interest",
      title: "Interest Accepted",
      message: "Priya S. accepted your interest request",
      time: "2 days ago",
      read: true,
      icon: Heart
    },
    {
      id: 5,
      type: "system",
      title: "Profile View",
      message: "Your profile was viewed 5 times today",
      time: "3 days ago",
      read: true,
      icon: Bell
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string, read: boolean) => {
    if (read) return "text-gray-500";
    
    switch (type) {
      case "interest": return "text-red-500";
      case "message": return "text-blue-500";
      case "match": return "text-green-500";
      default: return "text-yellow-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "You're all caught up!"}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              variant="outline" 
              className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
            >
              <Check size={16} className="mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            
            return (
              <Card 
                key={notification.id} 
                className={`border-yellow-200 hover:shadow-md transition-shadow ${
                  !notification.read ? 'bg-yellow-50' : 'bg-white'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full bg-white ${getNotificationColor(notification.type, notification.read)}`}>
                      <IconComponent size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-sm text-gray-500">{notification.time}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="text-yellow-600 hover:bg-yellow-100"
                            >
                              <Check size={16} />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <Card className="border-yellow-200">
            <CardContent className="p-12 text-center">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications yet</h3>
              <p className="text-gray-500">When you receive interests, messages, or matches, they'll appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;