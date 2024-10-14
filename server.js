import app from "./index.js";
import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHTEXCEPTION --SHUTTING DOWN--");
  process.exit(1);
  // })
});

dotenv.config({ path: "./config.env" });

let port;

if (process.env.NODE_ENV == "development") {
  console.log("In development");
  port = process.env.port;
} else if (process.env.NODE_ENV == "production") {
  console.log("In production");
  port = 6071;
}

const server = app.listen({ port }, async () => {
  console.log("Server started in http://localhost:", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLEDREJECTION --SHUTTING DOWN--");
  //instent of using process.exit(1); directly
  server.close(() => {
    //It will reject all the responce and then exit.
    process.exit(1);
  });
});
