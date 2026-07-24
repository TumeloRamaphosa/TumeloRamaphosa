"use client";

import React, { useState } from "react";
import { DISCORD_SERVERS, DISCORD_BOT_CONFIG } from "@/lib/discord-config";

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

export default function DiscordIntegration() {
  const [selectedServer, setSelectedServer] = useState(DISCORD_SERVERS[0]);
  const [selectedChannel, setSelectedChannel] = useState(DISCORD_SERVERS[0].channels?.[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleServerSelect = (serverId: string) => {
    const server = DISCORD_SERVERS.find((s) => s.id === serverId);
    if (server) {
      setSelectedServer(server);
      setSelectedChannel(server.channels?.[0]);
    }
  };

  const handleChannelSelect = (channelId: string) => {
    const channel = selectedServer.channels?.find((c) => c.id === channelId);
    if (channel) {
      setSelectedChannel(channel);
      loadChannelMessages();
    }
  };

  const loadChannelMessages = () => {
    // Simulated message loading - in production, connect to Discord API
    const mockMessages: Message[] = [
      {
        id: "1",
        author: "Robusca",
        content: "War Room status: All systems online ✅",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        avatar: "🤖",
      },
      {
        id: "2",
        author: "OpenCode",
        content: "Deployed latest dark-factory updates",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        avatar: "💻",
      },
      {
        id: "3",
        author: "Naledi",
        content: "Content batch published: 15 posts across all channels",
        timestamp: new Date(Date.now() - 60000).toISOString(),
        avatar: "🎨",
      },
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: "You",
      content: messageInput,
      timestamp: new Date().toISOString(),
      avatar: "👤",
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Discord Integration
              </h1>
              <p className="text-gray-400 mt-1">Connected Command Centers & Agent Channels</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>{DISCORD_SERVERS.length} Servers Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>
                {DISCORD_SERVERS.reduce((acc, s) => acc + (s.channels?.length || 0), 0)} Channels
              </span>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Server List */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 px-4 py-3 border-b border-gray-700">
              <h2 className="font-semibold flex items-center gap-2">
                <span>🏢</span> Servers
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {DISCORD_SERVERS.map((server) => (
                <button
                  key={server.id}
                  onClick={() => handleServerSelect(server.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${
                    selectedServer.id === server.id
                      ? "bg-blue-600/40 border border-blue-500 shadow-lg shadow-blue-500/20"
                      : "hover:bg-gray-700/50 border border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{server.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{server.purpose}</div>
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            server.status === "online" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        ></span>
                        {server.members} members
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Channel List */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 px-4 py-3 border-b border-gray-700">
              <h2 className="font-semibold flex items-center gap-2">
                <span>#</span> Channels ({selectedServer.channels?.length || 0})
              </h2>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
              {selectedServer.channels?.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg mb-1 text-sm transition ${
                    selectedChannel?.id === channel.id
                      ? "bg-purple-600/40 border border-purple-500"
                      : "hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      {channel.type === "voice" ? "🔊" : "#"}
                    </span>
                    <div>
                      <div className="font-medium">{channel.name}</div>
                      {channel.topic && (
                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                          {channel.topic}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex flex-col">
            {/* Channel Header */}
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 px-4 py-3 border-b border-gray-700">
              <h2 className="font-semibold">
                {selectedChannel?.type === "voice" ? "🔊" : "#"} {selectedChannel?.name}
              </h2>
              <p className="text-xs text-gray-400 mt-1">{selectedChannel?.topic}</p>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto flex-1 p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-2xl mb-2">💬</p>
                    <p>No messages yet. Start chatting!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3 hover:bg-gray-700/20 p-2 rounded">
                    <div className="text-2xl flex-shrink-0">{msg.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{msg.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-100 text-sm break-words">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-700 p-4 bg-gray-900/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Send a message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium text-sm hover:from-blue-500 hover:to-purple-500 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Bot Status</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Connected</span>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Active Servers</div>
            <span className="font-medium text-lg">{DISCORD_SERVERS.filter((s) => s.status === "online").length}</span>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Total Members</div>
            <span className="font-medium text-lg">
              {DISCORD_SERVERS.reduce((acc, s) => acc + (s.members || 0), 0)}
            </span>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Last Sync</div>
            <span className="font-medium text-sm">Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
