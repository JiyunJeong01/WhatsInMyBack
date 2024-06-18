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

        const page = 1; // 처음 페이지는 1
        const limit = 10; // 한 페이지에 표시할 게시글 수
        const offset = (page - 1) * limit; // 오프셋 계산

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

            // 초기 포스트 정보 가져오기 (첫 페이지)
            const posts = await Post.findAllByMemberId(userId, offset, limit);
            res.locals.posts = posts;

            res.render('profile/main');
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    profilePostPage: async (req, res, next) => {
        const userId = req.params.userId;
        const page = req.query.page || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        try {
            const posts = await Post.findAllByMemberId(userId, offset, limit);
            const new_posts = posts.map(post => {
                const imageDataURI = post.image_base64.toString('base64');
                post.image_base64 = Buffer.from(imageDataURI, 'base64').toString('utf-8');
                return post
            })
            res.json(new_posts)
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    followeePage: async (req, res, next) => {
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

    followerPage: async (req, res, next) => {
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

    follow: async (req, res, next) => {
        let userId = req.params.userId;
        let followId = req.params.follow;
        try {
            await Follow.findFollowAndAdd(userId, followId);
            res.status(200).json({ message: "Follow successfully" });
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    unfollow: async (req, res, next) => {
        let userId = req.params.userId;
        let followId = req.params.follow;
        try {
            await Follow.findFollowAndDelete(userId, followId);
            res.status(200).json({ message: "Unfollow successfully" });
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
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

                if (comments.length === 0) {
                    res.locals.userId = userId;
                    res.render("profile/nocomment");
                } else {
                    if (pageId > Math.floor(comments.length / 10) + 1) {
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

        const page = 1; // 처음 페이지는 1
        const limit = 9; // 한 페이지에 표시할 게시글 수
        const offset = (page - 1) * limit; // 오프셋 계산

        try {
            // 멤버 정보 가져오기
            const member = await Member.findById(userId);
            if (!member || member.member_id != res.locals.loginId) {
                res.render("profile/noaccess")
                return;
            }
            res.locals.member = member;

            // 북마크 정보 가져오기
            const bookmarks = await PostInteractions.findAllBookmarkById(userId, offset, limit);
            res.locals.bookmarks = bookmarks;

            res.render('profile/bookmark')

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    bookmarkPostPage: async (req, res, next) => {
        const userId = req.params.userId;
        const page = req.query.page || 1;
        const limit = 9;
        const offset = (page - 1) * limit;

        try {
            const posts = await PostInteractions.findAllBookmarkById(userId, offset, limit);
            const new_posts = posts.map(post => {
                const imageDataURI = post.image_base64.toString('base64');
                post.image_base64 = Buffer.from(imageDataURI, 'base64').toString('utf-8');
                return post
            })
            res.json(new_posts)
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    collectLike: async (req, res, next) => {
        let loginId = req.session.user ? req.session.user.id : 0;
        res.locals.loginId = loginId;
        let userId = req.params.userId;

        const page = 1; // 처음 페이지는 1
        const limit = 9; // 한 페이지에 표시할 게시글 수
        const offset = (page - 1) * limit; // 오프셋 계산

        try {
            // 멤버 정보 가져오기
            const member = await Member.findById(userId);
            if (!member || member.member_id != res.locals.loginId) {
                res.render("profile/noaccess")
                return;
            }
            res.locals.member = member;

            // 좋아요 정보 가져오기
            const likes = await PostInteractions.findAllLikeById(userId, offset, limit)
            res.locals.likes = likes;

            res.render('profile/like')

        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            next(error);
        }
    },

    likePostPage: async (req, res, next) => {
        const userId = req.params.userId;
        const page = req.query.page || 1;
        const limit = 9;
        const offset = (page - 1) * limit;

        try {
            const posts = await PostInteractions.findAllLikeById(userId, offset, limit);
            const new_posts = posts.map(post => {
                const imageDataURI = post.image_base64.toString('base64');
                post.image_base64 = Buffer.from(imageDataURI, 'base64').toString('utf-8');
                return post
            })
            res.json(new_posts)
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
                    return res.send("<script>alert('이미 사용 중인 이메일입니다.'); window.location=`/profile/"+userId+"/profileModified`;</script>");
                }
    
                const existingUserWithNickname = await Member.getUserByNickname(nickname);
                if (existingUserWithNickname && existingUserWithNickname.member_id != userId) {
                    return res.send("<script>alert('이미 사용 중인 닉네임입니다.'); window.location=`/profile/"+userId+"/profileModified`;</script>");
                }
    
                if ((await Member.updateMember(userId, username, nickname, email, age, gender, job, follow_notification, like_notification, comment_notification, recommend_notification, picture_base64, bio))
                    & (await Preference.updateTheme(userId, theme))) {
                    return res.send("<script>alert('프로필 정보가 수정되었습니다.'); window.location=`/profile/"+userId+"`;</script>");
                } else {
                    return res.send("<script>alert('오류가 발생했습니다.'); window.location=`/profile/"+userId+"/profileModified`;</script>");
                }
            } else {
                res.render("profile/noaccess");
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        }
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
                        return res.send("<script>alert('비밀번호가 재설정되었습니다.'); window.location=`/profile/"+userId+"/profileModified`;</script>");
                    } else {
                        return res.send("<script>alert('오류가 발생했습니다.'); window.location=`/profile/"+userId+"/pwModified`;</script>");
                    }
                } else {
                    return res.send("<script>alert('현재 비밀번호가 일치하지 않습니다.'); window.location=`/profile/"+userId+"/pwModified`;</script>");
                }
            } else {
                res.render("profile/noaccess")
            }
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    unregister_GET: async (req, res, next) => {
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

    unregister_POST: async (req, res, next) => {
        try {
            const userId = req.params.userId;
    
            if (!req.session.user) {
                return res.redirect(`/auth/login`);
            }
    
            if (userId == req.session.user.id) {
                const { current_password, confirm_check } = req.body;
    
                if (await Member.checkPassword(userId, current_password)) {
                    if (await Member.deleteMember(userId)) {
                        return res.send("<script>alert('회원을 탈퇴했습니다.'); window.location='/auth/logout';</script>");
                    } else {
                        return res.send("<script>alert('오류가 발생했습니다.'); window.location='/profile/"+userId+"/cancleAccount';</script>");
                    }
                } else {
                    return res.send("<script>alert('현재 비밀번호가 일치하지 않습니다.'); window.location='/profile/"+userId+"/cancleAccount';</script>");
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