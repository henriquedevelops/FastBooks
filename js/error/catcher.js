/*

This function takes an async function as input, returns a new 
function that calls the input async function and wraps it in 
a try-catch block, so that any errors thrown within the async 
function will be caught and passed to the next middleware function,
which will handle the error.

This function makes asynchronous code look almost exactly like
synchronous, therefore really easy to read.

*/

module.exports = (asyncFunction) => {
  return (request, response, next) => {
    asyncFunction(request, response, next).catch(next);
  };
};
