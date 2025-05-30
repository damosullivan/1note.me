const S3 = require('aws-sdk/clients/s3');
const { AWS_ACCESS_KEY_ID_RW, AWS_SECRET_ACCESS_KEY_RW } = process.env;

const s3 = new S3({
  accessKeyId: AWS_ACCESS_KEY_ID_RW,
  secretAccessKey: AWS_SECRET_ACCESS_KEY_RW
});

exports.handler = async (event, context) => {
  // Debug logging
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Query parameters:', event.queryStringParameters);
  
  const key = event.queryStringParameters?.l

  if (!key) {
    return {
      statusCode: 400,
      body: `no link parameter 'l' provided. Available params: ${JSON.stringify(event.queryStringParameters)}`
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