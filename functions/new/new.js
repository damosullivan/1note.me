// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      // error
    }
    const body = event.body;
    const link = body.link
    
    
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Your link: '${link}'` })
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
