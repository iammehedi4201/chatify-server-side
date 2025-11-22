import { getIO } from "./socket.config";
import { SOCKET_EVENTS, TypedSocket } from "./socket.types";

/**
 * Online users tracking
 * Maps userId to Set of socketIds (supports multiple devices/tabs)
 */
const onlineUsers = new Map<string, Set<string>>();

/**
 * Get all online user IDs
 */
export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers.keys());
};

/**
 * Get socket IDs for a specific user
 */
export const getUserSockets = (userId: string): string[] => {
  const sockets = onlineUsers.get(userId);
  return sockets ? Array.from(sockets) : [];
};

/**
 * Check if user is online
 */
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId) && (onlineUsers.get(userId)?.size ?? 0) > 0;
};

/**
 * Emit event to specific user (all their connected devices)
 */
// export const emitToUser = (userId: string, event: string, data: unknown) => {
//   const io = getIO();
//   const userSockets = getUserSockets(userId);

//   userSockets.forEach((socketId) => {
//     io.to(socketId).emit(event, data);
//   });
// };

/**
 * Handle socket connection
 */
export const handleConnection = (socket: TypedSocket) => {
  //   const userId = socket.data.userId;

  //   if (!userId) {
  //     console.error("Socket connected without userId");
  //     socket.disconnect();
  //     return;
  //   }

  // Add user to online users
  //   if (!onlineUsers.has(userId)) {
  //     onlineUsers.set(userId, new Set());
  //   }
  //   onlineUsers.get(userId)!.add(socket.id);

  const io = getIO();
  socket?.on("custom:event", (data: { text?: string }) => {
    console.log("Received custom_event with data:", data?.text);
    // io?.emit("receive:message", { text: data?.text });
    // socket.broadcast.emit("receive:message", { text: data?.text });
    // Handle the event as needed
  });

  // Emit connected event to the user
  //   socket.emit(SOCKET_EVENTS.CONNECTED, {
  //     userId,
  //     socketId: socket.id,
  //   });

  // Broadcast user online status to others
  //   socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

  // Register event handlers
  //   registerMessageHandlers(socket);
  //   registerTypingHandlers(socket);
  //   registerConversationHandlers(socket);
  //   registerUserHandlers(socket);

  // Handle disconnection
  socket.on(SOCKET_EVENTS.DISCONNECT, () => handleDisconnect(socket));
};

/**
 * Handle socket disconnection
 */
const handleDisconnect = (socket: TypedSocket) => {
  const userId = socket.data.userId;

  if (userId) {
    const userSockets = onlineUsers.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);

      // If user has no more connections, mark as offline
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);
        socket.broadcast.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
        console.log(`❌ User offline: ${userId}`);
      } else {
        console.log(
          `🔌 Socket disconnected: ${socket.id} (user ${userId} still has ${userSockets.size} connection(s))`,
        );
      }
    }
  }

  console.log(`Socket disconnected: ${socket.id}`);
};

/**
 * Register message-related event handlers
 */
const registerMessageHandlers = (socket: TypedSocket) => {
  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async (data) => {
    try {
      const userId = socket.data.userId;
      if (!userId) return;

      console.log(`Message from ${userId}:`, data);

      // TODO: Save message to database
      // const message = await MessageService.create({
      //   senderId: userId,
      //   conversationId: data.conversationId,
      //   content: data.content,
      //   type: data.type || "text",
      // });

      // For now, broadcast to conversation participants
      // TODO: Get conversation participants from database
      // const participants = await getConversationParticipants(data.conversationId);

      // Generate temporary message ID (replace with actual DB ID after saving)
      const tempMessageId = `msg_${Date.now()}_${userId}`;

      // Emit to all participants (example)
      socket.to(data.conversationId).emit(SOCKET_EVENTS.MESSAGE_NEW, {
        // ...message,
        id: tempMessageId,
        conversationId: data.conversationId,
        content: data.content,
        type: data.type || "text",
        senderId: userId,
        timestamp: new Date(),
        status: "sent",
      });

      // Confirm delivery to sender
      socket.emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
        messageId: "temp-id", // TODO: use actual message ID
      });
    } catch (error) {
      console.error("Error handling message:send:", error);
      socket.emit(SOCKET_EVENTS.ERROR, {
        message: "Failed to send message",
        code: "MESSAGE_SEND_ERROR",
      });
    }
  });

  socket.on(SOCKET_EVENTS.MESSAGE_READ, async (data) => {
    try {
      // TODO: Update message read status in database
      // await MessageService.markAsRead(data.messageId, socket.data.userId);

      // Notify sender that message was read
      socket.broadcast.emit(SOCKET_EVENTS.MESSAGE_READ, data);
    } catch (error) {
      console.error("Error handling message:read:", error);
    }
  });
};

/**
 * Register typing indicator handlers
 */
const registerTypingHandlers = (socket: TypedSocket) => {
  socket.on(SOCKET_EVENTS.TYPING_START, (data) => {
    const userId = socket.data.userId;
    if (!userId) return;

    // Broadcast to conversation participants
    socket.to(data.conversationId).emit(SOCKET_EVENTS.TYPING_START, {
      userId,
      conversationId: data.conversationId,
    });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, (data) => {
    const userId = socket.data.userId;
    if (!userId) return;

    socket.to(data.conversationId).emit(SOCKET_EVENTS.TYPING_STOP, {
      userId,
      conversationId: data.conversationId,
    });
  });
};

/**
 * Register conversation-related handlers
 */
const registerConversationHandlers = (socket: TypedSocket) => {
  socket.on(SOCKET_EVENTS.CONVERSATION_JOIN, (conversationId) => {
    socket.join(conversationId);
    console.log(
      `User ${socket.data.userId} joined conversation ${conversationId}`,
    );
  });

  socket.on(SOCKET_EVENTS.CONVERSATION_LEAVE, (conversationId) => {
    socket.leave(conversationId);
    console.log(
      `User ${socket.data.userId} left conversation ${conversationId}`,
    );
  });
};

/**
 * Register user status handlers
 */
const registerUserHandlers = (socket: TypedSocket) => {
  socket.on(SOCKET_EVENTS.USER_STATUS, (status) => {
    const userId = socket.data.userId;
    if (!userId) return;

    console.log(`User ${userId} status: ${status}`);

    // TODO: Update user status in database
    // await UserService.updateStatus(userId, status);

    // Broadcast status to all connected clients
    socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, { userId, status });
  });
};
