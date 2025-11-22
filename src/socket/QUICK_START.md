# 🚀 Quick Start Guide - Your First Socket.IO App

This guide will get you up and running with Socket.IO in 5 minutes!

---

## Step 1: Start Your Server

```bash
# Make sure your .env file has these variables:
# PORT=3000
# JWT_ACCESS_SECRET_KEY=your-secret-key
# CLIENT_URL=http://localhost:3001
# MONGO_URI=your-mongodb-connection-string

# Start the development server
npm run dev
```

You should see:

```
✅ Socket.IO server initialized
🚀 Socket.IO initialized and ready for connections
Server running at http://localhost:3000
Socket.IO ready at ws://localhost:3000
```

---

## Step 2: Test Connection (Browser Console)

Open your browser console (press `F12`) and paste this code:

```javascript
// Load Socket.IO client library
var script = document.createElement("script");
script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
document.body.appendChild(script);

// Wait 2 seconds, then test connection
setTimeout(() => {
  // Replace 'YOUR_JWT_TOKEN' with an actual token from your auth system
  var socket = io("http://localhost:3000", {
    auth: {
      token: "YOUR_JWT_TOKEN", // ⚠️ REPLACE THIS!
    },
  });

  socket.on("connect", () => {
    console.log("✅ Connected! Socket ID:", socket.id);
  });

  socket.on("connected", (data) => {
    console.log("✅ Server confirmed connection:", data);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Connection failed:", error.message);
  });

  // Make socket available globally for testing
  window.testSocket = socket;
  console.log("Socket is now available as window.testSocket");
}, 2000);
```

### If you don't have a JWT token yet:

You can temporarily disable authentication for testing. Edit `src/socket/socket.config.ts`:

```typescript
// Comment out this line temporarily:
// io.use(authenticateSocket);

// Add this instead:
io.use((socket, next) => {
  socket.data.userId = "test-user-123"; // Fake user ID for testing
  next();
});
```

---

## Step 3: Send Your First Message

Once connected, in the browser console:

```javascript
// Join a test conversation room
window.testSocket.emit("conversation:join", "test-room-123");

// Send a test message
window.testSocket.emit("message:send", {
  conversationId: "test-room-123",
  content: "Hello, Socket.IO!",
  type: "text",
});

// Listen for messages
window.testSocket.on("message:new", (message) => {
  console.log("📥 New message received:", message);
});
```

---

## Step 4: Test Typing Indicators

```javascript
// Start typing
window.testSocket.emit("typing:start", {
  conversationId: "test-room-123",
});

// Stop typing
window.testSocket.emit("typing:stop", {
  conversationId: "test-room-123",
});

// Listen for others typing
window.testSocket.on("typing:start", (data) => {
  console.log("Someone is typing:", data);
});

window.testSocket.on("typing:stop", (data) => {
  console.log("Someone stopped typing:", data);
});
```

---

## Step 5: Check Server Health

Open a new browser tab and visit:

```
http://localhost:3000/api/socket/health
```

You should see:

```json
{
  "status": "ok",
  "socket": {
    "initialized": true,
    "connected": 1,
    "rooms": 2
  }
}
```

---

## Step 6: Test with Two Browser Windows

1. Open two browser windows side by side
2. Run the connection code in both (Step 2)
3. In window 1, send a message:
   ```javascript
   window.testSocket.emit("message:send", {
     conversationId: "test-room-123",
     content: "Hello from Window 1!",
     type: "text",
   });
   ```
4. Watch window 2 receive the message! 🎉

---

## Common Issues & Solutions

### Issue 1: "Authentication error: No token provided"

**Solution**: Either:

- Provide a valid JWT token in the `auth` object
- Temporarily disable authentication (see Step 2)

### Issue 2: "CORS Error"

**Solution**: Make sure `CLIENT_URL` in `.env` matches your browser's origin:

```bash
CLIENT_URL=http://localhost:3001
```

### Issue 3: Not receiving messages

**Checklist**:

- ✅ Did you join the conversation room first?
- ✅ Are you listening to the right event name?
- ✅ Is your token valid?
- ✅ Check server console for errors

### Issue 4: Port 3000 already in use

**Solution**:

```bash
# Windows
netstat -ano | findstr :3000
# Kill the process using that port

# Or change PORT in .env
PORT=3001
```

---

## What's Next?

Now that you have a working Socket.IO server, check out:

1. 📖 **BEGINNER_GUIDE.md** - Complete learning guide
2. 💻 **EXAMPLES.ts** - Copy-paste code examples
3. 📚 **README.md** - Full documentation

### Build Your First Feature:

**Simple Chat Room**:

```javascript
// 1. Connect
const socket = io("http://localhost:3000", {
  auth: { token: yourToken },
});

// 2. Join room
socket.emit("conversation:join", "chat-room-1");

// 3. Send messages
document.getElementById("sendBtn").onclick = () => {
  const text = document.getElementById("input").value;
  socket.emit("message:send", {
    conversationId: "chat-room-1",
    content: text,
    type: "text",
  });
};

// 4. Display messages
socket.on("message:new", (msg) => {
  const div = document.createElement("div");
  div.textContent = msg.content;
  document.getElementById("messages").appendChild(div);
});
```

---

## Debugging Tips

### Enable Debug Logs

```bash
# In terminal:
DEBUG=socket.io* npm run dev
```

### Check What Events Are Firing

```javascript
// In browser console:
window.testSocket.onAny((event, ...args) => {
  console.log("📡 Event:", event, "Data:", args);
});
```

### See What Rooms You're In

```javascript
// Server side (socket.handlers.ts):
console.log("User rooms:", Array.from(socket.rooms));
```

---

## Need Help?

1. Check the console for errors (both browser and server)
2. Read the error message carefully
3. Check `BEGINNER_GUIDE.md` for detailed explanations
4. Look at `EXAMPLES.ts` for working code samples

Happy coding! 🚀
