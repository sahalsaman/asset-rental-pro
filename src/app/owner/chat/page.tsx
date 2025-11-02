"use client";

import {
  Search,
  Menu,
  MessageSquare,
  PlusCircle,
  Paperclip,
  Send,
  MoreVertical,
  Phone,
  Video,
  X,
} from "lucide-react";
import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import avathar from "../../../../public/logo green.png";
import { apiFetch } from "@/lib/api";
import localStorageServiceSelectedOptions from "@/utils/localStorageHandler";

// --- Types ---
interface Chat {
  _id: string;
  fullName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  _id: string;
  sender: "user" | "business";
  text: string;
  time: string;
}

interface Conversation {
  _id: string;
  fullName: string;
  avatar: string;
  messages: Message[];
}

// --- 1. ChatItem Component ---
const ChatItem = ({
  chat,
  isSelected,
  onSelect,
}: {
  chat: Chat;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => (
  <button
    onClick={() => onSelect(chat._id)}
    className={`flex items-center p-3 w-full hover:bg-gray-100 transition duration-150 border-b 
      ${isSelected ? "bg-green-50 border-l-4 border-green-600" : "bg-white"}`}
  >
    <div className="relative flex-shrink-0">
      <Image
        src={chat.avatar || avathar}
        alt={chat.fullName}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
    </div>

    <div className="ml-3 flex-grow text-left truncate">
      <p className="text-sm font-semibold text-gray-800 truncate">{chat.fullName}</p>
      <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
    </div>

    <div className="ml-2 flex flex-col items-end flex-shrink-0">
      <span className="text-xs text-gray-400">{chat.time}</span>
      {chat.unread > 0 && (
        <span className="text-xs font-bold text-white bg-green-600 rounded-full w-5 h-5 flex items-center justify-center mt-1">
          {chat.unread}
        </span>
      )}
    </div>
  </button>
);

// --- 2. ChatList Component (Left Sidebar) ---
const ChatList = ({
  conversations,
  selectedChatId,
  onSelectChat,
}: {
  conversations: Chat[];
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}) => (
  <div className="flex flex-col overflow-y-auto h-full space-y-1 p-2">
    {conversations.map((chat) => (
      <ChatItem
        key={chat._id}
        chat={chat}
        isSelected={chat._id === selectedChatId}
        onSelect={onSelectChat}
      />
    ))}
  </div>
);

// --- 3. MessageBubble Component ---
const MessageBubble = ({ message }: { message: Message }) => {
  const isBusiness = message.sender === "business";
  const alignment = isBusiness ? "justify-end" : "justify-start";
  const bubbleColor = isBusiness
    ? "bg-green-700 text-white"
    : "bg-white text-gray-800 border";
  const cornerClass = isBusiness ? "rounded-br-none" : "rounded-bl-none";

  return (
    <div className={`flex w-full mt-2 ${alignment}`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg ${bubbleColor} p-3 rounded-xl shadow-sm ${cornerClass}`}
      >
        <p className="text-sm">{message.text}</p>
        <span
          className={`text-xs mt-1 block ${
            isBusiness ? "text-green-200" : "text-gray-500"
          } text-right`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
};

// --- 4. ChatWindow Component ---
const ChatWindow = ({ conversation }: { conversation: Conversation }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;

    console.log("Sending message:", messageInput, "to chat:", conversation._id);
    setMessageInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 w-full p-4 border-b bg-gray-50">
        <div className="flex items-center">
          <Image
            src={conversation.avatar || avathar}
            alt={conversation.fullName}
            width={40}
            height={40}
            className="rounded-full object-cover mr-3"
          />
          <div>
            <p className="text-lg font-bold text-gray-800">{conversation.fullName}</p>
            <p className="text-xs text-green-600">Active - Agent: John Doe</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-green-700" title="Voice Call">
            <Phone className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-green-700" title="Video Call">
            <Video className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-green-700" title="More Options">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex flex-col flex-grow overflow-y-auto p-6 bg-gray-100">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-green-700"
            title="Attach File"
          >
            <Paperclip className="w-6 h-6" />
          </button>

          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-grow py-3 px-4 bg-gray-100 border rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
          />

          <button
            type="submit"
            className="p-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition duration-150"
            title="Send Message"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 5. Main WhatsappInboxPage Component ---
export default function WhatsappInboxPage() {
  const current_property = localStorageServiceSelectedOptions.getItem()?.property;
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookings, setBookings] = useState<Chat[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await apiFetch(`/api/booking?propertyId=${current_property?._id}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const getChat = async (id: string) => {
    try {
      const res = await apiFetch(`/api/chat/conversation`);
      const data = await res.json();
      setSelectedConversation(data);
    } catch (err) {
      console.error("Failed to fetch chat:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [current_property?._id]);

  const showChatList = !selectedChatId || mobileMenuOpen;

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-hidden">
        {/* Chat List */}
        <div
          className={`flex-col flex-shrink-0 bg-white border-r border-gray-200 
          ${showChatList ? "w-full md:w-2/5 lg:w-1/4 flex" : "hidden md:flex md:w-2/5 lg:w-1/4"}`}
        >
          <div className="flex flex-row items-center justify-between h-16 w-full px-4 border-b">
            <h2 className="text-xl font-bold text-green-700">WhatsApp Inbox</h2>
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 hover:text-green-700" title="Start New Chat">
                <PlusCircle className="w-6 h-6" />
              </button>
              <button
                className="md:hidden text-gray-500 hover:text-green-700"
                onClick={() => setMobileMenuOpen(false)}
                title="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
              <button className="hidden md:block text-gray-500 hover:text-green-700" title="Settings">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-3 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full py-2 pl-10 pr-4 border rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <ChatList
            conversations={bookings}
            selectedChatId={selectedChatId}
            onSelectChat={(id) => {
              setSelectedChatId(id);
              setMobileMenuOpen(false);
              getChat(id);
            }}
          />
        </div>

        {/* Chat Window */}
        <div
          className={`flex flex-col flex-auto h-full p-0 
          ${selectedChatId && !mobileMenuOpen ? "w-full flex" : "hidden md:flex"}`}
        >
          {selectedConversation ? (
            <ChatWindow conversation={selectedConversation} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-xl flex-col bg-gray-100">
              <MessageSquare className="w-10 h-10 mb-3 text-green-600" />
              <p>Select a chat or start a new conversation.</p>
              <button
                className="md:hidden mt-4 text-green-700 font-semibold"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="inline w-5 h-5 mr-1" /> View Chats
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
