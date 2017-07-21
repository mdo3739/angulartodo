const nodemailer = require('nodemailer');

module.exports = function(){
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

	var message = {
	    from: 'noreply@blessed.com',
	    to: 'mdo3103@ymail.com',
	    subject: 'Please Confirm Email',
	    text: 'Plaintext version of the message',
	    html: '<p>HTML version of the message</p>'
	};

	/*transporter.sendMail(message, function(error, info){
		if(error) return console.log(error);
		else console.log('Message %s sent: %s', info.messageId, info.response);
	});*/

//	router.get("/signup/:authToken", controller.validateUserForSignup)
};