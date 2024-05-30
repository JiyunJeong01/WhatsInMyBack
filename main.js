const express = require("express"), //애플리케이션에 express 모듈 추가
    app = express(), //app에 express 웹 서버 애플리케이션 할당
    layouts = require("express-ejs-layouts"), //모듈 설치
    mysql = require('mysql2/promise'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require("method-override");

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

app.set("port", process.env.PORT || 80); //포트 80으로 연결 셋팅
app.set("view engine", "ejs"); //뷰 엔진을 ejs로 설정

// JSON데이터의 최대 크기 설정
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(morgan('dev'));
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));
app.use(layouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const postRouter = require('./routers/postRouter');
const homeRouter = require('./routers/homeRouter');
const errorRouter = require('./routers/errorRouter');

app.use("/", homeRouter);
app.use("/post", postRouter);
app.use(errorRouter);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
}); //최종적으로 제대로 작동하는지 확인 