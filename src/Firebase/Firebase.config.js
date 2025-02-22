// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_apiKey}`,
  authDomain: `${import.meta.env.VITE_authDomain}`,
  projectId: `${import.meta.env.VITE_projectId}`,
  storageBucket: `${import.meta.env.VITE_storageBucket}`,
  messagingSenderId: `${import.meta.env.VITE_messagingSenderId}`,
  appId: `${import.meta.env.VITE_appId}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://task-management4.web.app",
//   "https://task-management4.firebaseapp.com",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (allowedOrigins.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());

// // MongoDB Connection
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nu6ig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     const usersCollection = client.db("taskManagement").collection("users");
//     const taskCollection = client.db("taskManagement").collection("tasks");

//     // **Get All Users**
//     app.get("/users", async (req, res) => {
//       const email = req.query.email;
//       const query = email ? { email } : {};
//       const result = await usersCollection.find(query).toArray();
//       res.send(result);
//     });

//     // **Get All Tasks**
//     app.get("/tasks", async (req, res) => {
//       const email = req.query.email;
//       const query = email ? { userEmail: email } : {};
//       const tasks = await taskCollection.find(query).toArray();
//       res.send(tasks);
//     });

//     // **Create User**
//     app.post("/postUser", async (req, res) => {
//       try {
//         const { name, email } = req.body;
//         const query = { email };
//         const exist = await usersCollection.findOne(query);
//         if (exist) {
//           return res.status(409).json({ message: "User already exists" });
//         }
//         const user = { name, email };
//         await usersCollection.insertOne(user);
//         res.status(201).json({ message: "User added successfully", user });
//       } catch (error) {
//         res
//           .status(500)
//           .json({ message: "Internal Server Error", error: error.message });
//       }
//     });

//     // **Create Task**
//     app.post("/addTask", async (req, res) => {
//       try {
//         const task = req.body;
//         const result = await taskCollection.insertOne(task);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .json({ message: "Failed to insert task", error: error.message });
//       }
//     });

//     // **Update Task**
//     app.patch("/updateTask/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const task = req.body;
//         const filter = { _id: new ObjectId(id) };
//         const updateDoc = { $set: task };
//         const result = await taskCollection.updateOne(filter, updateDoc);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .json({ message: "Failed to update task", error: error.message });
//       }
//     });

//     // **Update Task Category**
//     app.put("/tasks/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const { category } = req.body;
//         const timestamp = new Date().toLocaleString();
//         const filter = { _id: new ObjectId(id) };
//         const updateDoc = { $set: { category, timestamp } };
//         const result = await taskCollection.updateOne(filter, updateDoc);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .json({ message: "Failed to update category", error: error.message });
//       }
//     });

//     app.put("/tasksUpdateOrder", async (req, res) => {
//       const { tasks } = req.body;
//       const bulkOperations = tasks.map((task) => ({
//         updateOne: {
//           filter: { _id: new ObjectId(task._id) },
//           update: { $set: { serial: task.serial } },
//         },
//       }));
//       const result = await taskCollection.bulkWrite(bulkOperations);

//       res.send(result);
//     });

//     // **Delete Task**
//     app.delete("/tasks/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await taskCollection.deleteOne(query);
//         res.send(result);
//       } catch (error) {
//         res
//           .status(500)
//           .json({ message: "Failed to delete task", error: error.message });
//       }
//     });
//   } finally {
//     // Ensure MongoDB client is properly closed when needed
//   }
// }

// run().catch(console.dir);

// // **Root API**
// app.get("/", (req, res) => {
//   res.send("🚀 Task Management API is running...");
// });

// // **Server Listen**
// app.listen(port, () => {
//   console.log(`🚀 Server is running on http://localhost:${port}`);
// });
