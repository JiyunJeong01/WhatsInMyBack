const db = require("../models/Index"),
    validator = require('validator'),
    Comment = db.Comment,
    Member = db.Member,
    Preference = db.Preference,
    Follow = db.Follow,
    Post = db.Post,
    PostInteractions = db.PostInteractions;

module.exports = {
    /*지윤 작업 부분*/ 
    profilePage: async (req, res, next) => {
        const loginId = req.session.user ? req.session.user.id : 0;
        res.locals.loginId = loginId;
        const userId = req.params.userId;

        try {
            // 멤버 정보 가져오기
            const member = await Member.findById(userId);
            if (!member) {
                res.render("profile/noaccess")
                return;
            }
            res.locals.member = member;

            // 팔로잉 상태 확인
            const is_following = await Follow.checkFollow(userId, loginId);
            res.locals.member.is_following = is_following;

            // 포스트 정보 가져오기
            const posts = await  Post.findAllByMemberId(userId);
            res.locals.posts = posts;

            res.render('profile/main');
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    followeePage: async (req,res,next) =>{
        let loginId = req.session.user ? req.session.user.id : 0;
        res.locals.loginId = loginId;
        let userId = req.params.userId;

        try {
            // 멤버 정보 가져오기
            const member = await Member.findById(userId);
            if (!member) {
                res.render("profile/noaccess")
                return;
            }
            res.locals.member = member;

            // 팔로잉 상태 확인
            const is_following = await Follow.checkFollow(userId, loginId);
            res.locals.member.is_following = is_following;

            // 팔로위 정보 가져오기
            const followees = await Follow.findFolloweeById(userId, loginId);
            res.locals.follows = followees;

            res.render('profile/follow');

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    followerPage: async (req,res,next) =>{
        let loginId = req.session.user ? req.session.user.id : 0;
        res.locals.loginId = loginId;
        let userId = req.params.userId;

        try {
            // 멤버 정보 가져오기
            const member = await Member.findById(userId);
            if (!member) {
                res.render("profile/noaccess")
                return;
            }
            res.locals.member = member;

            // 팔로잉 상태 확인
            const is_following = await Follow.checkFollow(userId, loginId);
            res.locals.member.is_following = is_following;

            // 팔로워 정보 가져오기
            const followers = await Follow.findFollowerById(userId, loginId);
            res.locals.follows = followers;

            res.render('profile/follow');

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    follow: (req, res) => {
        let userId = req.params.userId;
        let followId = req.params.follow;
        Follow.findFollowAndAdd(userId, followId);
    },

    unfollow: (req, res) => {
        let userId = req.params.userId;
        let followId = req.params.follow;
        Follow.findFollowAndDelete(userId, followId);
    },
    /*정빈 작업 부분 */
    collectComment: async (req, res, next) => {
        try {
            const userId = req.params.userId
            let pageId = req.params.pageId;

            if (!req.session.user) {
                return res.redirect(`/auth/login`);
            }

            if (userId == req.session.user.id) {    
                const comments = await Comment.findCommentWithUser(userId);

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
            } else {
                res.render("profile/noaccess")
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },
    /*지윤 작업 부분 */
    collectBookmark: async (req, res, next) => {
        let loginId = req.session.user ? req.session.user.id : 0;
        res.locals.loginId = loginId;
        let userId = req.params.userId;

        try {
            // 멤버 정보 가져오기
            const member = await Member.findById(userId);
            if (!member || member.member_id != res.locals.loginId) {
                res.render("profile/noaccess")
                return;
            }
            res.locals.member = member;

            // 북마크 정보 가져오기
            const bookmarks = await PostInteractions.findAllBookmarkById(userId); 
            res.locals.bookmarks = bookmarks;

            res.render('profile/bookmark')

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    collectLike: async (req, res, next) => {
        let loginId = req.session.user ? req.session.user.id : 0;
        res.locals.loginId = loginId;
        let userId = req.params.userId;
        try {
            // 멤버 정보 가져오기
            const member = await Member.findById(userId);
            if (!member || member.member_id != res.locals.loginId) {
                res.render("profile/noaccess")
                return;
            }
            res.locals.member = member;

            // 좋아요 정보 가져오기
            const likes = await PostInteractions.findAllLikeById(userId)
            res.locals.likes = likes;

            res.render('profile/like')

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    /*정빈 작업부분 */
    profileModified_GET: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            
            if (!req.session.user) {
                return res.redirect(`/auth/login`);
            }

            if (userId == req.session.user.id) {
                res.locals.userId = userId;
                const userInfo = await Member.loadMember(userId);
                const userTheme = await Preference.loadTheme(userId);
                res.locals.userInfo = userInfo[0]
                res.locals.userTheme = userTheme
                res.render("profile/setting");
            } else {
                res.render("profile/noaccess")
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    profileModified_POST: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            
            if (!req.session.user) {
                return res.redirect(`/auth/login`);
            }

            if (userId == req.session.user.id) {
                const { email, nickname, username, bio, job, age, gender, theme, comment_notification, like_notification, follow_notification, recommend_notification, picture_base64 } = req.body;

                const existingUserWithEmail = await Member.getUserByEmail(email);
                if (existingUserWithEmail && existingUserWithEmail.member_id != userId) {
                    req.flash('error', '이미 사용 중인 이메일입니다.');
                    return res.redirect(`/profile/${userId}/profileModified`);
                }

                const existingUserWithNickname = await Member.getUserByNickname(nickname);
                if (existingUserWithNickname && existingUserWithNickname.member_id != userId) {
                    req.flash('error', '이미 사용 중인 닉네임입니다.');
                    return res.redirect(`/profile/${userId}/profileModified`);
                }

                if ((await Member.updateMember(userId, username, nickname, email, age, gender, job, follow_notification, like_notification, comment_notification, recommend_notification, picture_base64, bio))
                    & (await Preference.updateTheme(userId, theme))) {
                    req.flash('success', '프로필 정보가 수정되었습니다.');
                    return res.redirect(`/profile/${userId}`);
                } else {
                    req.flash('error', '오류가 발생했습니다.');
                    return res.redirect(`/profile/${userId}/profileModified`);
                }
            } else {
                res.render("profile/noaccess")
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    passwordModified_GET: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            
            if (!req.session.user) {
                return res.redirect(`/auth/login`);
            }

            if (userId == req.session.user.id) {
                res.locals.userId = userId;
                res.render("profile/pwd_change.ejs");
            } else {
                res.render("profile/noaccess")
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    passwordModified_POST: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            
            if (!req.session.user) {
                return res.redirect(`/auth/login`);
            }

            if (userId == req.session.user.id) {
                const { current_password, new_password, confirm_password } = req.body;

                if (await Member.checkPassword(userId, current_password)) {
                    if (await Member.updatePassword(userId, new_password)) {
                        req.flash('success', '비밀번호가 재설정되었습니다.');
                        return res.redirect(`/profile/${userId}/profileModified`);
                    } else {
                        req.flash('error', '오류가 발생했습니다.');
                        return res.redirect(`/profile/${userId}/pwModified`);
                    }
                } else {
                    req.flash('error', '현재 비밀번호가 일치하지 않습니다.');
                    return res.redirect(`/profile/${userId}/pwModified`);
                }
            } else {
                res.render("profile/noaccess")
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    unregister_GET : async (req, res, next) => {
        try {
            const userId = req.params.userId;
            
            if (!req.session.user) {
                return res.redirect(`/auth/login`);
            }

            if (userId == req.session.user.id) {
                res.locals.userId = userId;
                res.render("profile/unregister.ejs");
            } else {
                res.render("profile/noaccess")
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    unregister_POST : async (req, res, next) => {
        try {
            const userId = req.params.userId;
            
            if (!req.session.user) {
                return res.redirect(`/auth/login`);
            }

            if (userId == req.session.user.id) {
                const { current_password, confirm_check } = req.body;
                
                if (await Member.checkPassword(userId, current_password)) {
                    if (await Member.deleteMember(userId)) {
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
            } else {
                res.render("profile/noaccess")
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    }
};