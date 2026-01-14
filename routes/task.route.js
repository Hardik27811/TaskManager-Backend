const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

const {protect} = require('../middlewares/auth.middleware')

router.post('/', protect, taskController.addTask);
router.get('/', protect, taskController.getTasks);
router.get('/profile', protect, taskController.getProfile);

router.put('/:id', protect, taskController.updateTask);
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router;