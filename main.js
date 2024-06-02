const express = require("express");//애플리케이션에 express 모듈 추가
const app = express();//app에 express 웹 서버 애플리케이션 할당
const layouts = require("express-ejs-layouts");//모듈 설치
const bodyParser = require('body-parser');
const morgan = require('morgan');
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
            insecureAuth: true,
            connectionLimit: 30,
            queueLimit: 10
        });
        return db; // 연결된 데이터베이스 객체 반환
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
  saveUninitialized: true
}));

// JSON데이터의 최대 크기 설정
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(morgan('dev'));
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));
app.use(layouts); //layouts파일사용
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// 로그아웃 (임시)
// router.get('/logout', authController.logout);

const postRouter = require('./routers/postRouter');
const authRouter = require('./routers/authRouter');
const homeRouter = require('./routers/homeRouter');
const errorRouter = require('./routers/errorRouter');

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use(errorRouter);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});