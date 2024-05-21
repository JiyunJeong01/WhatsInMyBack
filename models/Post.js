// 전체 게시글 조회
exports.findAll = async () => {
    try {
        const db = await require('../main').connection(); 
        let sql = 'SELECT * FROM post';
        let [rows, fields] = await db.query(sql); 

        let posts = [];
        rows.forEach(row => {
            let post = {
                post_id: row.post_id,
                member_id: row.member_id,
                theme_id: row.theme_id,
                post_title: row.post_title,
                post_content: row.post_content,
                hashtags: row.hashtags,
                created_at: row.created_at,
                updated_at: row.updated_at,
                views: row.views,
                likes: row.likes,
                comments: row.comments,
                bookmarks: row.bookmarks,                
            };
            posts.push(post);
        });
        return posts; // ??
    } catch (error) {
        console.error("Post.findAll() 쿼리 실행 중 오류:", error);
    }
};

// findById


// post 객체 받아서 DB에 등록
exports.createPost = async (post) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `
            INSERT INTO post (member_id, theme_id, post_title, post_content, hashtags) 
            VALUES (?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [
            post.member_id,
            post.theme_id,
            post.post_title,
            post.post_content,
            post.hashtags,
        ]);
        return result.insertId;

    } catch (error) {
        console.error("registerPost() 쿼리 실행 중 오류:", error);
    }
}