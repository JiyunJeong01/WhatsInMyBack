const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");


// 게시글 목록 조회
//router.get("/posts", postController.getPosts);
//게시글 열람
router.get("/:postId", postController.getPostDetail);

// 게시글 작성
router.get("/new", postController.newPost);
router.post("/register", postController.registerPost);

// 게시글 수정
router.get('/:postId/edit', postController.editPost);
router.put("/update", postController.updatePost);


/*
// 게시글 삭제
router.delete("/:postId", postController.deletePost);
*/


//댓글 작성
router.post("/:postId/comment", commentController.createComment);

//댓글 수정
router.put("/:postId/comment/:commentId", commentController.updateComment);

//댓글 삭제
router.delete("/:postId/comment/:commentId", commentController.deleteComment);

/*
// 대댓글 작성
router.post("/:postId/comment/:commentId/reply", commentController.createReply);

// 대댓글 수정
router.put("/:postId/comment/:commentId/reply/:replyId", commentController.updateReply);

// 대댓글 삭제
router.delete("/:postId/comment/:commentId/reply/:replyId", commentController.deleteReply);

// 좋아요 등록/취소
router.post("/:postId/like", postController.toggleLike);
*/


module.exports = router;