import {
  globalErrorHandler,
  globalNotFoundHandler,
} from "@/middlewares/common";
import { ENV } from "./config";
import { connectDB } from "./database";
import routes from "./Routes";
import { app, httpServer } from "./server";
import { closeSocket, getSocketStats, initializeSocket } from "./socket";

// Connect MongoDB before starting the server
connectDB();

// Initialize Socket.IO
const io = initializeSocket(httpServer);

console.log("🚀 Socket.IO initialized and ready for connections");

// app.get("/", (req: Request, res: Response) => {
//   res.status(200).json({ data: `Hello, world! - ${PORT}` });
// });

//application routes
app.use("/api", routes);

// Socket health check endpoint
app.get("/api/socket/health", (req, res) => {
  const stats = getSocketStats();
  res.status(200).json({
    status: "ok",
    socket: {
      initialized: !!io,
      ...stats,
    },
  });
});

app.use(globalNotFoundHandler);
app.use(globalErrorHandler);

// Handle listen errors (eg. port already in use) to prevent uncaught exceptions
httpServer.on("error", (err: unknown) => {
  const e = err as NodeJS.ErrnoException | undefined;
  if (e && e.code === "EADDRINUSE") {
    console.error(`Error: Port ${ENV.PORT} already in use (EADDRINUSE)`);
    return;
  }
  console.error("HTTP server error:", err);
});

if (!httpServer.listening) {
  httpServer.listen(ENV.PORT, () => {
    console.log(`Server running at http://localhost:${ENV.PORT}`);
    console.log(`Socket.IO ready at ws://localhost:${ENV.PORT}`);
  });
} else {
  console.log(`HTTP server already listening on port ${ENV.PORT}`);
}

const shutdown = async () => {
  console.log("Shutting down server...");
  try {
    await closeSocket();
  } catch (err) {
    // ignore
  }
  try {
    httpServer.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  } catch (err) {
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export { app, httpServer, io };
