const Router = require('express').Router;
const userController = require('../controllers/userController');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

const authRouter = new Router;

authRouter.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration);
authRouter.post('/login', userController.login);
authRouter.post('/logout', userController.logout);
authRouter.get('/activate/:link', userController.activate);
authRouter.get('/refresh', userController.refresh);
authRouter.get('/users', authMiddleware, userController.getAllUsers);

module.exports = authRouter;