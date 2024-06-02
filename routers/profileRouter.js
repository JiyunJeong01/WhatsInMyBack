const express = require("express"),
    router = express.Router(),
    postController = require("../controllers/profileController");

router.get("/:userId", profileController.profilePage,profileController.profileShow);
router.get("/:userId/followee", profileController.followeePage, profileController.followeeShow);
router.get("/:userId/follower",profileController.followerPage, profileController.followerShow);
router.delete("/:userId/:follow", profileController.unfollow);
router.put("/:userId/:follow", profileController.follow);
router.get("/:userId/collectBookmark", profileController.collectBookmark, profileController.collectBookmarkShow);
router.get("/:userId/collectLike", profileController.collectLike, profileController.collectLikeShow);
router.get("/:userId/collectComment/:pageId",profileController.collectComment);
router.get("/:userId/profileModified",profileController.profileModified_GET);
router.post("/:userId/profileModified",profileController.profileModified_POST);
router.get("/:userId/pwModified", profileController.passwordModified_GET);
router.post("/:userId/pwModified", profileController.passwordModified_POST);
router.get("/:userId/cancleAccount", profileController.unregister_GET);
router.post("/:userId/cancleAccount", profileController.unregister_POST);

module.exports = router;