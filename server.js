const express = require("express");
const app = express();
const {dbConnect} = require('./utiles/db')
const cors = require('cors')
require("dotenv").config();
const bodyParser = require('body-parser') //value submit to server
const cookieParser = require('cookie-parser') 
const port = process.env.PORT 

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));


app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api/home', require('./routes/home/homeRoutes'))
app.use('/api', require('./routes/authRoutes')) 
app.use('/api', require('./routes/home/customerAuthRoutes')) 
app.use('/api', require('./routes/dashboard/categoryRoutes')) 
app.use('/api', require('./routes/dashboard/productRoutes')) 
app.use('/api', require('./routes/dashboard/sellerRoutes')) 
app.get('/', (req, res)=> res.send('khooz server is running'))
dbConnect()
app.listen(port, () => {
    console.log(`Sever is running on port ${port}!`);
  });
  