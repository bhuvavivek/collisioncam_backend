import sgMail from '@sendgrid/mail'

const sendMail = ({to, html, title}) => {
    
sgMail.setApiKey(process.env.SENDGRID_API)
const msg = {
  to: to,
  from: 'tate@collisioncam.org',
  subject: title,
  text: 'and easy to do anywhere, even with Node.js',
  html: html,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}

export default sendMail