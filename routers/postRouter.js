const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const bodyParser = require('body-parser');


// JSON데이터의 최대 크기 설정
router.use(bodyParser.json({ limit: '50mb' })); 
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// 게시글 작성
router.get("/new", postController.newPost);
router.post("/register", postController.registerPost);

// 게시글 수정
router.get('/:postId/edit', postController.editPost);
router.put("/update", postController.updatePost);

//게시글 열람
router.get("/:post_id", postController.showPost);

module.exports = router;