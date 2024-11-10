const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const stepController = require('../controllers/stepController');
const sleepController = require('../controllers/sleepController');
const nutritionController = require('../controllers/nutritionController');
const authContronller= require('../controllers/authController')

// Routes cho User
router.post('/users', userController.addUser);
router.get('/users/:id', userController.getUser);

// Routes cho Step
router.post('/steps', stepController.createStep);
router.get('/steps/:userId/:date', stepController.getStepsByUser);

// Routes cho Sleep
router.post('/sleeps', sleepController.createSleep);
router.get('/sleeps/:userId/', sleepController.getSleep);

// Routes cho Nutrition
router.post('/nutritions', nutritionController.createNutrition);
router.get('/nutritions/:userId/:date', nutritionController.getNutrition);

router.post('/login', authContronller.login);
module.exports = router;
