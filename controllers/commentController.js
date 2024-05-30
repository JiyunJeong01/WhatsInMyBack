const CommentModel = require('../models/Comment');

// 댓글 작성
exports.createComment = async (req, res) => {
    const post_id = req.params.postId;
    const { member_id, comment_content } = req.body;

    const comment = { post_id, member_id, parent_comment_id: null, comment_content };
    await CommentModel.create(comment);

    res.redirect(`/post/${post_id}/detail`);
};

// 댓글 수정
exports.updateComment = async (req, res) => {
    const comment_id = req.params.commentId;
    const { comment_content } = req.body;
    const comment = { comment_id, comment_content };

    // 로그인 된 사용자id 와 댓글 작성자 id가 같은지 확인
    await CommentModel.update(comment);

    res.send('Comment updated successfully');
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    const commentId = req.params.commentId;

    // 로그인 된 사용자id 와 댓글 작성자 id가 같은지 확인
    await CommentModel.delete(commentId);

    res.send('Comment deleted successfully');
};

// 대댓글 작성
exports.createReply = async (req, res) => {
    const post_id = req.params.postId;
    const parent_comment_id = req.params.commentId;
    const { member_id, comment_content } = req.body;

    const comment = { post_id, member_id, parent_comment_id, comment_content };
    await CommentModel.create(comment);

    res.redirect(`/post/${post_id}/detail`);
};

// 대댓글 수정
exports.updateReply = async (req, res) => {
    const comment_id = req.params.replyId;
    const { comment_content } = req.body;
    const comment = { comment_id, comment_content };

    // 로그인 된 사용자id 와 대댓글 작성자 id가 같은지 확인
    await CommentModel.update(comment);

    res.send('Reply updated successfully');
};

// 대댓글 삭제
exports.deleteReply = async (req, res) => {
    const replyId = req.params.replyId;

    // 로그인 된 사용자id 와 대댓글 작성자 id가 같은지 확인
    await CommentModel.delete(replyId);

    res.send('Reply deleted successfully');
};
