require('dotenv').config(); //DB정보 담고 있는 환경변수 파일 생성

const express = require("express"), //애플리케이션에 express 모듈 추가
  app = express(), //app에 express 웹 서버 애플리케이션 할당
  router = express.Router(),
  layouts = require("express-ejs-layouts"), //모듈 설치
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  profileController = require("./controllers/profileController"),
  mysql = require("mysql2/promise"),
  session = require("express-session"),
  flash = require("connect-flash"),
  methodOverride = require("method-override");

// DB connection
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

app.set("port", process.env.PORT || 80); //포트 80으로 연결 셋팅
app.set("view engine", "ejs"); //뷰 엔진을 ejs로 설정

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

router.use(flash());
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

router.use(layouts);
router.use(express.static("public"));

router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

router.get("/", homeController.index);

/*프로필 라우팅*/
/*프로필 라우팅 방법 정리 필요 */
router.get("/profile/:id", profileController.profile, profileController.profileShow);
router.delete("/profile/:id/:follow", profileController.unfollow);
router.put("/profile/:id/:follow", profileController.follow);
router.get("/profile/:id/collectBookmark", profileController.collectBookmark, profileController.collectBookmarkShow);
router.get("/profile/:id/collectLike", profileController.collectLike, profileController.collectLikeShow);
router.get("/profile/:userId/collectComment/:pageId",profileController.collectComment);
router.get("/profile/:userId/profileModified",profileController.profileModified_GET);
router.post("/profile/:userId/profileModified",profileController.profileModified_POST);
router.get("/profile/:userId/pwModified", profileController.passwordModified_GET);
router.post("/profile/:userId/pwModified", profileController.passwordModified_POST);
router.get("/profile/:userId/cancleAccount", profileController.unregister_GET);
router.post("/profile/:userId/cancleAccount", profileController.unregister_POST);

/*에러 라우팅*/
router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
}); //최종적으로 제대로 작동하는지 확인 