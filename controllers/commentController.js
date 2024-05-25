const CommentModel = require('../models/Comment');

// 댓글 작성
exports.createComment = (req, res) => {
    const post_id = req.params.postId;
    const { member_id, comment_content } = req.body;

    const comment = { post_id, member_id, comment_content };
    CommentModel.create(comment);

    console.log(`/post/${post_id}`);

    res.redirect(`/post/${post_id}`);
};

// 댓글 수정
exports.updateComment = (req, res) => {
    //const post_id = req.params.postId;
    const comment_id = req.params.commentId;
    const { comment_content } = req.body;
    const comment = { comment_id, comment_content };

    // 로그인 된 사용자id 와 댓글 작성자 id가 같은지 확인
    CommentModel.update(comment);

    res.send('Comment updated successfully');
};

// 댓글 삭제 
exports.deleteComment = (req, res) => {
    //const postId = req.params.postId;
    const commentId = req.params.commentId;

    // 로그인 된 사용자id 와 댓글 작성자 id가 같은지 확인
    CommentModel.delete(commentId);

    res.send('Comment deleted successfully');
}