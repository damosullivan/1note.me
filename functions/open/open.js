// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    const key = event.queryStringParameters.key || 'test'
    return {
      headers: {
        Location: 'https://google.com/search?q=' + key
      }
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
