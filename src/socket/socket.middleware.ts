import { ENV } from "@/config";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { TypedSocket } from "./socket.types";

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Socket.io authentication middleware
 * Verifies JWT token from handshake auth or query parameters
 */
export const authenticateSocket = (
  socket: TypedSocket,
  next: (err?: ExtendedError) => void,
) => {
  try {
    // Get token from handshake auth or query
    const token =
      socket.handshake.auth?.token || (socket.handshake.query?.token as string);

    if (!token) {
      return next(
        new Error("Authentication error: No token provided") as ExtendedError,
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET_KEY) as JWTPayload;

    if (!decoded || !decoded.userId) {
      return next(
        new Error("Authentication error: Invalid token") as ExtendedError,
      );
    }

    // Attach user data to socket
    socket.data.userId = decoded.userId;
    socket.data.email = decoded.email;
    socket.data.role = decoded.role;

    next();
  } catch (error) {
    console.error("Socket authentication error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new Error("Authentication error: Token expired") as ExtendedError,
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new Error("Authentication error: Invalid token") as ExtendedError,
      );
    }

    return next(
      new Error("Authentication error: Server error") as ExtendedError,
    );
  }
};

/**
 * Rate limiting middleware for socket events
 * Prevents spam and abuse
 */
export const rateLimitMiddleware = (maxEventsPerSecond: number = 10) => {
  const socketEventCounts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  return (socket: Socket, next: (err?: ExtendedError) => void) => {
    const socketId = socket.id;
    const now = Date.now();
    const eventData = socketEventCounts.get(socketId);

    if (!eventData || now > eventData.resetTime) {
      // Reset or initialize counter
      socketEventCounts.set(socketId, {
        count: 1,
        resetTime: now + 1000, // Reset after 1 second
      });
      return next();
    }

    if (eventData.count >= maxEventsPerSecond) {
      return next(
        new Error("Rate limit exceeded: Too many events") as ExtendedError,
      );
    }

    eventData.count++;
    next();
  };
};

/**
 * Logging middleware for socket connections
 */
export const loggingMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError) => void,
) => {
  const clientInfo = {
    socketId: socket.id,
    userId: socket.data.userId,
    ip: socket.handshake.address,
    userAgent: socket.handshake.headers["user-agent"],
    timestamp: new Date().toISOString(),
  };

  console.log("Socket connection attempt:", clientInfo);
  next();
};
