// Initialize Firebase Admin SDK
const admin = require("firebase-admin");
admin.initializeApp();

// Import message-related functions
const {
  postMessage,
  getChatMessages,
  getAMessage,
} = require("./api/messages");

// Export message-related functions
exports.postMessage = postMessage;
exports.getChatMessages = getChatMessages;
exports.getAMessage = getAMessage;

// Import chat-room-related functions
const {
  getAllChatRooms,
  getAChatRoom,
  createChatRoom,
  deleteChatRoom,
  updateChatRoomStatus,
} = require("./api/chatRooms");

// Export chat-room-related functions
exports.getAllChatRooms = getAllChatRooms;
exports.getAChatRoom = getAChatRoom;
exports.createChatRoom = createChatRoom;
exports.deleteChatRoom = deleteChatRoom;
exports.updateChatRoomStatus = updateChatRoomStatus;

// Import log-related functions
const {
  postLogs,
  updateLogs,
  deleteLogs,
  getLogs,
} = require("./api/logs");

// Export log-related functions
exports.postLogs = postLogs;
exports.updateLogs = updateLogs;
exports.deleteLogs = deleteLogs;
exports.getLogs = getLogs;
