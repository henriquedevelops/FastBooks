/*

Error handling higher order function to avoid try/catch blocks.

*/

module.exports = (asyncFunction) => {
  return (request, response, next) => {
    asyncFunction(request, response, next).catch(next);
  };
};
