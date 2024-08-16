// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const SECRET_KEY = "ABC";

// const Admin = require("../models/Admin");
// const API = require("../models/Api");
// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8080 });

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decodedToken = jwt.verify(token, SECRET_KEY);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// router.post("/admin/signup", async (req, res) => {
//   try {
//     const { email, password, phone, username } = req.body;
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res
//         .status(400)
//         .json({ message: "Admin with this email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newAdmin = new Admin({
//       username,
//       email,
//       password: hashedPassword,
//       phone,
//     });
//     await newAdmin.save();

//     res.status(201).json({ message: "Admin registered successfully" });
//   } catch (error) {
//     console.error("Admin Signup error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     let user;

//     user = await Admin.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(402).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ email: user.email }, SECRET_KEY, {
//       expiresIn: "24h",
//     });

//     res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.post("/api/add", verifyToken, async (req, res) => {
//   try {
//     const { name, endpoint, owner, status, version, description } = req.body;

//     // Validate the required fields
//     if (!name || !endpoint || !owner || !status || !version || !description) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newAPI = new API({
//       name,
//       endpoint,
//       owner,
//       status,
//       lastScanned: new Date(),
//       creationDate: new Date(),
//       version,
//       description,
//     });

//     await newAPI.save();

//     broadcast(newAPI);

//     res.status(201).json({
//       message: "API added successfully",
//       api: newAPI // Include the newly created API in the response
//     });
//   } catch (error) {
//     console.error("Error adding API:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// router.get("/api/all", verifyToken, async (req, res) => {
//   try {
//     const apis = await API.find();
//     res.status(200).json(apis);
//   } catch (error) {
//     console.error("Error fetching API:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// router.get("/api/:apiId", verifyToken, async (req, res) => {
//   try {
//     const { apiId } = req.params;
//     const api = await API.findOne({ _id: apiId });
//     res.status(200).json(api);
//   } catch (error) {
//     console.error("Error fetching API:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   ws.on('message', (message) => {
//     console.log(`Received message: ${message}`);
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// // Broadcast function to send messages to all connected clients
// const broadcast = (data) => {
//   wss.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(data));
//     }
//   });
// };

// module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "ABC";

const Admin = require("../models/Admin");
const API = require("../models/Api");
const User = require("../models/User"); // New model
const ActivityLog = require("../models/ActivityLog"); // New model
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

router.post("/admin/signup", async (req, res) => {
  try {
    const { email, password, phone, username } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      phone,
    });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;

    user = await Admin.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(402).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Existing API routes
router.post("/api/add", verifyToken, async (req, res) => {
  try {
    const { name, endpoint, owner, status, version, description } = req.body;

    if (!name || !endpoint || !owner || !status || !version || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAPI = new API({
      name,
      endpoint,
      owner,
      status,
      lastScanned: new Date(),
      creationDate: new Date(),
      version,
      description,
    });

    await newAPI.save();

    broadcast(newAPI);

    res.status(201).json({
      message: "API added successfully",
      api: newAPI, // Include the newly created API in the response
    });
  } catch (error) {
    console.error("Error adding API:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/api/all:role", verifyToken, async (req, res) => {
  try {
    const role = query.role;

    console.log("Requested role:", role);

    if (!role) {
      return res.status(400).json({ message: "Role parameter is required" });
    }

    let apis;
    if (role === 'admin') {
      apis = await Api.find();
    } else if (role === 'user') {
      apis = await Api.find({ role: 'user' });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    return res.status(200).json(apis);
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




router.get("/api/:apiId", verifyToken, async (req, res) => {
  try {
    const { apiId } = req.params;
    const api = await API.findOne({ _id: apiId });
    res.status(200).json(api);
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// New API routes for users
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/users", verifyToken, async (req, res) => {
  try {
    const { email, password, phone, username, role } = req.body;

    if (!email || !password || !phone || !username || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    await newUser.save();

    broadcast({ type: "userAdded", data: newUser });

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/users/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    broadcast({ type: "userUpdated", data: updatedUser });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/users/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    broadcast({ type: "userDeleted", data: userId });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// New API routes for activity logs
router.get("/activity-logs", verifyToken, async (req, res) => {
  try {
    const logs = await ActivityLog.find();
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/activity-logs", verifyToken, async (req, res) => {
  try {
    const { action, description, timestamp } = req.body;

    if (!action || !description || !timestamp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newLog = new ActivityLog({ action, description, timestamp });
    await newLog.save();

    res
      .status(201)
      .json({ message: "Activity log added successfully", log: newLog });
  } catch (error) {
    console.error("Error adding activity log:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Broadcast function to send messages to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = router;
