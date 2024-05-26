const db = require("../models/index"),
comment = db.comment;
member = db.member;

module.exports = {
    profile: (req, res) => {
        res.render("profile/main");
    },

    //세션 이용해서 접근 중인 사용자와 userId가 일치하는지 확인하는 작업 필요 -> 로그인 구현 이후에 가능할듯
    collectComment: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            let pageId = req.params.pageId;
    
            const comments = await comment.findCommentWithUser(userId);

            if(comments.length === 0) {
                res.locals.userId = userId;
                res.render("profile/nocomment");
            } else {
                if(pageId > Math.floor(comments.length / 10) + 1) {
                    pageId = Math.floor(comments.length / 10) + 1
                } 
                
                const filteredComments = comments.filter(comment => comment.page_id == pageId);
                
                res.locals.length = comments.length;
                res.locals.comments = filteredComments;
                res.locals.currentURL = req.originalUrl;
                res.locals.currentPageId = pageId;
                res.render("profile/comment");
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    collectBookmark: (req, res) => {
        res.render("profile/bookmark");
    },

    collectLike: (req, res) => {
        res.render("profile/like");
    },

    profileModified: (req, res) => {
        res.render("profile/setting");
    },
    
    passwordModified_GET: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            res.locals.userId = userId;
            res.render("profile/pwd_change.ejs");
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    passwordModified_POST: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const { current_password, new_password, confirm_password } = req.body;
            
            if (!current_password || !new_password || !confirm_password) {
                req.flash('error', '모든 필드를 채워주세요.');
                return res.redirect(`/profile/${userId}/pwModified`);
            }

            if (await member.checkPassword(userId, current_password)) {
                if (new_password === confirm_password) {
                    if (await member.updatePassword(userId, new_password)) {
                        req.flash('success', '비밀번호가 재설정되었습니다.');
                        return res.redirect(`/profile/${userId}/profileModified`);
                    } else {
                        req.flash('error', '오류가 발생했습니다.');
                        return res.redirect(`/profile/${userId}/pwModified`);
                    }
                } else {
                    req.flash('error', '새 비밀번호가 일치하지 않습니다.');
                    return res.redirect(`/profile/${userId}/pwModified`);
                }
            } else {
                req.flash('error', '현재 비밀번호가 일치하지 않습니다.');
                return res.redirect(`/profile/${userId}/pwModified`);
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    unregister_GET : async (req, res, next) => {
        try {
            const userId = req.params.userId;
            res.locals.userId = userId;
            res.render("profile/unregister.ejs");
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    unregister_POST : async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const { current_password, confirm_check } = req.body;

            if (!current_password) {
                req.flash('error', '현재 비밀번호를 입력해주세요.');
                return res.redirect(`/profile/${userId}/cancleAccount`);
            }

            if (!confirm_check) {
                req.flash('error', '체크박스를 확인해주세요.');
                return res.redirect(`/profile/${userId}/cancleAccount`);
            }

            if (await member.checkPassword(userId, current_password)) {
                if (await member.deleteMember(userId)) {
                    req.flash('success', '회원을 탈퇴했습니다.');
                    return res.redirect(`/`);
                } else {
                    req.flash('error', '오류가 발생했습니다.');
                    return res.redirect(`/profile/${userId}/cancleAccount`);
                }
            } else {
                req.flash('error', '현재 비밀번호가 일치하지 않습니다.');
                return res.redirect(`/profile/${userId}/cancleAccount`);
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    }
};