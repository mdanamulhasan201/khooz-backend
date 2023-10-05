const express = require("express");
const { dbConnect } = require("./utiles/db");
const app = express();
const cors = require("cors");
const http = require("http"); //http module er maddome server create kora holo
const bodyParser = require("body-parser"); //value submit to server
const cookieParser = require("cookie-parser");
require("dotenv").config();
const socket = require("socket.io");


const server = http.createServer(app);


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}))

const io = socket(server, {
  cors: {
      origin: '*',
      credentials: true
  }
})


// chat in customer to seller

var allCustomer = []
// var allSeller = []

const addUser = (customerId, socketId, userInfo) => {
  const checkUser = allCustomer.some(u => u.customerId === customerId)
  if (!checkUser) {
      allCustomer.push({
          customerId,
          socketId,
          userInfo
      })
  }
}

io.on("connection", (soc) => {
  console.log("socket server is connect ");
  soc.on('add_user', (customerId, userInfo) =>{
    addUser(customerId, soc.id, userInfo)
    // console.log(allCustomer);
  });
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", require("./routes/ChatRoutes"));
app.use("/api/home", require("./routes/home/homeRoutes"));
app.use("/api/home", require("./routes/order/orderRoutes"));
app.use("/api", require("./routes/home/cartRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/home/customerAuthRoutes"));
app.use("/api", require("./routes/dashboard/categoryRoutes"));
app.use("/api", require("./routes/dashboard/productRoutes"));
app.use("/api", require("./routes/dashboard/sellerRoutes"));
app.use("/api", require("./routes/home/providerRoutes"));
app.get("/", (req, res) => res.send("khooz server is running"));
dbConnect();
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Sever is running on port ${port}!`);
});
