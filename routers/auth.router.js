import express from "express";
const Router = express.Router();
import * as auth from "../controller/common.controller.js";

Router.route("/register").post(auth.registerUser);
Router.route("/login").post(auth.loginUser);

export default Router;
