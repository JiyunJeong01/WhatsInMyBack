// 전체 게시글 조회
exports.findAll = async () => {
    try {
        const db = await require('../main').connection(); 
        let sql = 'SELECT * FROM post';
        let [rows] = await db.query(sql); 
        return rows;

    } catch (error) {
        console.error("Post.findAll() 쿼리 실행 중 오류:", error);
    }
};

// findById
exports.findByPostId = async (postId) => {
    try {
        const db = await require('../main').connection(); 
        let sql = 'SELECT * FROM post WHERE post_id = ?';
        const [rows] = await db.query(sql, [postId]);
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Post.findByPostId() 쿼리 실행 중 오류:", error);
    }
};

exports.findByMemberId = async (MemberId) => {
    try {
        const db = await require('../main').connection(); 
        let sql = 'SELECT * FROM post WHERE member_id = ?';
        const [rows] = await db.query(sql, [MemberId]);
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Post.findByMemberId() 쿼리 실행 중 오류:", error);
    }
};


// post 객체 받아서 DB에 등록
exports.create = async (post) => {
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
        console.error("Post.registerPost() 쿼리 실행 중 오류:", error);
    }
};


// 검색어 검색 쿼리
