const db = require("../models/Index"),
    validator = require('validator'),
    Comment = db.Comment,
    Member = db.Member,
    Preference = db.Preference,
    Follow = db.Follow;

module.exports = {
    /*지윤 작업 부분*/ 
    profilePage: async (req, res, next) => {
        let userId = req.params.userId;
        await Member.findById(userId)
            .then(member => {
                res.locals.member = member;
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
        await Member.findAllPostById(userId)
            .then(posts => {
                res.locals.posts = posts;
                next();
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
    },

    profileShow: (req, res) => {
        if (!res.locals.member) {
            res.status(404).send('Member not found');
            return;
        }
        res.render('profile/main', {
            member: res.locals.member
        });
    },

    followeePage: async (req,res,next) =>{
        let userId = req.params.userId;
        await Member.findById(userId)
            .then(member => {
                res.locals.member = member;
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
        await Member.findFolloweeById(userId)
            .then(followees => {
                res.locals.followees = followees;
                next();
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
    },

    followeeShow: (req, res) => {
        if (!res.locals.followees) {
            res.status(404).send('followee not found');
            return;
        }
        res.render('profile/follow', {
            member: res.locals.member,
            follows: res.locals.followees
        });
    },

    followerPage: async (req,res,next) =>{
        let userId = req.params.userId;
        await Member.findById(userId)
            .then(member => {
                res.locals.member = member;
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
        await Member.findFollowerById(userId)
            .then(followers => {
                member: res.locals.member
                res.locals.followers = followers;
                next();
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
    },

    followerShow: (req, res) => {
        if (!res.locals.followers) {
            res.status(404).send('followee not found');
            return;
        }
        res.render('profile/follow', {
            member: res.locals.member,
            follows: res.locals.followers
        });
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
    //세션 이용해서 접근 중인 사용자와 userId가 일치하는지 확인하는 작업 필요 -> 로그인 구현 이후에 가능할듯
    collectComment: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            let pageId = req.params.pageId;
    
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
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },
    /*지윤 작업 부분 */
    collectBookmark: async (req, res, next) => {
        let userId = req.params.userId;
        await Member.findById(userId)
            .then(member => {
                res.locals.member = member;
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
        await Member.findAllBookmarkById(userId)
            .then(bookmarks => {
                res.locals.bookmarks = bookmarks;
                next();
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
    },

    collectBookmarkShow: (req, res) => {
        if (!res.locals.member) {
            res.status(404).send('Member not found');
            return;
        }
        res.render('profile/bookmark', {
            member: res.locals.member
        });
    },

    collectLike: async (req, res, next) => {
        let userId = req.params.userId;
        await Member.findById(userId)
            .then(member => {
                res.locals.member = member;
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
        await Member.findAllLikeById(userId)
            .then(likes => {
                res.locals.likes = likes;
                next();
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
    },
    
    collectLikeShow: (req, res) => {
        if (!res.locals.member) {
            res.status(404).send('Member not found');
            return;
        }
        res.render('profile/like', {
            member: res.locals.member
        });
    },

    /*정빈 작업부분 */
    profileModified_GET: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            res.locals.userId = userId;
            const userInfo = await Member.loadMember(userId);
            const userTheme = await Preference.loadTheme(userId);
            res.locals.userInfo = userInfo[0]
            res.locals.userTheme = userTheme
            res.render("profile/setting");
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    },

    profileModified_POST: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const { email, nickname, username, bio, job, age, gender, theme, comment_notification, like_notification, follow_notification, recommend_notification, picture_base64 } = req.body;

            if (!email || !nickname || !username || !job || !age || !gender) {
                let errorMessage = '모든 필드를 채워주세요: ';
                if (!email) errorMessage += '이메일, ';
                if (!nickname) errorMessage += '닉네임, ';
                if (!username) errorMessage += '이름, ';
                if (!job) errorMessage += '직업, ';
                if (!age) errorMessage += '나이, ';
                if (!gender) errorMessage += '성별, ';
                errorMessage = errorMessage.slice(0, -2);
                req.flash('error', errorMessage);
                return res.redirect(`/profile/${userId}/profileModified`);
            }

            if (!validator.isEmail(email)) {
                req.flash('error', '올바른 이메일 주소를 입력하세요.');
                return res.redirect(`/profile/${userId}/profileModified`);
            }

            if (nickname.length > 8) {
                req.flash('error', '닉네임은 8글자 이하로 입력하세요.');
                return res.redirect(`/profile/${userId}/profileModified`);
            }
    
            if (username.length > 12) {
                req.flash('error', '이름은 12글자 이하로 입력하세요.');
                return res.redirect(`/profile/${userId}/profileModified`);
            }

            if (!validator.isNumeric(age)) {
                req.flash('error', '나이는 숫자로 입력하세요.');
                return res.redirect(`/profile/${userId}/profileModified`);
            }

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
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
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

            if (new_password.length < 6) {
                req.flash('error', '새 비밀번호는 6글자 이상이어야 합니다.');
                return res.redirect(`/profile/${userId}/pwModified`);
            }    

            if (await Member.checkPassword(userId, current_password)) {
                if (new_password === confirm_password) {
                    if (await Member.updatePassword(userId, new_password)) {
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
        } catch (error) {
            console.error(`Error collecting comments: ${error.message}`);
            next(error);
        };
    }
};