import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Search, Edit, Send, Phone, Video, Info, ArrowLeft } from "lucide-react";

// Dummy data for chats
const chats = [
  {
    id: "1",
    username: "sarah_designs",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "That looks amazing! Can you send me more photos?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 2,
  },
  {
    id: "2",
    username: "travel_addict",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Where are you planning to go next?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: 0,
  },
  {
    id: "3",
    username: "photo_master",
    avatar: "https://i.pravatar.cc/150?img=13",
    lastMessage: "Thanks for the feedback on my latest shot!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    unread: 0,
  },
  {
    id: "4",
    username: "city_explorer",
    avatar: "https://i.pravatar.cc/150?img=21",
    lastMessage: "Did you see my new post about the city skyline?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    unread: 1,
  },
];

// Dummy data for messages
const messages = [
  {
    id: "1",
    sender: "sarah_designs",
    content: "Hey! How are you doing?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isMe: false,
  },
  {
    id: "2",
    sender: "me",
    content: "I'm good, thanks! Just working on some new photos.",
    timestamp: new Date(Date.now() - 1000 * 60 * 28), // 28 minutes ago
    isMe: true,
  },
  {
    id: "3",
    sender: "sarah_designs",
    content: "That sounds exciting! Can I see them?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    isMe: false,
  },
  {
    id: "4",
    sender: "me",
    content: "Sure! Here's a preview of what I've been working on lately.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    isMe: true,
  },
  {
    id: "5",
    sender: "sarah_designs",
    content: "That looks amazing! Can you send me more photos?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isMe: false,
  },
];

export default function Messages() {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(chats[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  
  const filteredChats = chats.filter(chat => 
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedChatData = chats.find(chat => chat.id === selectedChat);
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // In a real app, this would send the message to the API
    console.log(`Sending message to ${selectedChatData?.username}: ${messageText}`);
    setMessageText("");
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Layout>
      <div className="h-[calc(100vh-132px)] md:h-[calc(100vh-72px)] flex overflow-hidden">
        {/* Chat list */}
        <div className="w-full md:w-80 border-r hidden md:block">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold">Messages</h2>
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-2">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <div 
                    key={chat.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      selectedChat === chat.id ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={chat.avatar} alt={chat.username} />
                        <AvatarFallback>{chat.username[0]}</AvatarFallback>
                      </Avatar>
                      {chat.unread > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between">
                        <p className="font-medium truncate">{chat.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(chat.timestamp, { addSuffix: false })}
                        </p>
                      </div>
                      <p className={`text-sm truncate ${chat.unread > 0 ? 'font-semibold' : 'text-muted-foreground'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Chat view */}
        <div className="flex-1 flex flex-col">
          {selectedChat && selectedChatData ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={handleGoBack} className="md:hidden">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedChatData.avatar} alt={selectedChatData.username} />
                    <AvatarFallback>{selectedChatData.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{selectedChatData.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!message.isMe && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={selectedChatData.avatar} alt={selectedChatData.username} />
                          <AvatarFallback>{selectedChatData.username[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div 
                          className={`px-4 py-2 rounded-2xl max-w-[75%] inline-block ${
                            message.isMe 
                              ? 'bg-primary text-primary-foreground rounded-tr-none' 
                              : 'bg-muted rounded-tl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t flex gap-2">
                <Input 
                  placeholder="Message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" onClick={handleGoBack} className="md:hidden mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="p-4 rounded-full bg-muted">
                  <Edit className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-muted-foreground mb-4">Send private messages to your friends and connections</p>
              <Button>Send Message</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
