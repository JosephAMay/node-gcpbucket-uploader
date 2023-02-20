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

## Database Setup

Create a MySQL instance in CloudSQL then open up the console in Google cloud to connect to the instance. Then run the `tables.sql` script inside of the sql folder to create the tables.

To connect to your CloudSQL database while running the app locally you must have a .env file with the `DB_HOST`, `DB_DATABASE`, `DB_USER`, and `DB_PASS` values.

```sh
DB_HOST= Public IP address of instance
DB_DATABASE= DB name here
DB_USER= username
DB_PASS= password
```

Also you will need to whitelist your computer's public ip address so that GCP will let you connect. You can do this by going to your instance in the Google Cloud console and clicking on Connections -> Authorized Networks -> Add Network then put in your ip address.

Run `npm run dev` to start up the server. You can now make http POST requests to [http:localhost:5000/user](http:localhost:5000/user) with a request body that includes `{password: -, first_name: -, last_name: -}` to add a row to the `user` table. The response will return the generated user id that you can then use to query for the user's information by sending a GET to [http:localhost:5000/user/{user_id}](http:localhost:5000/user/user_id)


