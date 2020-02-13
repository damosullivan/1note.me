const S3 = require('aws-sdk/clients/s3');
const shortid = require('shortid');

const s3 = new S3({
  accessKeyId: "",
  secretAccessKey: ""
});
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  const link = event.queryStringParameters.link || 'no get param'

  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);
    link = body.link;
  }

  // if (event.httpMethod !== "POST") {
  //   // TODO: error, remove GET
  // }

  const id = shortid.generate();
  const result = `https://1note.me?l=${id}`;
  const params = {
    Bucket: "1note.me",
    Key: id,
    Body: link
  };

  return s3PutObject(s3, params)
    .then(res => { return {
      statusCode: 200,
      body: result
    }})
    .catch(err => { return {
      statusCode: 500,
      body: Error(err)
    }});
}

const s3PutObject = async (s3, params) => {
  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data)
      }
    });
  });
}