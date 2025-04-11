require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoute");

const app = express();
const http = require("http");
const socket = require("socket.io");

const PORT = process.env.PORT || 5000;

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000", // Your local frontend URL
  "https://ayush-mern-chat-app.vercel.app" // Production frontend URL (optional)
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// Avatar Generator Route
app.get("/api/avatar/:id", async (req, res) => {
  const avatarId = req.params.id;
  try {
    const response = await axios.get(
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}`,
      { responseType: "arraybuffer" }
    );
    res.set("Content-Type", "image/svg+xml");
    res.send(response.data);
  } catch (error) {
    console.error("❌ Error fetching avatar:", error.message);
    res.status(500).send("Failed to fetch avatar");
  }
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ DB CONNECTION SUCCESSFUL");
  } catch (err) {
    console.error("❌ DB CONNECTION ERROR:", err.message);
    process.exit(1);
  }
};
connectDB();

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Track online users
global.onlineUsers = new Map();

// Emit current online user IDs to all connected clients
const emitOnlineUsers = () => {
  const onlineIds = Array.from(onlineUsers.keys());
  io.emit("update-online-users", onlineIds);
};

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    emitOnlineUsers();
  });

  socket.on("send-msg", (data) => {
    try {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data.message);
      }
    } catch (err) {
      console.error("WebSocket Error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("🔌 Client disconnected:", socket.id);
    emitOnlineUsers();
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("🔴 Shutting down server...");
  server.close(() => {
    console.log("🔴 Server closed");
    mongoose.connection.close(false, () => {
      console.log("🔴 MongoDB connection closed");
      process.exit(0);
    });
  });
});
