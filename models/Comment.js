// findById
exports.findByPostId = async (postId) => {
    try {
        const db = await require('../main').connection(); 
        
        let sql = `
            SELECT c.comment_id, c.member_id, c.post_id, c.parent_comment_id, c.comment_content, c.created_at,
                m.username, m.nickname, m.picture_base64
            FROM comment c
            JOIN member m ON c.member_id = m.member_id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `;
        const [rows] = await db.query(sql, [postId]);
        return rows;

    } catch (error) {
        console.error("Comment.findByPostId() 쿼리 실행 중 오류:", error);
    }
};

exports.create = async (comment) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `
          INSERT INTO comment (post_id, member_id, comment_content)
          VALUES (?, ?, ?)`;
        await db.query(sql, [
            comment.post_id,
            comment.member_id,
            comment.comment_content
        ]);

    } catch (error) {
        console.error("Comment.create() 쿼리 실행 중 오류:", error);
    }
};

exports.update = async (comment) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `UPDATE comment SET comment_content = ? WHERE comment_id = ?`;
        await db.query(sql, [
            comment.comment_id,
            comment.comment_content
        ]);

    } catch (error) {
        console.error("Comment.update() 쿼리 실행 중 오류:", error);
    }
};

exports.delete = async (commentId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `DELETE FROM comment WHERE comment_id = ?`;
        await db.query(sql, [commentId]);

    } catch (error) {
        console.error("Comment.delete() 쿼리 실행 중 오류:", error);
    }
};
