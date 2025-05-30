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
      const decodedLink = decodeURIComponent(link);
      
      console.log('Raw link from S3:', link);
      console.log('Decoded link:', decodedLink);
      
      // Use JavaScript redirect instead of HTTP redirect
      const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting to OneNote...</title>
    <meta charset="utf-8">
</head>
<body>
    <p>Redirecting to OneNote...</p>
    <script>
        window.location.href = "${decodedLink.replace(/"/g, '\\"')}";
    </script>
    <noscript>
        <p>Click here to open OneNote: <a href="${decodedLink}">${decodedLink}</a></p>
    </noscript>
</body>
</html>`;
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html'
        },
        body: html
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