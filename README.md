# node-gcpbucket-uploader

A basic node server for uploading files to a [google cloud storage bucket](https://cloud.google.com/storage/docs/creating-buckets). It uses [Express](https://expressjs.com/) to create the server and the [Multer npm package](https://www.npmjs.com/package/multer) for accepting files through http requests.

## Running Locally

`cd` into the [server](/server) and run `npm i` in each directory to install the npm packages.

Add a `.env` file in the [server](/server) and add the following keys:

```sh
BUCKET_ID #Your gcp bucket id
```

You also need to create a [GCP service account](https://cloud.google.com/iam/docs/service-accounts) with appropriate access to your Cloud Storage Bucket. Download the JSON key, and put this under [config](/server/config) directory as `key.json`.

Run `npm run dev` to start up the server. You can now make http requests to [http:localhost:5000/upload](http:localhost:5000/upload) with header 'Content-Type': 'multipart/form-data' and a body that includes 'uploaded_file' containing your file to be uploaded.
