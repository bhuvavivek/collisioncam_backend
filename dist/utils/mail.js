"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mail_1 = tslib_1.__importDefault(require("@sendgrid/mail"));
const sendMail = ({ to, html, title }) => {
    mail_1.default.setApiKey(process.env.SENDGRID_API);
    const msg = {
        to: to,
        from: 'tate@collisioncam.org',
        subject: title,
        text: 'and easy to do anywhere, even with Node.js',
        html: html,
    };
    mail_1.default
        .send(msg)
        .then(() => {
        console.log('Email sent');
    })
        .catch((error) => {
        console.error(error);
    });
};
exports.default = sendMail;
//# sourceMappingURL=mail.js.map