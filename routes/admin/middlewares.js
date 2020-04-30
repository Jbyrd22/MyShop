const { validationResult } = require('express-validator');

module.exports = {
	//this function customizes the return value every time its called which is why it returns a function.
	handleErrors(templateFunc, dataCb) {
		return async (req, res, next) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				let data = {}; //so im not passing in undefined in the res.send call
				if (dataCb) {
					data = await dataCb(req);
				}
				return res.send(templateFunc({ errors, ...data }));
			}

			next();
		};
	},
	//this function doesn't ever change anything so it doesn't need to return a function.
	requireAuth(req, res, next) {
		if (!req.session.userId) {
			return res.redirect('/signin');
		}
		next();
	}
};
