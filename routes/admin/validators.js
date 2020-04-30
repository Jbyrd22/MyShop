const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
	requireTitle                : check('title')
		.trim()
		.isLength({ min: 2, max: 40 })
		.withMessage('Must be between 2 and 40 characters'),

	requirePrice                : check('price')
		.trim()
		.toFloat()
		.isFloat({ min: 1 })
		.withMessage('Must be at least $1'),

	requireEmail                : check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			const foundUser = await usersRepo.getOneBy({ email });

			if (foundUser) {
				throw new Error('This email is in use already!');
			}
			//custom must return true to indicate success or it will always have error
			return true;
		}),

	requirePassword             : check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters'),

	requirePasswordConfirmation : check('passwordConfirmation')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters')
		.custom((passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error('The passwords must match!!');
			}
			//custom must return true to indicate success or it will always have error
			return true;
		}),

	matchUserEmail              : check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Not a valid Email')
		.custom(async (email) => {
			const user = await usersRepo.getOneBy({ email });
			if (!user) {
				throw new Error('Email was not found');
			}
		}),

	matchUserPassword           : check('password').trim().custom(async (password, { req }) => {
		const user = await usersRepo.getOneBy({ email: req.body.email });

		if (!user) {
			throw new Error('Invalid Password');
		}

		const validPassword = await usersRepo.comparePasswords(user.password, password);

		if (!validPassword) {
			throw new Error('Password is not correct');
		}

		return true;
	})
};
