
/**
 * Generates a number between zero and the maxInteger
 * @param {number} maxInteger integer representing the maximum value
 */
export const randomInt0ToX = function (maxInteger) {
    return Math.floor(Math.random() * maxInteger);
}