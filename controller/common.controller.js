import AWS from "aws-sdk";
import catchAsync from "../utils/catchAsync.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const s3 = new AWS.S3({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Mock user database
const userStore = {}; // Store users by hard token

const createHardToken = (username, password) => {
  return bcrypt.hashSync(username + password, 10);
};

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (username.trim().length == 0 || password.trim().length == 0) {
    return res.status(400).json({ message: "invalid input" });
  }

  // Check if username already exists
  if (Object.values(userStore).some((u) => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const hardToken = createHardToken(username, password); // Generate hard token

  // Store user by hard token
  userStore[hardToken] = { username, password: hashedPassword };

  console.log(userStore);
  res.status(201).json({
    message: "User registered successfully",
    token: hardToken, // Send hard token to user
  });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = Object.values(userStore).find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Unauthorized access!" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Unauthorized!" });

  const hardToken = Object.keys(userStore).find(
    (token) => userStore[token].username === username
  );
  console.log(userStore);
  res.json({ token: hardToken }); // Return the hard token to the user
};

export const uploadJson = catchAsync(async (req, res) => {
  // Extract token from 'Authorization' header
  const authHeader = req.headers.authorization;
  console.log("authHeader :", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

  // Check if the user exists by hard token
  const user = userStore[token];
  if (!user) return res.status(401).json({ message: "Unauthorized access!" });

  // Create a unique S3 key for the user's data
  const s3Key = `${user.username}/data-${Date.now()}.json`;

  // Upload JSON to S3
  const params = {
    Bucket: "vig-pro-storage",
    Key: s3Key,
    Body: JSON.stringify(req.body.jsonData),
    ContentType: "application/json",
  };

  await s3.upload(params).promise();

  res.status(201).json({
    status: "success",
    message: "JSON data uploaded successfully!",
    key: s3Key,
  });
});

export const retriveJson = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

  // Check if the user exists by hard token
  const user = userStore[token];
  if (!user) return res.status(401).json({ message: "Unauthorized access!" });

  // List all objects for the user
  const params = {
    Bucket: "vig-pro-storage",
    Prefix: `${user.username}/`,
  };

  const data = await s3.listObjectsV2(params).promise();

  const jsonPromises = data.Contents.map(async (item) => {
    const objectData = await s3
      .getObject({
        Bucket: "vig-pro-storage",
        Key: item.Key,
      })
      .promise();
    return JSON.parse(objectData.Body.toString());
  });

  const userJsonData = await Promise.all(jsonPromises);

  res.status(200).json({
    status: "Success",
    data: userJsonData,
  });
});
