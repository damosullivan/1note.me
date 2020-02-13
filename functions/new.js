const S3 = require('aws-sdk/clients/s3');
const shortid = require('shortid');

const s3 = new S3({
  accessKeyId: "",
  secretAccessKey: ""
});

exports.handler = async (event, context) => {

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 400,
      body: `please use POST, not ${event.httpMethod}`
    }
  }

  // leaving in encoded form for simplicity
  const encoded_text = `${event.body}`.replace('link=', '').split(encodeURIComponent('\n'));
  const onenote_links = encoded_text.filter(l => l.startsWith(encodeURIComponent('onenote:')))
  if (onenote_links.length !== 1) {
    return {
      statusCode: 400,
      body: onenote_links.length === 0 
        ? 'no onenote links found (onenote:link)' 
        : 'please only include 1 onenote link per request'
    }
  }

  const link = onenote_links.pop();
  const id = shortid.generate();
  const result = `https://1note.me?l=${id}`;
  const params = {
    Bucket: "1note.me",
    Key: id,
    Body: link
  };

  return s3PutObject(s3, params)
    .then(_ => {
      return {
        statusCode: 200,
        body: result
      }
    })
    .catch(err => {
      return {
        statusCode: 500,
        body: err.toString()
      }
    });
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