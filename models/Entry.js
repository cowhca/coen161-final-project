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
 * @param {integer} score    = the score received on this quiz
 * @param {integer} maxScore = the maxScore possible on this quiz
 *
 * @returns { {username: string, quiz: string , score: integer, maxScore: integer}} Entry
 */
const Entry = (username, quiz, score, maxScore) => {
    return {
        username,
        quiz,
        score,
        maxScore,
    };
};

module.exports = Entry;