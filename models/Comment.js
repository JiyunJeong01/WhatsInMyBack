<<<<<<< HEAD
// findById 수정 = parent_comment_id가 null인 댓글만 가져온다.

exports.findByPostId = async (postId) => {
    try {
        const db = await require('../main').connection();

        let sql = `
            SELECT c.comment_id, c.member_id, c.post_id, c.parent_comment_id, c.comment_content, c.created_at,
                m.username, m.nickname, m.picture_base64
            FROM comment c
            JOIN member m ON c.member_id = m.member_id
            WHERE c.post_id = ? AND c.parent_comment_id IS NULL
            ORDER BY c.created_at DESC
        `;
        const [rows] = await db.query(sql, [postId]);

        // 대댓글 데이터를 가져오기 위한 쿼리
        const commentIds = rows.map(comment => comment.comment_id);
        if (commentIds.length > 0) {
            let replySql = `
                SELECT r.comment_id, r.member_id, r.parent_comment_id, r.comment_content, r.created_at,
                    m.username, m.nickname, m.picture_base64
                FROM comment r
                JOIN member m ON r.member_id = m.member_id
                WHERE r.parent_comment_id IN (?)
                ORDER BY r.created_at DESC
            `;
            const [replyRows] = await db.query(replySql, [commentIds]);

            // 댓글 객체에 대댓글 데이터 추가
            rows.forEach(comment => {
                comment.replies = replyRows.filter(reply => reply.parent_comment_id === comment.comment_id);
            });
        }

        return rows;

    } catch (error) {
        console.error("Comment.findByPostId() 쿼리 실행 중 오류:", error);
    }
};



//대댓글을 위해 create 메서드 수정(parent_comment_id 컬럼추가)

exports.create = async (comment) => {
    try {
        const db = await require('../main').connection();

        let sql = `
          INSERT INTO comment (post_id, member_id, parent_comment_id, comment_content)
          VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [
            comment.post_id,
            comment.member_id,
            comment.parent_comment_id,
            comment.comment_content
        ]);

        // 생성된 댓글의 comment_id를 포함한 객체 반환
        return { comment_id: result.insertId, ...comment };

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
=======
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
>>>>>>> origin/feature-profile
