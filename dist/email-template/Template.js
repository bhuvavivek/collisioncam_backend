"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestForFreeApproved = exports.rejectTemplete = exports.ApproveTemplete = exports.forgotpasswordTemplete = exports.partnerForm = exports.subscriptionForm = exports.sendSubmitionSuccess = exports.renewSuccess = exports.sendIdPassword = exports.sendRenewLinkTemplate = exports.rejectedTemplete = exports.sendPayemntLinkTemplate = void 0;
const RequestForFree = () => `
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Simple Transactional Email</title>
    <style media="all" type="text/css">
    
    body {
      font-family: Helvetica, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;
      line-height: 1.3;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    
    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%;
    }
    
    table td {
      font-family: Helvetica, sans-serif;
      font-size: 16px;
      vertical-align: top;
    }

    body {
      background-color: #f4f5f6;
      margin: 0;
      padding: 0;
    }
    
    .body {
      background-color: #f4f5f6;
      width: 100%;
    }
    
    .container {
      margin: 0 auto !important;
      max-width: 600px;
      padding: 0;
      padding-top: 24px;
      width: 600px;
    }
    
    .content {
      box-sizing: border-box;
      display: block;
      margin: 0 auto;
      max-width: 600px;
      padding: 0;
    }
    
    .main {
      background: #ffffff;
      border: 1px solid #eaebed;
      border-radius: 16px;
      width: 100%;
    }
    
    .wrapper {
      box-sizing: border-box;
      padding: 24px;
    }
    
    .footer {
      clear: both;
      padding-top: 24px;
      text-align: center;
      width: 100%;
    }
    
    .footer td,
    .footer p,
    .footer span,
    .footer a {
      color: #9a9ea6;
      font-size: 16px;
      text-align: center;
    }
    
    p {
      font-family: Helvetica, sans-serif;
      font-size: 16px;
      font-weight: normal;
      margin: 0;
      margin-bottom: 16px;
    }
    
    a {
      color: #0867ec;
      text-decoration: underline;
    }

    .btn {
      box-sizing: border-box;
      min-width: 100% !important;
      width: 100%;
    }
    
    .btn > tbody > tr > td {
      padding-bottom: 16px;
    }
    
    .btn table {
      width: auto;
    }
    
    .btn table td {
      background-color: #ffffff;
      border-radius: 4px;
      text-align: center;
    }
    
    .btn a {
      background-color: #ffffff;
      border: solid 2px #0867ec;
      border-radius: 4px;
      box-sizing: border-box;
      color: #0867ec;
      cursor: pointer;
      display: inline-block;
      font-size: 16px;
      font-weight: bold;
      margin: 0;
      padding: 12px 24px;
      text-decoration: none;
      text-transform: capitalize;
    }
    
    .btn-primary table td {
      background-color: #0867ec;
    }
    
    .btn-primary a {
      background-color: #0867ec;
      border-color: #0867ec;
      color: #ffffff;
    }
    
    @media all {
      .btn-primary table td:hover {
        background-color: #ec0867 !important;
      }
      .btn-primary a:hover {
        background-color: #ec0867 !important;
        border-color: #ec0867 !important;
      }
    }

    
    .last {
      margin-bottom: 0;
    }
    
    .first {
      margin-top: 0;
    }
    
    .align-center {
      text-align: center;
    }
    
    .align-right {
      text-align: right;
    }
    
    .align-left {
      text-align: left;
    }
    
    .text-link {
      color: #0867ec !important;
      text-decoration: underline !important;
    }
    
    .clear {
      clear: both;
    }
    
    .mt0 {
      margin-top: 0;
    }
    
    .mb0 {
      margin-bottom: 0;
    }
    
    .preheader {
      color: transparent;
      display: none;
      height: 0;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      mso-hide: all;
      visibility: hidden;
      width: 0;
    }
    
    .powered-by a {
      text-decoration: none;
    }
    
    
    @media only screen and (max-width: 640px) {
      .main p,
      .main td,
      .main span {
        font-size: 16px !important;
      }
      .wrapper {
        padding: 8px !important;
      }
      .content {
        padding: 0 !important;
      }
      .container {
        padding: 0 !important;
        padding-top: 8px !important;
        width: 100% !important;
      }
      .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
      .btn table {
        max-width: 100% !important;
        width: 100% !important;
      }
      .btn a {
        font-size: 16px !important;
        max-width: 100% !important;
        width: 100% !important;
      }
    }

    
    @media all {
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
    }
    </style>
  </head>
  <body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">

              <tr>
                <td class="wrapper">
                  <p>Hi there</p>
                  <p>Sometimes you just want to send a simple HTML email with a simple design and clear call to action. This is it.</p>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                    <tbody>
                      <tr>
                        <td align="left">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tbody>
                              <tr>
                                <td> <a href="http://htmlemail.io" target="_blank">Call To Action</a> </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>This is a really simple email template. It's sole purpose is to get the recipient to click the button with no distractions.</p>
                  <p>Good luck! Hope it works.</p>
                </td>
              </tr>

              </table>

            <div class="footer">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">Company Inc, 7-11 Commercial Ct, Belfast BT1 2NB</span>
                    <br> Don't like these emails? <a href="http://htmlemail.io/blog">Unsubscribe</a>.
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by">
                    Powered by <a href="http://htmlemail.io">HTMLemail.io</a>
                  </td>
                </tr>
              </table>
            </div>

           </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>
</div>
        </td>
        <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;
const sendPayemntLinkTemplate = ({ amount, duration, paymentLink, userName, }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #333;
        }

        p {
            color: #555;
        }

        .amount, .duration {
            font-weight: bold;
            color: #007bff;
        }

        .payment-link {
            display: inline-block;
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }

        .payment-link:visited {
          color: #fff;
      }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Dear ${userName},</h2>
        <p>Great news! Your subscription plan request has been approved. Here are the details:</p>
        
        <p><strong>Amount:</strong> <span class="amount">$${amount}</span></p>
        <p><strong>Duration:</strong> <span class="duration">${duration} days</span></p>
        
        <p>To proceed, click on the following payment link:</p>
        
        <a href="${paymentLink}" class="payment-link">Payment Link</a>
        
        <p>We look forward to having you on board!</p>
        
        <p>Best regards,<br>Collision Cam Admin</p>
    </div>
</body>
</html>`;
exports.sendPayemntLinkTemplate = sendPayemntLinkTemplate;
const rejectedTemplete = () => `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Request Rejected</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #F4F4F4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        p {
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background: #007BFF;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 3px;
        }
        .btn:hover {
            background: #0056B3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Subscription Request Rejected</h1>
        <p>Dear User,</p>
        <p>We regret to inform you that your request for subscription has been rejected by the admin of Collision Cam.</p>
        <p>If you have any further queries or concerns, please feel free to contact us.</p>
        <p>Best regards,<br>Collision Cam Admin</p>
    </div>
</body>
</html>`;
exports.rejectedTemplete = rejectedTemplete;
const sendRenewLinkTemplate = ({ amount, duration, paymentLink, userName, }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #333;
        }

        p {
            color: #555;
        }

        .amount, .duration {
            font-weight: bold;
            color: #007bff;
        }

        .payment-link {
            display: inline-block;
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }

        .payment-link:visited {
          color: #fff;
      }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>Dear ${userName},</h2>
        <p>Great news! Your subscription renew request has been approved. Here are the details:</p>
        
        <p><strong>Amount:</strong> <span class="amount">$${amount}</span></p>
        <p><strong>Duration:</strong> <span class="duration">${duration} days</span></p>
        
        <p>To proceed, click on the following payment link:</p>
        
        <a href="${paymentLink}" class="payment-link">Payment Link</a>
        
        <p>We look forward to having you on board!</p>
        
        <p>Best regards,<br>Collision Cam Admin</p>
    </div>
</body>
</html>`;
exports.sendRenewLinkTemplate = sendRenewLinkTemplate;
const sendIdPassword = ({ username, password }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collision Cam - Subscription Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        p {
            color: #555;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Congratulations!</h1>
        <p>Your payment has been received successfully, and your subscription is now active. Here are your login details:</p>
        <p><strong>Username:</strong> ${username}<br>
           <strong>Password:</strong> ${password}</p>
        <p>Your subscription begins today. To access our platform, click on the following login link: <a href="https://collisioncam.org/login">Login</a>.</p>
        <p>We appreciate your trust in Collision Cam. If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Thank you for choosing us!</p>
        <p>Best regards,<br>
           Collision Cam Team</p>
    </div>
</body>
</html>
`;
exports.sendIdPassword = sendIdPassword;
const renewSuccess = ({ username, password }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collision Cam - Subscription Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
        }

        p {
            color: #555;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Congratulations!</h1>
        <p>Your payment has been received successfully, and your subscription is now renew. Here are your login details:</p>
        <p><strong>Username:</strong> ${username}<br>
           <strong>Password:</strong> ${password}</p>
        <p>Your subscription begins today. To access our platform, click on the following login link: <a href="https://collisioncam.org/login">Login</a>.</p>
        <p>We appreciate your trust in Collision Cam. If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Thank you for choosing us!</p>
        <p>Best regards,<br>
           Collision Cam Team</p>
    </div>
</body>
</html>
`;
exports.renewSuccess = renewSuccess;
const sendSubmitionSuccess = ({ username, }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }

        h1 {
            color: #333333;
        }

        p {
            color: #666666;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            background-color: #3498db;
            color: #ffffff;
            border-radius: 5px;
        }

        .button:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Dear ${username},</h1>
        <p>We've received your form submission. Thank you for choosing Collision Cam! Our team is now reviewing your information. If needed, we will get in touch with you soon.</p>
        <p>In the meantime, feel free to explore our website for more information about our products and services.</p>
        <p>Thank you for considering us, and we look forward to potentially working with you.</p>
        <p>Best regards,<br>Collision Cam Team</p>
        <a href="https://collisioncam.org" class="button">Explore Our Website</a>
    </div>
</body>
</html>
`;
exports.sendSubmitionSuccess = sendSubmitionSuccess;
const subscriptionForm = ({ full_name, phone, companyName, website, industry, address, promotionMethod, comments, email, }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }

        h1 {
            color: #333333;
        }

        p {
            color: #666666;
        }

        table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }

        th, td {
            padding: 10px;
            border-bottom: 1px solid #dddddd;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            background-color: #3498db;
            color: #ffffff;
            border-radius: 5px;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Dear Admin,</h1>
        <p>A new form submission has been received on our website. Here are the details:</p>
        
        <table>
         
            <tr>
                <td>Full Name</td>
                <td>${full_name}</td>
            </tr>
            <tr>
                <td>Email Address</td>
                <td>${email}</td>
            </tr>
  
            <tr>
                <td>Phone</td>
                <td>${phone}</td>
            </tr>
            <tr>
                <td>Company Name</td>
                <td>${companyName}</td>
            </tr>
            <tr>
                <td>Website</td>
                <td>${website}</td>
            </tr>
            <tr>
                <td>Industry</td>
                <td>${industry}</td>
            </tr>
            <tr>
                <td>Address</td>
                <td>${address}</td>
            </tr>
            <tr>
                <td>Promotion Method</td>
                <td>${promotionMethod}</td>
            </tr>
            <tr>
                <td>Comments</td>
                <td>${comments}</td>
            </tr>
        </table>

        <p>Please review the submission and take any necessary actions. If you require additional information or wish to contact the user, their email address is provided above.</p>
        
        <p>Thank you for your attention to this matter.</p>
        <p>Best regards,<br>Collision Cam Team</p>

        <a href="https://collisioncam.org" class="button">Explore Our Website</a>
    </div>
</body>
</html>
`;
exports.subscriptionForm = subscriptionForm;
const partnerForm = ({ full_name, phone, address, comment, email, promotion, }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }

        h1 {
            color: #333333;
        }

        p {
            color: #666666;
        }

        table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }

        th, td {
            padding: 10px;
            border-bottom: 1px solid #dddddd;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            text-align: center;
            text-decoration: none;
            background-color: #3498db;
            color: #ffffff;
            border-radius: 5px;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Dear Admin,</h1>
        <p>A new form submission has been received on our website. Here are the details:</p>
        
        <table>
         
            <tr>
                <td>Full Name</td>
                <td>${full_name}</td>
            </tr>
            <tr>
                <td>Email Address</td>
                <td>${email}</td>
            </tr>
  
            <tr>
                <td>Phone</td>
                <td>${phone}</td>
            </tr>
       
            <tr>
                <td>Address</td>
                <td>${address}</td>
            </tr>
            <tr>
                <td>Promotion</td>
                <td>${promotion}</td>
            </tr>
            <tr>
                <td>Comments</td>
                <td>${comment}</td>
            </tr>
        </table>

        <p>Please review the submission and take any necessary actions. If you require additional information or wish to contact the user, their email address is provided above.</p>
        
        <p>Thank you for your attention to this matter.</p>
        <p>Best regards,<br>Collision Cam Team</p>

        <a href="https://collisioncam.org" class="button">Explore Our Website</a>
    </div>
</body>
</html>
`;
exports.partnerForm = partnerForm;
const forgotpasswordTemplete = ({ url, }) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Collision Cam</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333333;
        }

        p {
            color: #555555;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Password Reset - Collision Cam</h1>
        <p>We have received your request to reset your password for your account.</p>
        <p>To proceed with the password reset, please click the link below:</p>
        <p><a href="${url}">Reset Password</a></p>
        <p>If you did not initiate this request, please disregard this email, and your password will remain unchanged.
            For security reasons, the link will expire after a limited time.</p>
        <p>If you encounter any issues or need further assistance, please don't hesitate to contact our support team.</p>
        <p>Thank you for choosing Collision Cam, and we are here to help you with any concerns you may have.</p>
        <p>Best regards,<br>Collision Cam Team</p>
    </div>
</body>

</html>
`;
exports.forgotpasswordTemplete = forgotpasswordTemplete;
const ApproveTemplete = ({ type, username, }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    h1 {
      color: #333;
    }

    p {
      color: #555;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007BFF;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
      color: #777;
      font-size: 14px;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Collision Cam</h1>

    <p>Hello ${username},</p>

    <p>We are pleased to inform you that your ${type} request has been approved by Collision Cam. We look forward to collaborating with you. Please find the details below:</p>

    <p>If you have any questions or need further assistance, feel free to contact us. Thank you for choosing Collision Cam!</p>

    <p class="footer">Best regards,<br> The Collision Cam Team</p>
  </div>

</body>
</html>
`;
exports.ApproveTemplete = ApproveTemplete;
const rejectTemplete = ({ type, username, }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    h1 {
      color: #333;
    }

    p {
      color: #555;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
      color: #777;
      font-size: 14px;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Collision Cam</h1>

    <p>Hello ${username},</p>

    <p>We regret to inform you that your ${type} request with Collision Cam has been declined. We appreciate your interest, and we understand this might be disappointing news.</p>

    <p>If you have any questions or would like more details about the decision, feel free to reach out to our support team. We value your interest in Collision Cam and hope for future opportunities to collaborate.</p>

    <p class="footer">Best regards,<br> The Collision Cam Team</p>
  </div>

</body>
</html>
`;
exports.rejectTemplete = rejectTemplete;
const requestForFreeApproved = ({ link, username, }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    h1 {
      color: #333;
    }

    p {
      color: #555;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007BFF;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
      color: #777;
      font-size: 14px;
    }
  </style>
</head>
<body>

  <div class="container">
    <h1>Collision Cam</h1>

    <p>Hello ${username},</p>

    <p>We are thrilled to inform you that your request has been approved! As a token of appreciation, we're providing you with access to an exclusive video. Click the link below to watch:</p>

    <a href="${username}" class="button">Watch Video</a>

    <p>If you have any questions or need further assistance, feel free to contact us. Thank you for being part of Collision Cam!</p>

    <p class="footer">Best regards,<br> The Collision Cam Team</p>
  </div>

</body>
</html>
`;
exports.requestForFreeApproved = requestForFreeApproved;
//# sourceMappingURL=Template.js.map