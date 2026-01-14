const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/user.route')
const taskRoutes = require('./routes/task.route')
const connectDb = require('./config/db')


if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET missing');
}

connectDb();

const corsOptions = {
    
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
};
const app = express();

const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
  res.send('API running');
});


app.use('/api/auth', authRoutes);     
app.use('/api/tasks', taskRoutes);   

app.listen(PORT,()=>{
    console.log(`Server is runing on ${PORT}`);
    
})