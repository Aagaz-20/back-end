const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const paymentController = require('../controllers/payment');
const eventRegistrationController = require('../controllers/eventRegister');
const isAuth = require('../middlewares/isAuth');

router.post('/register', authController.postSignUp);
router.post('/login', authController.postLogin);
router.get('/logindata', isAuth.userAuth, authController.getLoginData);
router.get('/events', eventRegistrationController.getEventsData);
router.post('/eventregistration', isAuth.userAuth, eventRegistrationController.postEventRegister);
router.get('/verification/:token', authController.postEmailVerification);
router.post('/forgotpassword', authController.postForgotPassword);
router.post('/resetpassword', authController.postVerify);
router.get('/payment', paymentController.postPayment);
router.post('/confirmation', paymentController.postConfirmation);

module.exports = router;