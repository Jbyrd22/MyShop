const express = require('express');
const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	matchUserEmail,
	matchUserPassword
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post(
	'/signup',
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	handleErrors(signupTemplate),
	async (req, res) => {
		//req.body and req.session are added in as middleware using app.use at top.
		const { email, password } = req.body;
		const newUser = await usersRepo.create({ email, password });

		//Store the id of that user inside the users cookie
		//req.session is an object that we can add attributes to and cookie-session maintains it for us.
		req.session.userId = newUser.id;
		res.redirect('/admin/products');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.redirect('/admin/products');
});

router.get('/signin', (req, res) => {
	if (req.session.userId) {
		return res.redirect('/admin/products');
	}
	res.send(signinTemplate({}));
});

router.post('/signin', [ matchUserEmail, matchUserPassword ], handleErrors(signinTemplate), async (req, res) => {
	const { email } = req.body;
	const foundUser = await usersRepo.getOneBy({ email });

	req.session.userId = foundUser.id;

	res.redirect('/admin/products');
});

module.exports = router;
