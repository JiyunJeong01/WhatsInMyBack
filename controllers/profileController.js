module.exports = {
    profile: (req, res) => {
        res.render("profile/main");
    },

    collectComment: (req, res) => {
        res.render("profile/comment");
    },

    collectBookmark: (req, res) => {
        res.render("profile/bookmark");
    },

    collectLike: (req, res) => {
        res.render("profile/like");
    },

    profileModified: (req, res) => {
        res.render("profile/setting");
    }

};