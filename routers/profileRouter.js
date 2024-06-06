const express = require("express"),
    router = express.Router(),
    profileController = require("../controllers/profileController");

router.get("/:userId", profileController.profilePage);
router.get("/:userId/posts", profileController.profilePostPage);
router.get("/:userId/followee", profileController.followeePage);
router.get("/:userId/follower",profileController.followerPage);
router.delete("/:userId/:follow", profileController.unfollow);
router.put("/:userId/:follow", profileController.follow);
router.get("/:userId/collectBookmark", profileController.collectBookmark);
router.get("/:userId/collectLike", profileController.collectLike);
router.get("/:userId/collectComment/:pageId",profileController.collectComment);
router.get("/:userId/profileModified",profileController.profileModified_GET);
router.post("/:userId/profileModified",profileController.profileModified_POST);
router.get("/:userId/pwModified", profileController.passwordModified_GET);
router.post("/:userId/pwModified", profileController.passwordModified_POST);
router.get("/:userId/cancleAccount", profileController.unregister_GET);
router.post("/:userId/cancleAccount", profileController.unregister_POST);

module.exports = router;