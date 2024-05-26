const Member = require("../models/Member");

module.exports = {
    profile: async (req, res, next) => {
        let userId = req.params.id;
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
            })
            .catch(error => {
                console.log(`Error fetching member by ID: ${error.message}`);
                next(error);
            });
        await Member.findFollowerById(userId)
            .then(followers => {
                res.locals.followers = followers;
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

    follow: (req, res) => {
        let userId = req.params.id;
        let followId = req.params.follow;
        Member.findFollowAndAdd(userId, followId);
    },

    unfollow: (req, res) => {
        let userId = req.params.id;
        let followId = req.params.follow;
        Member.findFollowAndDelete(userId, followId);
    },

    collectComment: (req, res) => {
        res.render("profile/comment");
    },

    collectBookmark: async (req, res, next) => {
        let userId = req.params.id;
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
        let userId = req.params.id;
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

    profileModified: (req, res) => {
        res.render("profile/setting");
    }

};