// Import the Firebase Functions module
const functions = require("firebase-functions");
// Import the Firebase Admin SDK
const admin = require("firebase-admin");
// Destructure the logger from functions
const {logger} = functions;

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
    const {userId, name} = data;

    if (!userId || !name) {
      logger.log("Required fields are missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (ID for user and name for chat room) are missing",
      );
    }

    const chatData = {
      name: name,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      mostRecentMessage: null,
      totalMessages: 0,
    };

    const chatRef = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .add(chatData);

    return {status: "new chat room has been created", chatId: chatRef.id};
  } catch (error) {
    logger.log("Error creating chat room: ", error);

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
const updateChatRoomStatus = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Receiving data for PUT", data);
    const {userId, chatId, isActive} = data;

    if (!userId || !chatId || isActive === undefined) {
      logger.log("Required fields are missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (ID for chat room, user, and isActive) are missing",
      );
    }

    await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .doc(chatId)
        .update({isActive: isActive});

    return {status: "chat room status has been updated"};
  } catch (error) {
    logger.log("Error updating chat room status: ", error);
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while updating the chat room status",
        error.message,
    );
  }
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
const getAChatRoom = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Receiving data for getting a specific chat of a user: ", data);
    const {userId, chatId} = data;

    if (!userId || !chatId) {
      logger.log("Required fields are missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (ID for user and chat) are missing",
      );
    }

    const doc = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .doc(chatId)
        .get();
    const chatRoomData = doc.data();
    chatRoomData.chatId = chatId;

    return {
      status: "successfully got chat with id: " + chatId,
      chatData: chatRoomData,
    };
  } catch (error) {
    logger.log("Error getting chat room: ", error);
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while getting the chat room",
        error.message,
    );
  }
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
const getAllChatRooms = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Receiving data of a specific user's chats", data);
    const {userId} = data;

    if (!userId) {
      logger.log("Required field is missing");
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required field (ID for user) is missing",
      );
    }

    const chatRoomsSnapshot = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .get();
    const chatRooms = chatRoomsSnapshot.docs.map((doc) => {
      const chatRoom = doc.data();
      chatRoom.chatId = doc.id;
      return chatRoom;
    });

    return {status: "successfully got chat rooms", chatRooms: chatRooms};
  } catch (error) {
    logger.error("Error fetching chat rooms:", error);
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while getting the chat rooms",
        error.message,
    );
  }
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
const deleteChatRoom = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Receiving data to delete messages", data);
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
    const batch = admin.firestore().batch();
    chatMessagesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("chats")
        .doc(chatId)
        .delete();

    return {status: "successfully deleted chat messages"};
  } catch (error) {
    logger.error("Error fetching messages:", error);
    throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while deleting the messages",
        error.message,
    );
  }
});

module.exports = {
  getAllChatRooms,
  getAChatRoom,
  deleteChatRoom,
  updateChatRoomStatus,
  createChatRoom,
};
