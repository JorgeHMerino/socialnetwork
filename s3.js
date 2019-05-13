const knox = require("knox");
const fs = require("fs");

let secrets;

if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: "spicedling"
});

exports.upload = function(request, response, next) {
    if (!request.file) {
        response.sendStatus(500);
    }
    const s3Request = client.put(request.file.filename, {
        "Content-Type": request.file.mimetype,
        "Content-Length": request.file.size,
        "x-amz-acl": "public-read"
    });
    const readStream = fs.createReadStream(request.file.path);
    readStream.pipe(s3Request);

    s3Request.on("response", s3Response => {
        const wasSuccessful = s3Response.statusCode == 200;
        if (wasSuccessful) {
            next();
        } else {
            response.statusCode(500);
        }
    });
};
