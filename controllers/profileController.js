module.exports = {
    profile: (req, res) => {
        let userId = req.params.id;
        res.render("profile/main", {id: userId});
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