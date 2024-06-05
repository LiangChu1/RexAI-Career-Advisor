// Import the Firebase Functions module
const functions = require("firebase-functions");
// Import the Firebase Admin SDK
const admin = require("firebase-admin");
// Destructure the logger from functions
const {logger} = functions;

const cors = require("cors")({origin: true});
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
    logger.log("Receiving message data data for POST", data);
    // Destructure the userId, message text, senderId, and chatId from the data object
    const {userId, text, senderId, chatId} = data;
    // Check if the required fields are present in the data object
    if (!text || !senderId || !userId) {
      logger.log("Required fields are missing");
      // Throw an HTTP error for missing fields
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (text or ID's for sender or receiver) are missing",
      );
    }
    // Check to see if the message that being sent, belongs to a specific chat room (based on chatId)
    let newChatId = chatId;
    if (!newChatId) {
      newChatId = admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("chats")
          .doc()
          .id;
    }
    // Create a new message object with the data from the data object
    const messageData = {
      senderId,
      text,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    // Add the message data to a specific chat collection that's within the Firestore database
    // My data model of the Firestore database for message reception is: users->[userId]->chats->[chatId]->messages->{sender,text,timestamp}
    const messageRef = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .doc(newChatId.toString())
        .collection("messages")
        .add(messageData);

    // Get the reference to the chat document
    const chatDocRef = admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .doc(newChatId.toString());

    // Get the chat document
    const chatDoc = await chatDocRef.get();

    // Get the current totalMessages count
    const totalMessages = chatDoc.data().totalMessages;

    // Now you can increment totalMessages and update the chat document
    await chatDocRef.update({mostRecentMessage: text, totalMessages: totalMessages + 1});

    // Return a success message after successfully adding message data to database
    return {status: "new message has been added", chatId: newChatId, messageId: messageRef.id};
  } catch (error) {
    logger.log("Error adding message: ", error);
    // Throw an HTTP error with status "unknown" if an error occurs
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while adding the message",
        error.message,
    );
  }
});

/**
 * This function is responsible for retrieving a message from a specific chat of a specific user from the Firestore database.
 * It expects a `userId`, `chatId`, and `messageId` in the `req.query`.
 * If any of these properties is missing, it throws an error.
 * If the message is successfully retrieved, it returns the messages data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation and the retrieved messages data.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while retrieving the messages.
 */
const getAMessage = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Receiving data of a specific user's chat", req);
      // Destructure the userId and chatId from the query object
      const userId = req.query.userId;
      const chatId = req.query.chatId;
      const messageId = req.query.messageId;
      // Check if the required fields are present in the query object
      if (!userId || !chatId || !messageId) {
        logger.log("Required fields are missing");
        // Throw an HTTP error with status "required" if required fields are missing
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Required fields (ID's for user, chat room, and message) are missing",
        );
      }
      // Retrieve the message data from the Firestore database
      const doc = await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .doc(messageId)
          .get();

      const messageData = doc.data();
      messageData.messageId = messageId;
      return res.status(200).json({status: "successfully got message with id: " + messageId, messageData: messageData});
    } catch (error) {
      logger.log("Error getting chat room: ", error);
      // Throw an HTTP error with status "unknown" if an error occurs
      throw new functions.https.HttpsError(
          "unknown",
          "An error occurred while getting the chat room",
          error.message,
      );
    }
  });
});

/**
 * This function is responsible for retrieving all messages from a specific chat of a specific user from the Firestore database.
 * It expects a `userId` and `chatId` in the `req.query`.
 * If either of these properties is missing, it throws an error.
 * If the messages are successfully retrieved, it returns the messages data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation and the retrieved messages data.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while retrieving the messages.
 */
const getChatMessages = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Receiving data of a specific user's chat", req);
      // Destructure the userId and chatId from the query object
      const userId = req.query.userId;
      const chatId = req.query.chatId;
      // Check if the required fields are present in the query object
      if (!userId || !chatId) {
        logger.log("Required fields are missing");
        // Throw an HTTP error with status "required" if required fields are missing
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Required fields (ID's for user and chat) are missing",
        );
      }
      // Get the messages of a specific chat from the Firestore database
      const chatMessagesSnapshot = await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("chats")
          .doc(chatId.toString())
          .collection("messages")
          .get();
      const messages = chatMessagesSnapshot.docs.map((doc) => {
        // Get the message data
        const message = doc.data();
        // Add the messageId to the message data
        message.messageId = doc.id;
        return message;
      });

      // Return a success message after successfully retrieving messages data from database
      return res.status(200).json({status: "successfully got chat messages", messages: messages});
    } catch (error) {
      logger.error("Error fetching messages:", error);
      throw new functions.https.HttpsError(
          "unknown",
          "An error occurred while get a specific chat",
          error.message,
      );
    }
  });
});

module.exports = {postMessage, getChatMessages, getAMessage};
