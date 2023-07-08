const express = require("express");

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const bcryptSalt = bcrypt.genSaltSync(10);

const cors = require("cors");

const app = express();

const User = require("./model/User"); //model for user

const Message = require("./model/Message");

const ws = require("ws");

require("dotenv").config();

const CookieParser = require("cookie-parser");

const jwtSecret = process.env.JWT_SECRET;

const jwt = require("jsonwebtoken");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(CookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// ---------------------------------------

// Register a new user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashPassword,
    });

    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          console.error("Failed to create JWT token:", err);
          res.status(500).json("Internal server error");
        } else {
          res.cookie("token", token).status(201).json({
            id: createdUser._id,
          });
        }
      }
    );
  } catch (err) {
    console.error("Failed to register user:", err);
    res.status(500).json("Internal server error");
  }
});

///login///

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});

// profile///

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;

      res.json(userData);
    });
  } else {
    res.status(401).json("No token");
  }
});

// -----------

const server = app.listen(4040);

const wss = new ws.WebSocketServer({ server }); //step 1   wss - holds all the connection

wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie; // process to handle and receive token from cookie
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token=")); // to filter and get token
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    // when we do this we get a object value of sending from the front
    const messageData = JSON.parse(message.toString()); // convert object to string
    const { recipient, text } = messageData; //here we get recep and text from front end

    if (recipient && text) {
      // this is to check if available then send to other user

      const messageDoc = await Message.create({
        //puttign in databse
        sender: connection.userId,
        recipient,
        text,
      });

      [...wss.clients]
        .filter((c) => c.userId === recipient) //here its checks the userid of target and from frotn is same
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              id: messageDoc._id,
            })
          )
        ); //we get userid from connection
    }
  });

  //to see who is online or active connection  --- clients ---

  //notify everyone about online people (when somone connets)

  [...wss.clients].forEach((client) => {
    //with this we can iterate all the existing active clients adn send in json
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });
});
