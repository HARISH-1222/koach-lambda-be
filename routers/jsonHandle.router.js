import express from "express";
const Router = express.Router();
import * as jsonHandle from "../controller/common.controller.js";

Router.route("/uploadJson").post(jsonHandle.uploadJson);
Router.route("/retriveJson").get(jsonHandle.retriveJson);

export default Router;
