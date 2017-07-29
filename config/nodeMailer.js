const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
	host: 'smtp.sendgrid.net',
	port: 587,//'465',
	secure: false,
	//logger: true,
	auth: {
		user: process.env.SENDGRID_USERNAME,
		pass: process.env.SENDGRID_PASSWORD
	}

});

module.exports = transporter;