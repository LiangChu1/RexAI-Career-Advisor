// Import the Firebase Functions module
const functions = require("firebase-functions");
// Import the Firebase Admin SDK
const admin = require("firebase-admin");
// Destructure the logger from functions
const {logger} = functions;

const cors = require("cors")({origin: true});

/**
 * This function is responsible for creating a new chat room for a specific user in the Firestore database.
 * It expects a `userId` and `name` in the `data` parameter.
 * If the `userId` or `name` is missing, it throws an error.
 * If the chat room is successfully created, it returns an object with a status message and the ID of the new chat room.
 * @param {Object} data - The data for the new chat room.
 * @param {Object} context - The context of the function call.
 * @returns {Object} - The status of the operation and the ID of the new chat room.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while adding the chat room.
 */
const createChatRoom = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Receiving data for POST", data);
    // Destructure the userId and name from the data object
    const {userId, name} = data;
    // Check if the required fields are present in the data object
    if (!userId || !name) {
      logger.log("Required fields are missing");
      // Throw an HTTP error for missing fields
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (ID for user and name for chat room) are missing",
      );
    }
    // Add the name, created_at, and isActive fields to the chat room document
    const chatData = {
      name: name,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      mostRecentMessage: null,
      totalMessages: 0,
    };
    // Create a new chat room document in the Firestore database
    const chatRef = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .add(chatData);

    // Return a success message after successfully creating chat room
    return {status: "new chat room has been created", chatId: chatRef.id};
  } catch (error) {
    logger.log("Error creating chat room: ", error);
    // Throw an HTTP error with status "unknown" if an error occurs
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while creating the chat room",
        error.message,
    );
  }
});

/**
 * This function is responsible for updating the status of a chat room in the Firestore database.
 * It expects a `userId`, `chatId`, and `isActive` in the `data` parameter.
 * If the `userId`, `chatId`, or `isActive` is missing, it throws an error.
 * If the chat room status is successfully updated, it returns an object with a status message.
 * @param {Object} data - The data for the chat room status update.
 * @param {Object} context - The context of the function call.
 * @returns {Object} - The status of the operation.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while updating the chat room status.
 */
const updateChatRoomStatus = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Receiving data for PUT", req);
      // Destructure the userId, chatId, and isActive from the data object
      const {userId, chatId, isActive} = req.body.data;
      // Check if the required fields are present in the data object
      if (!userId || !chatId || isActive === undefined) {
        logger.log("Required fields are missing");
        // Throw an HTTP error for missing fields
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Required fields (ID for user, ID for chat room, and isActive status) are missing",
        );
      }
      // Update the isActive field of the chat room document
      await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("chats")
          .doc(chatId)
          .update({isActive: isActive});

      // Return a success message after successfully updating chat room status
      return res.status(200).json({status: "chat room status has been updated"});
    } catch (error) {
      logger.log("Error updating chat room status: ", error);
      // Throw an HTTP error with status "unknown" if an error occurs
      throw new functions.https.HttpsError(
          "unknown",
          "An error occurred while updating the chat room status",
          error.message,
      );
    }
  });
});

/**
 * This function is responsible for retrieving one chat room of a specific user from the Firestore database.
 * It expects a `userId` and `chatId` in the `req.query`.
 * If the `userId` or `chatId` is missing, it throws an error.
 * If the chat room is successfully retrieved, it returns the chat room data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation and the retrieved chat room data.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while retrieving the chat rooms.
 */
const getAChatRoom = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Receiving data for getting a specific chat of a user: ", req);
      // Destructure the userId and chatId from the query object
      const userId = req.query.userId;
      const chatId = req.query.chatId;
      if (!userId || !chatId) {
        logger.log("Required field is missing");
        // Throw an HTTP error with status "required" if required field is missing
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Required field (ID for user and chat) is missing",
        );
      }
      // Get the chat room document
      const doc = await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("chats")
          .doc(chatId)
          .get();

      const chatRoomData = doc.data();
      chatRoomData.chatId = chatId;
      return res.status(200).json({status: "successfully got chat with id: " + chatId, chatData: chatRoomData});
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
 * This function is responsible for retrieving all chat rooms of a specific user from the Firestore database.
 * It expects a `userId` in the `req.query`.
 * If the `userId` is missing, it throws an error.
 * If the chat rooms are successfully retrieved, it returns the chat room data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation and the retrieved chat room data.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while retrieving the chat rooms.
 */
const getAllChatRooms = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Receiving data of a specific user's chats", req);
      // Destructure the userId from the query object
      const userId = req.query.userId;
      // Check if the required field is present in the query object
      if (!userId) {
        logger.log("Required field is missing");
        // Throw an HTTP error with status "required" if required field is missing
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Required field (ID for user) is missing",
        );
      }
      // Get the chat rooms of a specific user from the Firestore database
      const chatRoomsSnapshot = await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("chats")
          .get();
      const chatRooms = chatRoomsSnapshot.docs.map((doc) => {
        // Get the chat room data
        const chatRoom = doc.data();
        // Add the chatId to the chat room data
        chatRoom.chatId = doc.id;
        return chatRoom;
      });
      // Return a success message after successfully retrieving chat room data from database
      return res.status(200).json({status: "successfully got chat rooms", chatRooms: chatRooms});
    } catch (error) {
      logger.error("Error fetching chat rooms:", error);
      throw new functions.https.HttpsError(
          "unknown",
          "An error occurred while getting the chat rooms",
          error.message,
      );
    }
  });
});

/**
 * This function is responsible for deleting all messages from a specific chat of a specific user from the Firestore database.
 * It expects a `userId` and `chatId` in the `req.query`.
 * If either of these properties is missing, it throws an error.
 * If the messages are successfully deleted, it returns a status message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while deleting the messages.
 */
const deleteChatRoom = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Receiving data to delete messages", req);
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
      // Delete all messages from the specified chat of the specified user
      const chatMessagesSnapshot = await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("chats")
          .doc(chatId.toString())
          .collection("messages")
          .get();

      const batch = admin.firestore().batch();
      chatMessagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      // Delete the chat room document
      await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("chats")
          .doc(chatId.toString())
          .delete();
      // Return a success message after successfully deleting messages data from database
      return res.status(200).json({status: "successfully deleted chat messages"});
    } catch (error) {
      logger.error("Error fetching messages:", error);
      // Return an error message if an error occurs while deleting messages data from database
      throw new functions.https.HttpsError(
          "unknown",
          "An error occurred while deleted the messages",
          error.message,
      );
    }
  });
});

module.exports = {getAllChatRooms, getAChatRoom, deleteChatRoom, updateChatRoomStatus, createChatRoom};
