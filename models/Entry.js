/**
 * @function Entry
 * @description returns an entry that can be inserted into the database
 *
 * It's good to create model functions like this so we can keep track
 * of the data structures that will go into the databaase.
 * Even if MongoDB has a flexible schema, we should make it easy for
 * future us to come and edit what pieces of data constitute an entry..
 *
 * @param {string} username  = the username
 * @param {string} quiz      = the quiz the usern took
 * @param {string} character = the character that they are most like
 *
 * @returns { {username: string, quiz: string , character: string}} Entry
 */
const Entry = (username, quiz, character) => {
    return {
        username,
        quiz,
        character,
    };
};

module.exports = Entry;