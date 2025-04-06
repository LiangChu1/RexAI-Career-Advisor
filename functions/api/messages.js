// Import the Firebase Functions module
const functions = require("firebase-functions");
// Import the Firebase Admin SDK
const admin = require("firebase-admin");
// Destructure the logger from functions
const {logger} = functions;

/**
 * This function is responsible for creating a new message in a chat in the Firestore database.
 * It expects an object with `userId`, `text`, `senderId`, and `chatId` properties in the `data` parameter.
 * If the `text`, `senderId`, or `userId` is missing, it throws an error.
 * If the message is successfully created, it returns an object with a status message, the ID of the chat, and the ID of the new message.
 * @param {Object} data - The data for the new message.
 * @param {Object} context - The context of the function call.
 * @returns {Object} - The status of the operation, the ID of the chat, and the ID of the new message.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while adding the message.
 */
const postMessage = functions.https.onCall(async (data, context) => {
  try {
    const {userId, text, senderId, chatId} = data;
    if (!text || !senderId || !userId || !chatId) {
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing required fields (text, senderId, userId, or chatId)",
      );
    }

    const chatRef = admin.firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .doc(chatId);

    const chatSnapshot = await chatRef.get();
    if (!chatSnapshot.exists) {
      throw new functions.https.HttpsError(
          "not-found",
          "Chat document doesn't exist",
      );
    }

    const messageRef = await chatRef
        .collection("messages")
        .add({
          senderId,
          text,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

    await chatRef.update({
      mostRecentMessage: text,
      totalMessages: admin.firestore.FieldValue.increment(1),
    });

    return {
      status: "success",
      chatId: chatId,
      messageId: messageRef.id,
    };
  } catch (error) {
    logger.error("Full error:", error);
    throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to add message",
    );
  }
});

/**
 * This function is responsible for retrieving all messages from a specific chat of a specific user from the Firestore database.
 * It expects a `userId` and `chatId` in the `req.query`.
 * If either of these properties is missing, it throws an error.
 * If the messages are successfully retrieved, it returns the messages data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation and the retrieved messages
 * data.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while retrieving the messages.
 */
const getChatMessages = functions.https.onCall(async (data, context) => {
  try {
    const {userId, chatId} = data;
    if (!userId || !chatId) {
      logger.log("Required fields are missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (ID's for user and chat) are missing",
      );
    }

    const chatMessagesSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .get();

    const messages = chatMessagesSnapshot.docs.map((doc) => {
      const message = doc.data();
      message.messageId = doc.id;
      return message;
    });

    return {status: "successfully got chat messages", messages};
  } catch (error) {
    logger.error("Error fetching messages:", error);
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while getting the chat messages",
        error.message,
    );
  }
});

module.exports = {postMessage, getChatMessages};
