const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const stepController = require('../controllers/stepController');
const sleepController = require('../controllers/sleepController');
const nutritionController = require('../controllers/nutritionController');
const authController= require('../controllers/authController')
const cycleController = require('../controllers/cycleController')
const blogController= require('../controllers/blogController')
// Routes cho User
router.post('/users', userController.addUser);
router.get('/users/:id', userController.getUser);

// Routes cho Step
router.post('/steps', stepController.createStep);
router.get('/steps/:userId/:date', stepController.getStepsByUser);
router.get('/steps/:userId', stepController.getAllStepsByUser);
// Routes cho Sleep
router.post('/sleeps', sleepController.createSleep);
router.get('/sleeps/:userId/', sleepController.getSleep);

// Routes cho Nutrition
router.post('/nutritions', nutritionController.createNutrition);
router.get('/nutritions/:userId/:date', nutritionController.getNutrition);

router.post('/login', authController.login);

router.post('/cycle',cycleController.addCycle)
router.get('/cycle/:userId',cycleController.getCyclesByUser)
router.delete('/cycle/:id', cycleController.deleteCycle);

router.get('/blog',blogController.getAllBlogs)
router.delete('/blog/:id',blogController.deleteBlog)
router.post('/blog',blogController.addBlog)
module.exports = router;
