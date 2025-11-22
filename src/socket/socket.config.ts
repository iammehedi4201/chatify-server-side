import { Server as HTTPServer } from "http";
import { ENV } from "@/config";
import { Server as SocketIOServer } from "socket.io";
import { handleConnection } from "./socket.handlers";
import { TypedServer } from "./socket.types";

let io: TypedServer | null = null;

export const initializeSocket = (httpServer: HTTPServer): TypedServer => {
  if (io) {
    console.log("⚠️ Socket.IO already initialized");
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        ENV.CLIENT_URL,
        // ENV.CLIENT_URL_PROD,
        "http://localhost:5173",
        "http://localhost:5174",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
    // Connection options

    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
    connectTimeout: 45000, // 45 seconds

    // Transports
    transports: ["websocket", "polling"],
    // Allow upgrades
    allowUpgrades: true,
    // Cookie options
    // cookie: {
    //   name: "io",
    //   httpOnly: true,
    //   sameSite: "lax",
    // },
    // Performance options
    // perMessageDeflate: {
    //   threshold: 1024, // Only compress messages > 1KB
    // },
    // maxHttpBufferSize: 1e6, // 1MB max message size
  });

  // Apply middleware
  //   io.use(loggingMiddleware);
  //   io.use(authenticateSocket);
  //   io.use(rateLimitMiddleware(10)); // Max 10 events per second

  // Handle connections
  io.on("connection", handleConnection);

  // Error handling
  // 'connect_error' is a reserved Socket.IO event name; the typed server
  // can be strict about allowed event names. Cast `io` to `any` here to
  // register the handler without TypeScript complaining about event name types.
  // Use a typed `on` signature with unknown args to avoid `any`.
  (
    io as unknown as {
      on: (event: string, listener: (...args: unknown[]) => void) => void;
    }
  ).on("connect_error", (error: unknown) => {
    console.error("Socket.IO connection error:", error);
  });

  console.log("✅ Socket.IO server initialized");

  return io;
};

/**
 * Get Socket.IO server instance
 * @throws Error if socket server is not initialized
 */
export const getIO = (): TypedServer => {
  if (!io) {
    throw new Error(
      "Socket.IO server not initialized. Call initializeSocket() first.",
    );
  }
  return io;
};

/**
 * Close Socket.IO server
 */
export const closeSocket = async (): Promise<void> => {
  if (io) {
    await new Promise<void>((resolve) => {
      io!.close(() => {
        console.log("Socket.IO server closed");
        io = null;
        resolve();
      });
    });
  }
};

/**
 * Get connection statistics
 */
export const getSocketStats = () => {
  if (!io) {
    return { connected: 0, rooms: 0 };
  }

  return {
    connected: io.engine.clientsCount,
    rooms: io.sockets.adapter.rooms.size,
  };
};
