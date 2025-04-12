const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.header('Authorization').replace('Bearer ', '')
  if (!token) return res.status(401).send('Access Denied: No Token Provided!')

  try {
    const verified = jwt.verify(token, 'fingerprint_customer')
    req.user = verified
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
});


 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
