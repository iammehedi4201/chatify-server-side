# Socket.IO Implementation

## Overview

This backend implements a production-ready Socket.IO server for real-time chat functionality with the following features:

- ✅ JWT-based authentication
- ✅ TypeScript support with strict typing
- ✅ Rate limiting to prevent abuse
- ✅ Multiple device support (same user, multiple connections)
- ✅ Conversation rooms
- ✅ Typing indicators
- ✅ User presence (online/offline status)
- ✅ Message delivery and read receipts
- ✅ Error handling and logging

## Architecture

### Files Structure

```
src/socket/
├── index.ts                 # Main export file
├── socket.config.ts         # Socket.IO server initialization
├── socket.types.ts          # TypeScript types and interfaces
├── socket.middleware.ts     # Authentication and rate limiting
└── socket.handlers.ts       # Event handlers and business logic
```

### Key Components

#### 1. **socket.config.ts**

- Initializes Socket.IO server
- Configures CORS, transports, and performance options
- Provides helper functions: `getIO()`, `closeSocket()`, `getSocketStats()`

#### 2. **socket.types.ts**

- Defines TypeScript interfaces for type-safe events
- Server-to-Client events
- Client-to-Server events
- Socket event constants

#### 3. **socket.middleware.ts**

- **Authentication**: Verifies JWT tokens from handshake
- **Rate Limiting**: Prevents spam (default: 10 events/second)
- **Logging**: Logs connection attempts with client info

#### 4. **socket.handlers.ts**

- **Connection Management**: Tracks online users and multiple devices
- **Message Handlers**: Send, deliver, read messages
- **Typing Indicators**: Start/stop typing events
- **Conversation Handlers**: Join/leave conversation rooms
- **User Status**: Online/offline/away/busy status updates

## Client Connection

### Frontend Setup (React/Next.js)

```typescript
import { io, Socket } from "socket.io-client";

const token = "your-jwt-token"; // Get from auth context

const socket: Socket = io("http://localhost:3000", {
  auth: {
    token: token,
  },
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on("connect", () => {
  console.log("Connected to socket server:", socket.id);
});

socket.on("connected", (data) => {
  console.log("Authenticated:", data);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});
```

## Socket Events

### Client → Server Events

| Event                | Payload                                             | Description                       |
| -------------------- | --------------------------------------------------- | --------------------------------- |
| `authenticate`       | `{ token: string }`                                 | Authenticate user (via handshake) |
| `message:send`       | `{ conversationId, content, type? }`                | Send a new message                |
| `message:read`       | `{ messageId }`                                     | Mark message as read              |
| `typing:start`       | `{ conversationId }`                                | Start typing indicator            |
| `typing:stop`        | `{ conversationId }`                                | Stop typing indicator             |
| `conversation:join`  | `conversationId: string`                            | Join a conversation room          |
| `conversation:leave` | `conversationId: string`                            | Leave a conversation room         |
| `user:status`        | `status: "online" \| "away" \| "busy" \| "offline"` | Update user status                |

### Server → Client Events

| Event                  | Payload                      | Description                    |
| ---------------------- | ---------------------------- | ------------------------------ |
| `connected`            | `{ userId, socketId }`       | Connection confirmed           |
| `message:new`          | `IMessage`                   | New message received           |
| `message:delivered`    | `{ messageId }`              | Message delivered confirmation |
| `message:read`         | `{ messageId }`              | Message read by recipient      |
| `typing:start`         | `{ userId, conversationId }` | User started typing            |
| `typing:stop`          | `{ userId, conversationId }` | User stopped typing            |
| `user:online`          | `{ userId, status? }`        | User came online               |
| `user:offline`         | `{ userId }`                 | User went offline              |
| `conversation:updated` | `IConversation`              | Conversation data updated      |
| `conversation:deleted` | `{ conversationId }`         | Conversation deleted           |
| `notification:new`     | `INotification`              | New notification               |
| `error`                | `{ message, code? }`         | Error occurred                 |

## Usage Examples

### 1. Sending a Message

**Client:**

```typescript
socket.emit("message:send", {
  conversationId: "conv-123",
  content: "Hello, world!",
  type: "text",
});
```

**Server broadcasts to conversation participants:**

```typescript
socket.to(conversationId).emit("message:new", {
  id: "msg-456",
  conversationId: "conv-123",
  senderId: "user-789",
  content: "Hello, world!",
  type: "text",
  timestamp: new Date(),
});
```

### 2. Typing Indicators

**Client:**

```typescript
// Start typing
socket.emit("typing:start", { conversationId: "conv-123" });

// Stop typing (after 3 seconds of no input)
socket.emit("typing:stop", { conversationId: "conv-123" });
```

**Server broadcasts:**

```typescript
socket.on("typing:start", (data) => {
  // Other participants receive
  socket.to(data.conversationId).emit("typing:start", {
    userId: socket.data.userId,
    conversationId: data.conversationId,
  });
});
```

### 3. Joining a Conversation

**Client:**

```typescript
socket.emit("conversation:join", "conv-123");
```

This adds the socket to a Socket.IO room, enabling targeted broadcasts to conversation participants.

### 4. Online Status Tracking

```typescript
import { getOnlineUsers, isUserOnline } from "@/socket";

// Get all online users
const onlineUserIds = getOnlineUsers();

// Check if specific user is online
const isOnline = isUserOnline("user-123");
```

### 5. Emit to Specific User

```typescript
import { emitToUser } from "@/socket";

// Send notification to specific user (all their devices)
emitToUser("user-123", "notification:new", {
  id: "notif-456",
  message: "You have a new message",
  type: "message",
  createdAt: new Date(),
});
```

## Configuration

### Environment Variables

Add to your `.env` file:

```bash
# Already configured
CLIENT_URL=http://localhost:3001
JWT_ACCESS_SECRET_KEY=your-secret-key
```

### CORS Configuration

Update `socket.config.ts` if you need to allow multiple origins:

```typescript
cors: {
  origin: [ENV.CLIENT_URL, "http://localhost:3001", "https://yourdomain.com"],
  credentials: true,
  methods: ["GET", "POST"],
}
```

## Testing

### Health Check Endpoint

```bash
curl http://localhost:3000/api/socket/health
```

Response:

```json
{
  "status": "ok",
  "socket": {
    "initialized": true,
    "connected": 5,
    "rooms": 12
  }
}
```

### Testing with Postman/Socket.IO Client

1. Connect to `http://localhost:3000`
2. Add authentication in connection options:
   ```json
   {
     "auth": {
       "token": "your-jwt-token"
     }
   }
   ```
3. Listen for `connected` event
4. Emit test events

## Integration with Database

The current implementation includes TODO comments where you should integrate with your database services:

```typescript
// In socket.handlers.ts

// TODO: Save message to database
// const message = await MessageService.create({ ... });

// TODO: Get conversation participants
// const participants = await getConversationParticipants(conversationId);

// TODO: Update message read status
// await MessageService.markAsRead(messageId, userId);

// TODO: Update user status in database
// await UserService.updateStatus(userId, status);
```

## Security Best Practices

1. **JWT Authentication**: All connections require valid JWT token
2. **Rate Limiting**: 10 events per second per socket (configurable)
3. **Input Validation**: Validate all incoming event data
4. **Room Authorization**: Verify user has access to conversation before joining
5. **Message Size Limits**: Max 1MB per message (configured in socket.config.ts)
6. **CORS**: Only allowed origins can connect

## Performance Considerations

- **Multiple Devices**: Same user can connect from multiple devices/tabs
- **Message Compression**: Enabled for messages > 1KB
- **Ping/Pong**: Keep-alive every 25 seconds, timeout after 60 seconds
- **Transports**: Supports both WebSocket and polling (with upgrade)

## Deployment Notes

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production `CLIENT_URL` in environment
- [ ] Enable sticky sessions if using multiple servers
- [ ] Consider using Redis adapter for horizontal scaling
- [ ] Monitor socket connections and memory usage
- [ ] Set up logging (winston/pino)
- [ ] Configure firewall for WebSocket traffic

### Scaling with Redis

For multiple server instances:

```typescript
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

## Troubleshooting

### Connection Issues

1. **401 Authentication Error**: Check JWT token is valid and not expired
2. **CORS Error**: Verify `CLIENT_URL` matches your frontend origin
3. **Timeout**: Check firewall rules and network connectivity
4. **Transport Fallback**: Ensure both WebSocket and polling are allowed

### Debug Mode

Enable Socket.IO debug logs:

```bash
DEBUG=socket.io* npm run dev
```

## API Reference

### Helper Functions

```typescript
// Get Socket.IO instance
const io = getIO();

// Get online users
const users = getOnlineUsers(); // string[]

// Check if user is online
const online = isUserOnline(userId); // boolean

// Get user's socket IDs
const sockets = getUserSockets(userId); // string[]

// Emit to specific user
emitToUser(userId, "event:name", data);

// Get connection stats
const stats = getSocketStats(); // { connected, rooms }

// Close socket server
await closeSocket();
```

## Next Steps

1. Integrate with your Message, Conversation, and User models
2. Add database persistence for messages and status
3. Implement conversation participant authorization
4. Add file upload support for images/files
5. Implement message encryption (optional)
6. Add admin dashboard for monitoring connections
7. Set up Redis for scaling (if needed)

---

**Need help?** Check the inline comments in the socket files or refer to [Socket.IO documentation](https://socket.io/docs/v4/).
