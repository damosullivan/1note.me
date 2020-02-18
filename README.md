[![Netlify Status](https://api.netlify.com/api/v1/badges/255f4fa4-c52e-4dc8-b073-c628c01945b0/deploy-status)](https://app.netlify.com/sites/1noteme/deploys)

# [OneNote●Me](https://1note.me)

Usable Sharable OneNote Links

## What Is It

Get an easy to use OneNote link that can be shared through messaging apps and will open with OneNote Desktop.

## Why Build It

This was a huge pain point in my previous work place. We used OneNote daily, and there was no easy way to share the OneNote links in Slack. **Now there is**.

## Why not use a link shortner

Link shortners I tries did not support the `onenote:` prefix and would not open OneNote.

## Stack

- [Netlify](https://www.netlify.com/) to serve `html`, `css`, and `js` files. I opted for pure `js` and `css` to keep things simple.
- [Netlify Functions](https://www.netlify.com/products/functions/) to serve as a *backend server* (serverless)
- [AWS S3](https://aws.amazon.com/s3/) as a [key-value store](https://en.wikipedia.org/wiki/Key-value_database). Generate an id (using [shortid](https://www.npmjs.com/package/shortid)), store the link in S3.
