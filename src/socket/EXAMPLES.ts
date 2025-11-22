/**
 * ═══════════════════════════════════════════════════════════════
 * 🎓 SOCKET.IO EXAMPLES FOR BEGINNERS
 * ═══════════════════════════════════════════════════════════════
 *
 * This file contains practical examples to help you understand
 * Socket.IO step by step. Read through each example and try
 * implementing them yourself!
 */

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 1: Basic Connection (Client Side)
// ═══════════════════════════════════════════════════════════════

/*
// In your React/Next.js frontend:

import { io } from "socket.io-client";

// Step 1: Connect to server
const socket = io("http://localhost:3000", {
  auth: {
    token: "your-jwt-token-here"  // Get this from your auth context
  }
});

// Step 2: Listen for connection
socket.on("connect", () => {
  console.log("✅ Connected! Socket ID:", socket.id);
});

// Step 3: Listen for confirmation from server
socket.on("connected", (data) => {
  console.log("Server confirmed:", data);
  // Output: { userId: "123", socketId: "abc..." }
});

// Step 4: Handle connection errors
socket.on("connect_error", (error) => {
  console.error("❌ Connection failed:", error.message);
});

// Step 5: Handle disconnection
socket.on("disconnect", (reason) => {
  console.log("🔌 Disconnected:", reason);
});
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 2: Sending Messages (Client → Server)
// ═══════════════════════════════════════════════════════════════

/*
// In your chat component:

function sendMessage(conversationId, messageText) {
  // Emit "message:send" event to server
  socket.emit("message:send", {
    conversationId: conversationId,
    content: messageText,
    type: "text"
  });
  
  console.log("📤 Message sent:", messageText);
}

// Usage:
sendMessage("chat-room-123", "Hello everyone!");
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 3: Receiving Messages (Server → Client)
// ═══════════════════════════════════════════════════════════════

/*
// In your chat component:

function setupMessageListener() {
  // Listen for new messages from server
  socket.on("message:new", (message) => {
    console.log("📥 New message received:", message);
    
    // Add message to your chat UI
    // message will look like:
    // {
    //   id: "msg_123",
    //   conversationId: "chat-room-123",
    //   senderId: "user_456",
    //   content: "Hello everyone!",
    //   type: "text",
    //   timestamp: "2025-11-21T10:30:00Z"
    // }
    
    // Update your React state to show the new message
    setMessages(prev => [...prev, message]);
  });
}

// Call this when component mounts:
useEffect(() => {
  setupMessageListener();
  
  // Cleanup when component unmounts
  return () => {
    socket.off("message:new");
  };
}, []);
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 4: Joining a Conversation Room
// ═══════════════════════════════════════════════════════════════

/*
// IMPORTANT: You must join a room to receive messages in that room!

function joinConversation(conversationId) {
  // Tell server you want to join this room
  socket.emit("conversation:join", conversationId);
  
  console.log("🚪 Joined conversation:", conversationId);
}

function leaveConversation(conversationId) {
  // Tell server you're leaving this room
  socket.emit("conversation:leave", conversationId);
  
  console.log("🚪 Left conversation:", conversationId);
}

// Usage in your chat app:
// When user opens a chat:
joinConversation("chat-room-123");

// When user closes chat or navigates away:
leaveConversation("chat-room-123");
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 5: Typing Indicators
// ═══════════════════════════════════════════════════════════════

/*
// In your chat input component:

let typingTimeout;

function handleInputChange(event, conversationId) {
  const text = event.target.value;
  
  // User started typing
  socket.emit("typing:start", { conversationId });
  
  // Clear previous timeout
  clearTimeout(typingTimeout);
  
  // Stop typing after 3 seconds of no input
  typingTimeout = setTimeout(() => {
    socket.emit("typing:stop", { conversationId });
  }, 3000);
}

// Listen for others typing
socket.on("typing:start", (data) => {
  console.log(`User ${data.userId} is typing in ${data.conversationId}`);
  // Show "User is typing..." indicator in UI
  setTypingUsers(prev => [...prev, data.userId]);
});

socket.on("typing:stop", (data) => {
  console.log(`User ${data.userId} stopped typing`);
  // Hide typing indicator
  setTypingUsers(prev => prev.filter(id => id !== data.userId));
});
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 6: Online/Offline Status
// ═══════════════════════════════════════════════════════════════

/*
// Track which users are online

function setupPresenceListeners() {
  // User came online
  socket.on("user:online", (data) => {
    console.log(`✅ User ${data.userId} is now online`);
    
    // Update UI to show green dot next to user
    setOnlineUsers(prev => new Set([...prev, data.userId]));
  });
  
  // User went offline
  socket.on("user:offline", (data) => {
    console.log(`❌ User ${data.userId} is now offline`);
    
    // Update UI to show gray dot next to user
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(data.userId);
      return newSet;
    });
  });
}

// Update your own status
function updateMyStatus(status) {
  socket.emit("user:status", status);
  // status can be: "online", "away", "busy", "offline"
}
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 7: Read Receipts
// ═══════════════════════════════════════════════════════════════

/*
// Mark message as read when user views it

function markMessageAsRead(messageId) {
  socket.emit("message:read", { messageId });
  console.log("✅ Marked message as read:", messageId);
}

// Listen for read receipts
socket.on("message:read", (data) => {
  console.log(`Message ${data.messageId} was read`);
  
  // Update UI to show double checkmark
  setMessages(prev => prev.map(msg => 
    msg.id === data.messageId 
      ? { ...msg, status: "read" }
      : msg
  ));
});
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 8: Complete React Hook for Socket
// ═══════════════════════════════════════════════════════════════

/*
// Create a custom hook: hooks/useSocket.ts

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(token: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Create socket connection
    const newSocket = io("http://localhost:3000", {
      auth: { token }
    });
    
    // Setup event listeners
    newSocket.on("connect", () => {
      console.log("✅ Connected");
      setIsConnected(true);
    });
    
    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected");
      setIsConnected(false);
    });
    
    newSocket.on("connected", (data) => {
      console.log("Server confirmed:", data);
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [token]);
  
  return { socket, isConnected };
}

// Usage in component:
function ChatComponent() {
  const { token } = useAuth(); // Get JWT token from auth context
  const { socket, isConnected } = useSocket(token);
  
  useEffect(() => {
    if (!socket) return;
    
    // Setup message listener
    socket.on("message:new", (message) => {
      console.log("New message:", message);
    });
    
    return () => {
      socket.off("message:new");
    };
  }, [socket]);
  
  function sendMessage(text: string) {
    if (!socket) return;
    
    socket.emit("message:send", {
      conversationId: "chat-123",
      content: text,
      type: "text"
    });
  }
  
  return (
    <div>
      <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      {/* Your chat UI here *\/}
    </div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 9: Error Handling
// ═══════════════════════════════════════════════════════════════

/*
// Always listen for errors!

socket.on("error", (error) => {
  console.error("Socket error:", error);
  
  // Show error to user
  toast.error(error.message);
  
  // Handle specific errors
  if (error.code === "AUTHENTICATION_ERROR") {
    // Redirect to login
    router.push("/login");
  }
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
  
  if (error.message.includes("token expired")) {
    // Refresh token and reconnect
    refreshAuthToken().then(() => {
      socket.connect();
    });
  }
});
*/

// ═══════════════════════════════════════════════════════════════
// EXAMPLE 10: Testing in Browser Console
// ═══════════════════════════════════════════════════════════════

/*
// Open browser console (F12) and paste this:

// 1. Load Socket.IO client library
var script = document.createElement('script');
script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
document.body.appendChild(script);

// 2. Wait a second for library to load, then:
var testSocket = io('http://localhost:3000', {
  auth: { token: 'paste-your-jwt-token-here' }
});

// 3. Test connection
testSocket.on('connect', () => {
  console.log('✅ Test connection successful!', testSocket.id);
});

testSocket.on('connected', (data) => {
  console.log('Server confirmed:', data);
});

// 4. Test sending a message
testSocket.emit('message:send', {
  conversationId: 'test-room',
  content: 'Hello from console!',
  type: 'text'
});

// 5. Listen for responses
testSocket.on('message:new', (msg) => {
  console.log('📥 Received:', msg);
});

// 6. Test joining a room
testSocket.emit('conversation:join', 'test-room');

// 7. Check connection status
console.log('Connected:', testSocket.connected);
console.log('Socket ID:', testSocket.id);
*/

// ═══════════════════════════════════════════════════════════════
// 🎯 COMMON MISTAKES TO AVOID
// ═══════════════════════════════════════════════════════════════

/*
❌ MISTAKE 1: Forgetting to join rooms
socket.emit("message:send", { ... });  // Won't receive messages!

✅ CORRECT:
socket.emit("conversation:join", "room-123");  // Join first!
socket.emit("message:send", { ... });         // Then send

─────────────────────────────────────────────────────────────────

❌ MISTAKE 2: Not cleaning up listeners
useEffect(() => {
  socket.on("message:new", handler);
  // Missing cleanup!
}, []);

✅ CORRECT:
useEffect(() => {
  socket.on("message:new", handler);
  return () => {
    socket.off("message:new", handler);  // Always cleanup!
  };
}, []);

─────────────────────────────────────────────────────────────────

❌ MISTAKE 3: Creating multiple socket connections
function Component() {
  const socket = io("http://localhost:3000");  // Creates new socket on every render!
  return <div>...</div>;
}

✅ CORRECT:
function Component() {
  const [socket] = useState(() => io("http://localhost:3000"));  // Only once
  
  useEffect(() => {
    return () => socket.close();  // Cleanup on unmount
  }, []);
  
  return <div>...</div>;
}

─────────────────────────────────────────────────────────────────

❌ MISTAKE 4: Wrong event names (typos)
socket.on("mesage:new", handler);  // Typo! Won't work

✅ CORRECT:
import { SOCKET_EVENTS } from "./types";
socket.on(SOCKET_EVENTS.MESSAGE_NEW, handler);  // TypeScript catches typos!

─────────────────────────────────────────────────────────────────

❌ MISTAKE 5: Not handling disconnections
// What if connection drops?

✅ CORRECT:
socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
  
  if (reason === "io server disconnect") {
    // Server kicked us out, manually reconnect
    socket.connect();
  }
  // "io client disconnect" = we disconnected on purpose
  // "ping timeout" = connection lost, will auto-reconnect
});
*/

// ═══════════════════════════════════════════════════════════════
// 🚀 NEXT STEPS
// ═══════════════════════════════════════════════════════════════

/*
1. ✅ Read the BEGINNER_GUIDE.md file
2. ✅ Test connection in browser console (Example 10)
3. ✅ Create useSocket hook (Example 8)
4. ✅ Implement basic messaging (Examples 2 & 3)
5. ✅ Add typing indicators (Example 5)
6. ✅ Add online status (Example 6)
7. ✅ Add read receipts (Example 7)
8. ✅ Handle errors properly (Example 9)

Good luck! 🍀
*/

export {}; // Makes this a module
