const express = require("express"), //애플리케이션에 express 모듈 추가
    app = express(), //app에 express 웹 서버 애플리케이션 할당
    router = express.Router(),
    layouts = require("express-ejs-layouts"), //모듈 설치
    bodyParser = require('body-parser');
    postController = require("./controllers/postController"),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    mysql = require('mysql2/promise'),
    
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
            insecureAuth: true
        });
        return db; // 연결된 데이터베이스 객체 반환
    } catch (error) {
        console.error("데이터베이스 연결 오류:", error);
        throw error; // 오류 발생시 처리
    }
};

app.use(bodyParser.json());

app.set("port", process.env.PORT || 80); //포트 80으로 연결 셋팅
app.set("view engine", "ejs"); //뷰 엔진을 ejs로 설정

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
router.get("/post/new", postController.newPost);
router.post("/post/register", postController.registerPost);


router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
}); //최종적으로 제대로 작동하는지 확인 