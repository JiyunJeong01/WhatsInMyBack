const CommentModel = require('../models/Comment');
const MemberModel = require('../models/Member');

// 댓글 작성 (createComment 내용변경)
exports.createComment = async (req, res) => {
    // 로그인 여부 확인
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const post_id = req.params.postId;
    const { comment_content } = req.body;

    const loginMember = await MemberModel.findById(req.session.user.id);

    if (!loginMember) {
        return res.status(404).json({ error: 'Member not found' });
    }

    const comment = { 
        post_id, 
        member_id: loginMember.member_id, 
        parent_comment_id: null,
        comment_content,
        username: loginMember.username,
        nickname: loginMember.nickname,
        picture_base64: loginMember.picture_base64
    };
    const newComment = await CommentModel.create(comment);

    const imageDataURI = newComment.picture_base64.toString('base64');
    newComment.picture_base64 = Buffer.from(imageDataURI, 'base64').toString('utf-8');
    if (IsProfileImageundefined(newComment.picture_base64)) newComment.picture_base64 = "/images/default_profile.jpg"

    // [수정한 부분] 생성된 댓글의 추가 정보를 가져옴
    res.json(newComment);
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

    const loginMember = await MemberModel.findById(req.session.user.id);

    if(!loginMember) {
        return res.status(404).json({ error: 'Member not found' });
    }

    const comment = { 
        post_id, 
        member_id: loginMember.member_id, 
        parent_comment_id, 
        comment_content,
        username: loginMember.username,
        nickname: loginMember.nickname,
        picture_base64: loginMember.picture_base64
    };
    const newReply = await CommentModel.create(comment);

    const imageDataURI = newReply.picture_base64.toString('base64');
    newReply.picture_base64 = Buffer.from(imageDataURI, 'base64').toString('utf-8');
    if (IsProfileImageundefined(newReply.picture_base64)) newReply.picture_base64 = "/images/default_profile.jpg"

    // [수정한 부분] 생성된 대댓글의 추가 정보를 가져옴
    res.json(newReply);
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

function IsProfileImageundefined(picture_base64) { // 프로필이 없으면 기본이미지로 설정하는 함수
    if (!picture_base64 || picture_base64.length == 0) return true;
    else false;
  }