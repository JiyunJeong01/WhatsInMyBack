// 좋아요 검색
exports.findLikeByMemberAndPost = async (postId, memberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = 'select * from post_like where post_id = ? and member_id = ?;';
        let [rows] = await db.query(sql, [postId, memberId]); 
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("PostInteraction.findLikeByMemberAndPost() 쿼리 실행 중 오류:", error);
    }
};

// 좋아요 추가
exports.createLike = async (postId, memberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `INSERT INTO post_like (post_id, member_id) VALUES (?, ?);`;
        await db.query(sql, [postId, memberId]); 
        return;

    } catch (error) {
        console.error("PostInteraction.createLike() 쿼리 실행 중 오류:", error);
    }
};

// 좋아요 삭제
exports.deleteLike = async (postId, MemberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `DELETE FROM post_like WHERE post_id = ? AND member_id = ?`;
        await db.query(sql, [postId, MemberId]);
        return;

    } catch (error) {
        console.error("PostInteraction.deleteLike() 쿼리 실행 중 오류:", error);
    }
}


// 북마크 검색
exports.findBookmarkByMemberAndPost = async (postId, memberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = 'select * from bookmark where post_id = ? and member_id = ?;';
        let [rows] = await db.query(sql, [postId, memberId]); 
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("PostInteraction.findBookmarkByMemberAndPost() 쿼리 실행 중 오류:", error);
    }
};

// 북마크 추가
exports.createBookmark = async (postId, memberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `INSERT INTO bookmark (post_id, member_id) VALUES (?, ?);`;
        await db.query(sql, [postId, memberId]); 
        return;

    } catch (error) {
        console.error("PostInteraction.createLike() 쿼리 실행 중 오류:", error);
    }
};

// 북마크 삭제
exports.deleteBookmark = async (postId, MemberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `DELETE FROM bookmark WHERE post_id = ? AND member_id = ?`;
        await db.query(sql, [postId, MemberId]);
        return;

    } catch (error) {
        console.error("PostInteraction.deleteLike() 쿼리 실행 중 오류:", error);
    }
}

