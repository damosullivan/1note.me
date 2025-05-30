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
      
      // Use JavaScript redirect with error handling
      const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Opening OneNote...</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .error { color: #d73027; background: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .success { color: #1a9850; }
        .loading { color: #666; }
    </style>
</head>
<body>
    <h2>Opening OneNote...</h2>
    <p id="status" class="loading">Attempting to open OneNote Desktop...</p>
    
    <div id="error-message" class="error" style="display: none;">
        <h3>⚠️ OneNote Desktop Not Found</h3>
        <p>It looks like OneNote Desktop isn't installed on this device, or the <code>onenote:</code> protocol isn't registered.</p>
        <p><strong>To fix this:</strong></p>
        <ul>
            <li>Install <a href="https://www.microsoft.com/en-us/microsoft-365/onenote/digital-note-taking-app" target="_blank">OneNote Desktop</a></li>
            <li>Or try the manual link below</li>
        </ul>
        <p><strong>Manual link:</strong> <code>${decodedLink}</code></p>
        <p><a href="${decodedLink}">Click here to try opening OneNote manually</a></p>
    </div>

    <script>
        function attemptRedirect() {
            try {
                // Set a timer to show error message if redirect doesn't work
                const timer = setTimeout(() => {
                    document.getElementById('status').style.display = 'none';
                    document.getElementById('error-message').style.display = 'block';
                }, 2000);
                
                // Try to redirect
                window.location.href = "${decodedLink.replace(/"/g, '\\"')}";
                
                // If we get here quickly, the redirect might have failed immediately
                setTimeout(() => {
                    document.getElementById('status').textContent = 'If OneNote didn\\'t open, see the message below...';
                    document.getElementById('status').className = 'loading';
                }, 500);
                
            } catch (error) {
                console.error('Redirect failed:', error);
                document.getElementById('status').style.display = 'none';
                document.getElementById('error-message').style.display = 'block';
            }
        }
        
        // Start the redirect attempt
        attemptRedirect();
    </script>
    
    <noscript>
        <div class="error">
            <p>JavaScript is disabled. Click here to open OneNote: <a href="${decodedLink}">${decodedLink}</a></p>
        </div>
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