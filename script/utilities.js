
/**
 * Generates a number between zero and the maxInteger
 * @param {number} maxInteger integer representing the maximum value
 */
export const randomInt0ToX = function (maxInteger) {
    return Math.floor(Math.random() * maxInteger);
}

export const getURLQueryParameters = function () {
    var queryParams = {}
    window.location.search.substr(1).split("&").forEach(function (item) { queryParams[item.split("=")[0]] = decodeURIComponent(item.split("=")[1]) });
    return queryParams;
}