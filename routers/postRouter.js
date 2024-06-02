const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

// 라우터 순서 주의

// 게시글 작성
router.get("/new", postController.newPost);
router.post("/register", postController.registerPost);

// 게시글 수정
router.get('/:postId/edit', postController.editPost);
router.put("/update", postController.updatePost);

// 게시글 목록 조회
router.get("/posts", postController.getPosts);
//게시글 열람
router.get("/:postId/detail", postController.getPostDetail);
// 게시글 검색
router.get("/search/:sortBy", postController.findQuery);
// 게시글 삭제
router.post("/:postId/delete", postController.deletePost);


// 좋아요 등록
router.post("/like", postController.toggleLike);
// 북마크 등록
router.post("/bookmark", postController.toggleBookmark);


//댓글 작성
router.post("/:postId/comment", commentController.createComment);
//댓글 수정
router.put("/:postId/comment/:commentId", commentController.updateComment);
//댓글 삭제
router.delete("/:postId/comment/:commentId", commentController.deleteComment);


// 대댓글 작성
router.post("/:postId/comment/:commentId/reply", commentController.createReply);
// 대댓글 수정
router.put("/:postId/comment/:commentId/reply/:replyId", commentController.updateReply);
// 대댓글 삭제
router.delete("/:postId/comment/:commentId/reply/:replyId", commentController.deleteReply);


module.exports = router;
