
const User = require('../models/user'); 
const Task = require('../models/task'); 

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const task = await Task.create({
      user: req.user._id,
      title,
      description
    });
    
    res.status(201).json({ 
      success: true, 
      task 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    
    res.status(200).json({ 
      success: true, 
      count: tasks.length,
      tasks 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true, 
      task: updatedTask 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get user stats
    const taskStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const stats = {
      pending: 0,
      completed: 0,
      total: 0
    };
    
    taskStats.forEach(stat => {
      stats[stat._id.toLowerCase()] = stat.count;
    });
    stats.total = stats.pending + stats.completed;
    
    res.status(200).json({ 
      success: true, 
      profile: {
        user,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

