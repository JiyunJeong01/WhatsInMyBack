exports.findCommentWithUser = async (userId) => {
    try {
        const db = await require('../main').connection();
        let [rows] = await db.query('SELECT post_id, comment_content, created_at FROM comment WHERE member_id = ? ORDER BY created_at DESC', [userId]);
        let comments = [];

        rows.forEach(row => {
            let comment = {
                post_id: row.post_id,
                comment_content: row.comment_content,
                created_at: row.created_at
            };
            comments.push(comment);
        });

        for (let i = 0; i < comments.length; i++) {
            comments[i].comment_id = comments.length - i;
            comments[i].page_id = Math.floor(i/10) + 1;
        }

        return comments;
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};