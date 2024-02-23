"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getISOWeek = exports.decodeSecretToken = exports.encodeSecretToken = exports.createRandomBytes = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("config"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const aws_sdk_1 = tslib_1.__importDefault(require("aws-sdk"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
class Helper {
    async getSignedUrlAWS(fileName, signedUrlExpireSeconds = 60 * 60) {
        if (!fileName || (fileName && fileName.length === 0))
            return "";
        const serviceConfigOptions = {
            region: config_1.default.get("awsS3.bucketRegion"),
            endpoint: new aws_sdk_1.default.Endpoint(config_1.default.get("awsS3.secretEntPoint")),
            accessKeyId: config_1.default.get("awsS3.accessKeyId"),
            secretAccessKey: config_1.default.get("awsS3.secretAccessKey"),
            signatureVersion: "v4",
        };
        const s3 = new aws_sdk_1.default.S3(serviceConfigOptions);
        const url = s3.getSignedUrl("getObject", {
            Bucket: config_1.default.get("awsS3.bucketName"),
            Key: fileName,
            Expires: signedUrlExpireSeconds,
        });
        return url;
    }
    async deleteObjectAWS(fileName) {
        console.log("file receiving in delete object", fileName);
        const serviceConfigOptions = {
            region: config_1.default.get("awsS3.bucketRegion"),
            endpoint: new aws_sdk_1.default.Endpoint(config_1.default.get("awsS3.secretEntPoint")),
            accessKeyId: config_1.default.get("awsS3.accessKeyId"),
            secretAccessKey: config_1.default.get("awsS3.secretAccessKey"),
            signatureVersion: "v4",
        };
        const s3 = new aws_sdk_1.default.S3(serviceConfigOptions);
        s3.deleteObject({
            Bucket: config_1.default.get("awsS3.bucketName"),
            Key: fileName,
        }, (err, data) => {
            if (err) {
                console.log("error occured", err);
            }
            else {
                return true;
            }
        });
    }
    async generateHash() {
        var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
        return (timestamp +
            "xxxxxxxxxxxxxxxx"
                .replace(/[x]/g, function () {
                return ((Math.random() * 16) | 0).toString(16);
            })
                .toLowerCase());
    }
    async generateOTP() {
        if (config_1.default.get("env") === "production") {
            return Math.floor(100000 + Math.random() * 900000);
        }
        else {
            return 123456;
        }
    }
    async sendSMS(to, message) {
        const accountSid = config_1.default.get("twilio.sid"), authToken = config_1.default.get("twilio.secret"), client = require("twilio")(accountSid, authToken);
        client.messages
            .create({
            body: message,
            from: config_1.default.get("twilio.phoneNumber"),
            to: to,
        })
            .then((message) => {
            //console.log(message.sid)
        });
    }
    async sendEmail(to, subject, content) {
        //to = `srvitality@yopmail.com`;
        const transporter = require("nodemailer").createTransport({
            host: config_1.default.get("mail.host"),
            port: config_1.default.get("mail.port"),
            auth: {
                user: config_1.default.get("mail.user"),
                pass: config_1.default.get("mail.pass"),
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        require("ejs").renderFile("src/public/email-templates/index.ejs", content, function (err, data) {
            if (err) {
                return console.log(err);
            }
            else {
                content.content += `<p> For any kind of assistance, feel free to contact us at <a href="${config_1.default.get("siteUrl")}">${config_1.default.get("siteTitle")}</a>.</p>`;
                let mailOptions = {
                    from: '"' +
                        config_1.default.get("siteTitle") +
                        ' " <' +
                        config_1.default.get("mail.from") +
                        ">",
                    to: to,
                    subject: subject,
                    html: data
                        .replace(/\%TITLE%/g, content.title)
                        .replace(/\%CONTENT%/g, content.content)
                        .replace(/\%SITE_URL%/g, config_1.default.get("siteUrl"))
                        .replace(/\%SITE_EMAIL%/g, config_1.default.get("admin.email"))
                        .replace(/\%SITE_TITLE%/g, config_1.default.get("siteTitle")),
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log("Message not sent: " + error);
                    }
                    //console.log("Message sent: " + info.response);
                });
            }
        });
    }
    async mailStaticTemplates(type, userData) {
        if (userData.email) {
            let title, content = null;
            switch (type) {
                case "reset-password":
                    let reset_link = `${config_1.default.get("siteUrl")}/reset-password/${userData.resetToken}`;
                    if (userData.role == "admin") {
                        reset_link += `/admin`;
                    }
                    title = `Reset your login password`;
                    content = `<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hey ${userData.name ? userData.name : userData.email}!</p>
                    <p class="sm-leading-32" style=""margin: 0 0 24px; font-weight: 400; font-size: 15px; margin: 0 0 16px; --text-opacity: 1; color: #263238; color: rgba(38, 50, 56, var(--text-opacity));">You just requested to reset your password.</p>
                    <p style="margin: 0 0 24px;">
                        Please reset your password by clicking the below link. If link is not working you may copy and paste below url in the browser to continue.
                        <br />
                        ${reset_link}
                    </p>
                    <p>
                        <a href="${reset_link}" style="display: block; font-weight: 600; font-size: 14px; line-height: 100%; padding: 16px 24px; --text-opacity: 1; color: #ffffff; color: rgba(255, 255, 255, var(--text-opacity)); text-decoration: none;">Reset Password Now →</a>
                    </p>
                    `;
                    break;
                case "send-otp":
                    title = `Account verification`;
                    content = `<p style="font-weight: 600; font-size: 18px; margin: 0 0 24px;">Hey ${userData.name ? userData.name : userData.email}!</p>
                    
                    <p style="margin: 0 0 24px;">
                        <strong>${userData.otp}</strong> is your ${config_1.default.get("siteTitle")} account verification code. You can use this code only once and it will auto expire after 5 minutes if not used.
                    </p>`;
                    break;
                case "signup-welcome":
                    title = `Welcome ${userData.name}`;
                    content = `<p style="font-weight: 600; font-size: 18px; margin: 0 0 24px;">Hey ${userData.name ? userData.name : userData.email}!</p>
                    <p class="sm-leading-32" style="font-weight: 600; font-size: 20px; margin: 0 0 16px; --text-opacity: 1; color: #263238; color: rgba(38, 50, 56, var(--text-opacity));">
                        Thanks for signing up! 👋
                    </p>
                    <p style="margin: 0 0 24px;">
                        ${config_1.default.get("siteTitle")} welcomes you to join our creative community, start exploring the resources or showcasing your work.
                    </p>`;
                    break;
                default:
                    break;
            }
            if (title && content) {
                await this.sendEmail(userData.email, title, {
                    title,
                    content,
                });
            }
        }
        else {
            console.log("email address not found to send email");
        }
    }
    async getTimeStops(minutes, start, end) {
        var startTime = moment_1.default(start, "hh:mm");
        var endTime = moment_1.default(end, "hh:mm");
        if (endTime.isBefore(startTime)) {
            endTime.add(1, "day");
        }
        var timeStops = [];
        while (startTime <= endTime) {
            timeStops.push(moment_1.default(startTime).format("hh:mm A"));
            startTime.add(minutes, "minutes");
        }
        return timeStops;
    }
    async userObj(findUser) {
        const user = {
            _id: findUser._id,
            name: findUser.name ? findUser.name : "",
            role: findUser.role,
            email: findUser.email,
            mobile: findUser.mobile ? findUser.mobile : "",
            profileImage: findUser.profileImage,
            dob: findUser.dob ? findUser.dob : "",
            location: findUser.location ? findUser.location : {},
            goals: findUser.goals ? findUser.goals : [],
            documents: findUser.documents ? findUser.documents : {},
            profileApproval: findUser.profileApproval ? findUser.profileApproval : {},
        };
        return user;
    }
}
exports.default = new Helper();
const createRandomBytes = () => new Promise((resolve, reject) => {
    crypto_1.default.randomBytes(30, (err, buff) => {
        if (err)
            reject(err);
        const token = buff.toString("hex");
        resolve(token);
    });
});
exports.createRandomBytes = createRandomBytes;
function encodeSecretToken(randomBytes, paymentId) {
    return Buffer.from(`${randomBytes}:${paymentId}`).toString("base64");
}
exports.encodeSecretToken = encodeSecretToken;
function decodeSecretToken(secretToken) {
    const decodedToken = Buffer.from(secretToken, 'base64').toString('utf-8');
    const [randomBytes, paymentId] = decodedToken.split(':');
    return { randomBytes, paymentId };
}
exports.decodeSecretToken = decodeSecretToken;
function getISOWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
exports.getISOWeek = getISOWeek;
//# sourceMappingURL=helper.js.map