// 좋아요 검색
exports.findLikeByMemberAndPost = async (postId, memberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = 'select * from post_like where post_id = ? and member_id = ?;';
        let [rows] = await db.query(sql, [postId, memberId]); 

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
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

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
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

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
        return;

    } catch (error) {
        console.error("PostInteraction.deleteLike() 쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 좋아요 전체 조회
exports.findAllLikeById = async (memberId, offset, limit) => {
    try {
        const db = await require("../main").connection();
        let [rows] = await db.query(`SELECT p.post_id, 
        p.post_title, 
        t.theme_name, 
        l.liked_at, 
        (SELECT image_base64 FROM post_image WHERE post_id = p.post_id LIMIT 1) AS image_base64 
        FROM post_like l 
        JOIN post p ON l.post_id = p.post_id 
        JOIN theme t ON p.theme_id = t.theme_id 
        WHERE l.member_id = ? 
        ORDER BY l.liked_at DESC
        LIMIT ? OFFSET ?`, [memberId, limit, offset]);

        let likes = [];
        rows.forEach(row => {
            let like = {
                post_id: row.post_id,
                post_title: row.post_title,
                theme_name: row.theme_name,
                liked_at: row.liked_at,
                image_base64: row.image_base64,
            };
            likes.push(like);
        });

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
        return likes;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}


// 북마크 검색
exports.findBookmarkByMemberAndPost = async (postId, memberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = 'select * from bookmark where post_id = ? and member_id = ?;';
        let [rows] = await db.query(sql, [postId, memberId]); 

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
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

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
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

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
        return;

    } catch (error) {
        console.error("PostInteraction.deleteLike() 쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 북마크 전체 조회
exports.findAllBookmarkById = async (memberId, offset, limit) => {
    try {
        const db = await require("../main").connection();
        let [rows] = await db.query(`SELECT p.post_id,p.post_title, t.theme_name, b.bookmarked_at, (SELECT image_base64 FROM post_image WHERE post_id = p.post_id LIMIT 1) AS image_base64 FROM bookmark b JOIN post p ON b.post_id = p.post_id JOIN theme t ON p.theme_id = t.theme_id WHERE b.member_id = ? ORDER BY b.bookmarked_at DESC
        LIMIT ? OFFSET ?`, [memberId, limit, offset]);

        let bookmarks = [];
        rows.forEach(row => {
            let bookmark = {
                post_id: row.post_id,
                post_title: row.post_title,
                theme_name: row.theme_name,
                bookmarked_at: row.bookmarked_at,
                image_base64: row.image_base64,
            };
            bookmarks.push(bookmark);
        });

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
        return bookmarks;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}


