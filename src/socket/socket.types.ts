import { Socket, Server as SocketIOServer } from "socket.io";

/**
 * 📋 BEGINNER'S NOTE: What are these interfaces?
 *
 * Interfaces are like "contracts" or "blueprints" in TypeScript.
 * They define what data should look like.
 *
 * Think of it like a form with specific fields that must be filled out.
 */

// ─────────────────────────────────────────────────────────────────
// 📦 DATA STRUCTURES (What our messages look like)
// ─────────────────────────────────────────────────────────────────

/**
 * IMessage - Defines what a chat message looks like
 *
 * Example message object:
 * {
 *   id: "msg_123",
 *   conversationId: "chat_456",
 *   senderId: "user_789",
 *   content: "Hello!",
 *   type: "text",
 *   timestamp: new Date(),
 *   status: "sent"
 * }
 */
export interface IMessage {
  id: string; // Unique ID for this message
  conversationId: string; // Which chat room/conversation this belongs to
  senderId: string; // Who sent this message
  content: string; // The actual message text
  type: "text" | "image" | "file"; // What kind of message (can only be one of these)
  timestamp: Date; // When was it sent
  status?: "sent" | "delivered" | "read"; // Optional: message status (? means optional)
}

/**
 * IConversation - Defines what a conversation/chat room looks like
 */
export interface IConversation {
  id: string; // Unique ID for this conversation
  participants: string[]; // Array of user IDs who are in this chat
  lastMessage?: IMessage; // Optional: the most recent message
  updatedAt: Date; // When was this conversation last active
}

/**
 * INotification - Defines what a notification looks like
 */
export interface INotification {
  id: string; // Unique ID for this notification
  userId: string; // Who should receive this notification
  type: string; // What kind of notification (e.g., "new_message", "friend_request")
  message: string; // The notification text
  data?: Record<string, unknown>; // Optional: extra data attached to notification
  read: boolean; // Has the user seen this notification?
  createdAt: Date; // When was it created
}

// ─────────────────────────────────────────────────────────────────
// 📤 SERVER → CLIENT EVENTS (What server can send to browsers)
// ─────────────────────────────────────────────────────────────────

/**
 * ServerToClientEvents
 *
 * BEGINNER'S NOTE: These are all the messages the SERVER can send TO the CLIENT
 *
 * Format: "event:name": (data) => void
 *
 * Example in code:
 * SERVER: io.emit("message:new", messageData);
 * CLIENT: socket.on("message:new", (messageData) => { ... });
 */
export interface ServerToClientEvents {
  // ──────────────────────────────────────────
  // Connection Events
  // ──────────────────────────────────────────

  /**
   * "connected" - Server confirms connection is established
   * Sent right after client connects successfully
   *
   * Usage:
   * socket.emit("connected", { userId: "123", socketId: "abc" });
   */
  connected: (data: { userId: string; socketId: string }) => void;

  // ──────────────────────────────────────────
  // Message Events
  // ──────────────────────────────────────────

  /**
   * "message:new" - A new message was sent in a conversation
   * Server broadcasts this when someone sends a message
   *
   * Usage:
   * socket.to(conversationId).emit("message:new", messageObject);
   */
  "message:new": (message: IMessage) => void;

  /**
   * "message:delivered" - Confirms message was delivered
   */
  "message:delivered": (data: { messageId: string }) => void;

  /**
   * "message:read" - Someone read a message
   */
  "message:read": (data: { messageId: string }) => void;

  // ──────────────────────────────────────────
  // Typing Indicators
  // ──────────────────────────────────────────

  /**
   * "typing:start" - User started typing
   * Shows "User is typing..." indicator
   */
  "typing:start": (data: { userId: string; conversationId: string }) => void;

  /**
   * "typing:stop" - User stopped typing
   * Hides the typing indicator
   */
  "typing:stop": (data: { userId: string; conversationId: string }) => void;

  // ──────────────────────────────────────────
  // User Presence (Online/Offline Status)
  // ──────────────────────────────────────────

  /**
   * "user:online" - User came online
   * Broadcast when someone connects
   */
  "user:online": (data: { userId: string; status?: string }) => void;

  /**
   * "user:offline" - User went offline
   * Broadcast when someone disconnects
   */
  "user:offline": (data: { userId: string }) => void;

  // ──────────────────────────────────────────
  // Conversation Events
  // ──────────────────────────────────────────

  /**
   * "conversation:updated" - Conversation data changed
   * Example: Name changed, participant added, etc.
   */
  "conversation:updated": (conversation: IConversation) => void;

  /**
   * "conversation:deleted" - A conversation was deleted
   */
  "conversation:deleted": (data: { conversationId: string }) => void;

  // ──────────────────────────────────────────
  // Notifications
  // ──────────────────────────────────────────

  /**
   * "notification:new" - New notification for user
   * Example: "You have a new message", "Friend request received"
   */
  "notification:new": (notification: INotification) => void;

  // ──────────────────────────────────────────
  // Errors
  // ──────────────────────────────────────────

  /**
   * "error" - Something went wrong
   * Server sends this when an error occurs
   */
  error: (error: { message: string; code?: string }) => void;

  "receive:message": (data: { text?: string }) => void;
}

// ─────────────────────────────────────────────────────────────────
// 📥 CLIENT → SERVER EVENTS (What browsers can send to server)
// ─────────────────────────────────────────────────────────────────

/**
 * ClientToServerEvents
 *
 * BEGINNER'S NOTE: These are all the messages the CLIENT can send TO the SERVER
 *
 * Example in code:
 * CLIENT: socket.emit("message:send", messageData);
 * SERVER: socket.on("message:send", (messageData) => { ... });
 */
export interface ClientToServerEvents {
  // ──────────────────────────────────────────
  // Authentication
  // ──────────────────────────────────────────

  /**
   * "authenticate" - Client sends JWT token to prove identity
   * NOTE: Usually done via handshake, not as separate event
   */
  authenticate: (token: string) => void;

  // ──────────────────────────────────────────
  // Messages
  // ──────────────────────────────────────────

  /**
   * "message:send" - Client wants to send a message
   *
   * Example usage on client:
   * socket.emit("message:send", {
   *   conversationId: "chat-123",
   *   content: "Hello everyone!",
   *   type: "text"
   * });
   */
  "message:send": (data: {
    conversationId: string;
    content: string;
    type?: "text" | "image" | "file"; // Optional, defaults to "text"
  }) => void;

  /**
   * "message:read" - Client marks a message as read
   */
  "message:read": (data: { messageId: string }) => void;

  // ──────────────────────────────────────────
  // Typing Indicators
  // ──────────────────────────────────────────

  /**
   * "typing:start" - Client started typing
   * Client should emit this when user types in chat box
   */
  "typing:start": (data: { conversationId: string }) => void;

  /**
   * "typing:stop" - Client stopped typing
   * Client should emit this after 3 seconds of no typing
   */
  "typing:stop": (data: { conversationId: string }) => void;

  // ──────────────────────────────────────────
  // Conversations (Chat Rooms)
  // ──────────────────────────────────────────

  /**
   * "conversation:join" - Join a conversation room
   *
   * IMPORTANT: Must join room before receiving messages!
   *
   * Think of it like entering a chat room - you won't hear
   * messages until you're inside the room.
   */
  "conversation:join": (conversationId: string) => void;

  /**
   * "conversation:leave" - Leave a conversation room
   * Stop receiving messages from this conversation
   */
  "conversation:leave": (conversationId: string) => void;

  // ──────────────────────────────────────────
  // User Presence
  // ──────────────────────────────────────────

  /**
   * "user:status" - Client updates their status
   * Example: "online", "away", "busy", "offline"
   */
  "user:status": (status: "online" | "away" | "busy" | "offline") => void;
  "custom:event": (data: { text?: string }) => void;
}

// ─────────────────────────────────────────────────────────────────
// 🔄 INTER-SERVER EVENTS (Communication between multiple servers)
// ─────────────────────────────────────────────────────────────────

/**
 * InterServerEvents
 *
 * BEGINNER'S NOTE: You can ignore this for now!
 * This is only needed if you have multiple server instances
 * (like in production with load balancers)
 */
export interface InterServerEvents {
  ping: () => void;
}

// ─────────────────────────────────────────────────────────────────
// 💾 SOCKET DATA (Extra info stored on each socket connection)
// ─────────────────────────────────────────────────────────────────

/**
 * SocketData
 *
 * BEGINNER'S NOTE: This is like a "backpack" for each socket connection
 * We can store user info here after authentication
 *
 * Access it with: socket.data.userId
 */
export interface SocketData {
  userId?: string; // The authenticated user's ID
  email?: string; // Their email
  role?: string; // Their role (admin, user, etc.)
}

// ─────────────────────────────────────────────────────────────────
// 🎯 TYPED SOCKET & SERVER (Putting it all together)
// ─────────────────────────────────────────────────────────────────

/**
 * TypedSocket
 *
 * This is a Socket with TypeScript types attached
 * It knows what events it can send and receive
 */
export type TypedSocket = Socket<
  ClientToServerEvents, // Events coming FROM client
  ServerToClientEvents, // Events going TO client
  InterServerEvents, // Server-to-server events
  SocketData // Extra data stored on socket
>;

/**
 * TypedServer
 *
 * This is the main Socket.IO server with types
 * Use this instead of plain "Server"
 */
export type TypedServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// ─────────────────────────────────────────────────────────────────
// 📌 EVENT CONSTANTS (Prevents typos in event names)
// ─────────────────────────────────────────────────────────────────

/**
 * SOCKET_EVENTS
 *
 * BEGINNER'S NOTE: Instead of typing "message:send" everywhere,
 * use SOCKET_EVENTS.MESSAGE_SEND
 *
 * Why? If you make a typo, TypeScript will catch it!
 *
 * Example:
 * ❌ socket.on("mesage:send", ...)  // Typo! Won't work
 * ✅ socket.on(SOCKET_EVENTS.MESSAGE_SEND, ...)  // TypeScript error if wrong
 */
export const SOCKET_EVENTS = {
  // Connection
  CONNECTION: "connection", // Built-in Socket.IO event
  DISCONNECT: "disconnect", // Built-in Socket.IO event
  AUTHENTICATE: "authenticate",
  CONNECTED: "connected",

  // Messages
  MESSAGE_SEND: "message:send",
  MESSAGE_NEW: "message:new",
  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_READ: "message:read",

  // Typing
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",

  // User status
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  USER_STATUS: "user:status",

  // Conversations
  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_LEAVE: "conversation:leave",
  CONVERSATION_UPDATED: "conversation:updated",
  CONVERSATION_DELETED: "conversation:deleted",

  // Notifications
  NOTIFICATION_NEW: "notification:new",

  // Errors
  ERROR: "error",
} as const; // "as const" makes these values unchangeable
