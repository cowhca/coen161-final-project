const mongodb = require("mongodb");
const Entry = require("../models/Entry");

/**
 * @function EntriesCollection
 * @description returns all entries from database
 *
 * NOTE: the first half of this function sets up all the methods that we will
 * return. the actual return value is at the very bottom of this function. So to
 * add a new function to EntriesCollection, define a function at the top and then
 * add a new key to the object literal at the bottom
 * @param {mongodb.Db} db - the mongo.Db to search
 * @returns {Object} all the methods that can be done to the MongoDB
 */
const EntriesCollection = (db) => {
    // since we'll reuse the same collection for all our methods, we can declare
    // it here and it'll be available for all the methods to reuse.
    const collection = db.collection("entries");

    /**
     * @function getEntry
     * @description returns a single entry givens its mongo id
     *
     * @returns {Promise<Entry>} the entry that matches the id
     */
    const getEntry = (id) => {
        let filter;

        try {
            filter = { _id: new mongodb.ObjectId(id) };
        } catch (err) {
            return Promise.reject({ code: "INVALID_ID" });
        }

        return collection.findOne(filter).then((entry) => {
            if (!entry) {
                return Promise.reject({ code: "NOT_FOUND" });
            }
            return { entry };
        });
    };

    /**
     * @function getUserEntries
     * @description returns all entries from database
     *
     * @returns {Promise<Array<Entry>>} all entries in the database
     */
    const getUserEntries = (user) => {
        return collection
            .find({ username: user })
            .toArray()
            .then((cursor) => {
                console.log(`getUserEntries::returning ${cursor.length} items`);
                return { entries: cursor };
            });
    };

    /**
     * @function getEnthusiasts
     * @description returns all entries with a perfect score
     *
     * @returns {Promise<Array<Entry>>}
     */
    const getEnthusiasts = () => {
        return collection
            .find({ score: 5 })
            .toArray()
            .then((cursor) => {
                console.log(`getUserEntries::returning ${cursor.length} items`);
                return { entries: cursor };
            });
    };

    /**
     * @function getAllEntries
     * @description returns all entries from database
     *
     * @returns {Promise<Array<Entry>>} all entries in the database
     */
    const getAllEntries = () => {
        return collection
            .find()
            .toArray()
            .then((cursor) => {
                console.log(`getAllEntries::returning ${cursor.length} items`);
                return { entries: cursor };
            });
    };

    /**
     * @function createEntry
     * @description creates an entry
     *
     * @param {string} username  - the username of the user
     * @param {string} quiz      - the quiz the user took
     * @param {integer} score    - the amount of questions answered correctly
     * @param {integer} maxScore - the total number of questions
     * @return {Entry}
     */
    const createEntry = (username, quiz, score, maxScore) => {
        // because the MongoDB insertOne function doesn't return the entire
        // created object, just the _id field for a subsequent get, we return
        // the new entry once we've successfully created a document
        const entry = Entry(username, quiz, score, maxScore);
        return collection.insertOne(entry).then(() => {
            return entry;
        });
    };

    return {
        createEntry,
        getEntry,
        getUserEntries,
        getAllEntries,
        getEnthusiasts,
    };
};

module.exports = EntriesCollection;