const express = require("express");
const app = express();
const router = express.Router();
const layouts = require("express-ejs-layouts");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const userController = require("./controllers/userController");
const mysql = require('mysql2/promise');
const methodOverride = require("method-override");
const session = require('express-session');

// DB connection
require('dotenv').config();
exports.connection = async () => {
    try {
        const db = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PW,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            waitForConnections: true,
            insecureAuth: true
        });
        return db;
    } catch (error) {
        console.error("데이터베이스 연결 오류:", error);
        throw error;
    }
};

app.set("port", process.env.PORT || 80);
app.set("view engine", "ejs");

// 세션
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

router.use(
    methodOverride("_method", {
      methods: ["POST", "GET"]
    })
);

router.use(layouts);
router.use(express.static("public"));

router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

router.get("/", homeController.index);
router.get("/login", userController.loginPage);
router.get("/signup", userController.signupPage);
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// 오류 미들웨어
router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});