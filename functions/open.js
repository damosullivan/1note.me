const S3 = require('aws-sdk/clients/s3');

const s3 = new S3({
  accessKeyId: "",
  secretAccessKey: ""
});

exports.handler = async (event, context) => {
  const key = event.queryStringParameters.l

  if (!key) {
    return {
      statusCode: 400,
      body: 'no link parameter `l` provided'
    }
  }

  var params = {
    Bucket: '1note.me', 
    Key: key
  }

  return s3GetObject(s3, params)
    .then(object => {
      const link = object.Body.toString();
      return {
        statusCode: 302,
        headers: {
          Location: decodeURIComponent(link)
        },
        body: link
      }
    })
    .catch(err => { return {
      statusCode: 500,
      body: err.toString()
    }});
}

// Promises FTW
const s3GetObject = async (s3, params) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data)
      }
    });
  });
}