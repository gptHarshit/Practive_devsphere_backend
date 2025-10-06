const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      onlineUsers.set(userId, socket.id);
      socket.to(roomId).emit("userOnline", { userId });
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          const newMessage = {
            senderId: userId,
            text,
          };

          chat.messages.push(newMessage);
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            senderId: userId,
            timestamp: newMessage.createdAt || new Date(),
          });
        } catch (error) {
          console.log("Socket error:", error);
          socket.emit("messageError", { error: "Message sending failed" });
        }
      }
    );

    socket.on("typingStart", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("userTyping", { userId });
    });

    socket.on("typingStop", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.to(roomId).emit("userStoppedTyping", { userId });
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      //console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
