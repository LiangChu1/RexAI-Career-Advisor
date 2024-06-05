// Import the Firebase Functions module
const functions = require("firebase-functions");
// Import the Firebase Admin SDK
const admin = require("firebase-admin");
// Destructure the logger from functions
const {logger} = functions;

const cors = require("cors")({origin: true});
/**
 * This function is responsible for creating a new log in the Firestore database.
 * It expects an object with an `eventDescription` property in the `data` parameter.
 * If the `eventDescription` is missing, it throws an error.
 * If the log is successfully created, it returns an object with a status message and the ID of the new log.
 * @param {Object} data - The data for the new log.
 * @param {Object} context - The context of the function call.
 * @returns {Object} - The status of the operation and the ID of the new log.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while adding the log.
 */
const postLogs = functions.https.onCall(async (data, context) => {
  try {
    logger.log("Received log data:", data);
    // Destructure the eventDescription from the data object
    const {eventDescription} = data;
    // Check if the eventDescription of the log is missing within the data object
    if (!eventDescription) {
      logger.log("Required fields are missing");
      // Throw an HTTP error for missing fields
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Required fields (eventDescription) are missing",
      );
    }
    // Create an object with the log data and include the current timestamp
    const logData = {
      eventDescription,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    // Add the log data to the Firestore database
    const logRef = await admin.firestore().collection("logs").add(logData);

    // Return a success message after successfully adding log data to database
    return {status: "Log has been successfully added", logId: logRef.id};
  } catch (error) {
    logger.log("Error adding log: ", error);
    throw new functions.https.HttpsError(
        // Throw an HTTP error with status "unknown" if an error occurs
        "unknown",
        "An error occurred while adding the log",
        error.message,
    );
  }
});
/**
 * This function is responsible for updating an existing log in the Firestore database.
 * It expects an object with a `logId` and `newEventDescription` property in the `req.body.data`.
 * If either of these properties is missing, it throws an error.
 * If the log is successfully updated, it returns a status message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while updating the log.
 */
const updateLogs = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Received log data:", req);
      // Destructure the logId and eventDescription from the data object
      const {logId, newEventDescription} = req.body.data;
      // Check if any of the fields are missing within the data object
      if (!logId || !newEventDescription) {
        logger.log("Required fields are missing");
        // Throw an HTTP error for missing fields
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Required fields (logId and newEventDescription) are missing",
        );
      }
      // Update the pre-existing object with the updated log data and include the current timestamp based on it's logId
      const logRef = admin.firestore().collection("logs").doc(logId);
      await logRef.update({
        eventDescription: newEventDescription,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Return a success message after successfully updating log data to database
      return res.status(200).json({status: "Log has been successfully updated"});
    } catch (error) {
      logger.log("Error updating log: ", error);
      // Throw an HTTP error with status "unknown" if an error occurs
      throw new functions.https.HttpsError(
          "unknown",
          "An error occurred while updating the log",
          error.message,
      );
    }
  });
});
/**
 * This function is responsible for deleting a log from the Firestore database.
 * It expects a `logId` in the `req.query`.
 * If the `logId` is missing, it throws an error.
 * If the log is successfully deleted, it returns a status message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation.
 * @throws {functions.https.HttpsError} - If required fields are missing or an error occurs while deleting the log.
 */
const deleteLogs = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Received log data:", req);
      // Destructure the logId from the data object
      const logId = req.query.logId;
      // Check if any of the fields are missing within the data object
      if (!logId) {
        logger.log("Required fields are missing");
        // Throw an HTTP error for missing fields
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Required fields (logId) are missing",
        );
      }
      // Delete the pre-existing object with the specified logId
      const logRef = admin.firestore().collection("logs").doc(logId);
      await logRef.delete();
      // Return a success message after successfully deleting log data from database
      return res.status(200).json({status: "deleted log event"});
    } catch (error) {
      logger.log("Error deleting log: ", error);
      // Throw an HTTP error with status "unknown" if an error occurs
      throw new functions.https.HttpsError(
          "unknown",
          "An error occurred while deleting the log",
          error.message,
      );
    }
  });
});

/**
 * This function is responsible for retrieving a log from the Firestore database.
 * It expects a `logId` in the `req.query`.
 * If the `logId` is missing, it throws an error.
 * If the log is successfully retrieved, it returns the log data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The status of the operation and the retrieved log data.
 * @throws {functions.https.HttpsError} - If required fields are missing, the log does not exist, or an error occurs while retrieving the log.
 */
const getLogs = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      logger.log("Received log data:", req);
      // Destructure the logId from the data object
      const logId = req.query.logId;
      // Check if any of the fields are missing within the data object
      if (!logId) {
        logger.log("Required fields are missing");
        // Throw an HTTP error for missing fields
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Required fields (logId) are missing",
        );
      }
      // Retrieve the pre-existing object with the specified logId
      const logRef = admin.firestore().collection("logs").doc(logId);
      const doc = await logRef.get();
      if (!doc.exists) {
        logger.log("No such document!");
        throw new functions.https.HttpsError(
            "not-found",
            "No such document!",
        );
      }
      logger.log("Document data:", doc.data());
      // Return the retrieved log data
      return res.status(200).json({status: "Got log event", log: doc.data()});
    } catch (error) {
      logger.log("Error getting log: ", error);
      // Throw an HTTP error with status "unknown" if an error occurs
      throw new functions.https.HttpsError(
          "unknown",
          "An error occurred while getting the log",
          error.message,
      );
    }
  });
});
module.exports = {postLogs, updateLogs, deleteLogs, getLogs};
