module.exports = function(token){
	var link = 'localhost:8000/api/confirm/' + token;
	var message = {
	    from: 'noreply@blessed.com',
	    to: 'mdo3739@gmail.com',
	    subject: 'Please Confirm Email',
	    text: 'Plaintext version of the message',
	    html: '<p>Click <a href="' + link + '">here</a> to confirm email</p>',
	    attachDataUrls: true
	};

	return message;
};