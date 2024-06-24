const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '7c1019bb71ffbd',
        pass: 's638e4422949727',
    },
});

module.exports = transporter;
