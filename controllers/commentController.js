const CommentModel = require('../models/Comment');

// 댓글 작성 (createComment 내용변경)
exports.createComment = async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const post_id = req.params.postId;
    const { comment_content } = req.body;

    const comment = { 
        post_id, 
        member_id: req.session.user.id, 
        parent_comment_id: null, 
        comment_content 
    };
    const newComment = await CommentModel.create(comment);

    // 생성된 댓글의 추가 정보를 가져옴
    const commentWithInfo = {
        comment_id: newComment.comment_id,
        member_id: newComment.member_id,
        post_id: newComment.post_id,
        parent_comment_id: newComment.parent_comment_id,
        comment_content: newComment.comment_content,
        created_at: newComment.created_at,
        // 필요한 다른 정보 추가
    };

    res.json(commentWithInfo);
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
    const { comment_content } = req.body;

    const comment = { 
        post_id, 
        member_id: req.session.user.id, 
        parent_comment_id, 
        comment_content 
    };
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
