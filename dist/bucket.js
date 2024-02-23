"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAndPushFile = exports.deleteFile = exports.uploadFile = exports.testConnection = void 0;
const tslib_1 = require("tslib");
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const fs = tslib_1.__importStar(require("fs"));
const dotenv = tslib_1.__importStar(require("dotenv"));
dotenv.config();
// Configure AWS SDK
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Create an instance of the S3 service
const s3 = new aws_sdk_1.default.S3();
// Function to test the connection to AWS S3
async function testConnection() {
    try {
        const response = await s3.listBuckets().promise();
        console.log("Connection to AWS S3 successful.");
        console.log("Buckets:", response.Buckets);
    }
    catch (error) {
        console.error("Error connecting to AWS S3:", error);
    }
}
exports.testConnection = testConnection;
// Function to upload a file to the S3 bucket
async function uploadFile(bucketName, fileName, fileContent, contentType) {
    const fileExtension = getFileExtension(fileName);
    const calculatedContentType = contentType || getContentType(fileExtension);
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
        ACL: "public-read",
        ContentType: "image/jpeg", // Use the calculated content type
    };
    try {
        console.log(params);
        const uploadResponse = await s3
            .upload({
            ...params,
            ContentLength: fileContent.length, // Add the ContentLength parameter
        })
            .promise();
        console.log(`File ${fileName} uploaded successfully.`);
        // Save the link and key into your database
        const link = uploadResponse.Location;
        const key = uploadResponse.Key;
        // Save the link and key into your database here...
        return link; // Return the link to the uploaded file
    }
    catch (error) {
        console.error(`Failed to upload file ${fileName}: ${error.message}`);
        throw new Error(`Failed to upload file ${fileName}: ${error.message}`);
    }
}
exports.uploadFile = uploadFile;
function getFileExtension(fileName) {
    const parts = fileName.split(".");
    return parts.length > 1 ? parts[parts.length - 1] : "";
}
function getContentType(fileExtension) {
    switch (fileExtension.toLowerCase()) {
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "gif":
            return "image/gif";
        case "pdf":
            return "application/pdf";
        case "mp4":
            return "video/mp4";
        case "avi":
            return "video/x-msvideo";
        case "mov":
            return "video/quicktime";
        // Add more cases for other file types as needed
        default:
            return "application/octet-stream"; // Default to binary data if content type is unknown
    }
}
// Function to delete a file from the S3 bucket
async function deleteFile(bucketName, fileName) {
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };
    await s3.deleteObject(params).promise();
    console.log(`File ${fileName} deleted successfully.`);
}
exports.deleteFile = deleteFile;
async function uploadAndPushFile(folder, file, fileName, uniqueParameter) {
    if (file) {
        try {
            const randomNumber = getRandomNumber(100000, 999999);
            const key = `${fileName}-${uniqueParameter}-${randomNumber}`;
            const fileData = fs.readFileSync(file.tempFilePath);
            // Determine file type based on the extension
            const fileExtension = getFileExtension(file.name);
            const contentType = getContentType(fileExtension);
            const uploadParams = {
                Bucket: `collisioncam-images/${folder}`,
                Key: key,
                Body: fileData,
                ACL: "public-read",
                ContentType: contentType,
            };
            const uploadPromise = new Promise((resolve, reject) => {
                s3.upload(uploadParams, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
            const uploadedData = await uploadPromise;
            return uploadedData;
        }
        catch (error) {
            return `Failed to upload file ${fileName}: ${error.message}`;
        }
    }
    return;
}
exports.uploadAndPushFile = uploadAndPushFile;
// testConnection()
// collisioncam
//# sourceMappingURL=bucket.js.map