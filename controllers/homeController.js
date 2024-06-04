// homeController.js


// homeController.js
const PostModel = require('../models/Post');

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${month}/${day} 작성시간:${hours}시 ${minutes}분`;
}

module.exports = {
  index: async (req, res) => {
    try {
      // 최신 등록된 게시글 6개 조회
      const latestPreviews = await PostModel.findLatestPosts(6);
      
      res.render("index", { latestPreviews, formatDate });
    } catch (error) {
      console.error("홈 페이지 조회 중 오류:", error);
      res.status(500).send("서버 오류가 발생했습니다.");
    }
  }
};