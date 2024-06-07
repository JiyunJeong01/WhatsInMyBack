// 전체 게시글 조회
exports.findAll = async () => {
    try {
        const db = await require('../main').connection(); 

        let sql = 'SELECT * FROM post';
        let [rows] = await db.query(sql); 

        if (db && db.end) {
            db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
        }
        return rows;

    } catch (error) {
        console.error("Post.findAll() 쿼리 실행 중 오류:", error);
    }
};

// findById
exports.findByPostId = async (postId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `SELECT *, 
            (SELECT theme_name FROM theme WHERE theme_id = p.theme_id) AS theme_name,
            (SELECT COUNT(*) FROM bookmark WHERE post_id = p.post_id) AS bookmark_count,
            (SELECT COUNT(*) FROM post_like WHERE post_id = p.post_id) AS like_count
            FROM post p WHERE post_id = ?`;
        const [rows] = await db.query(sql, [postId]);

        if (db && db.end) {
            db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
        }
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Post.findByPostId() 쿼리 실행 중 오류:", error);
    }
};

exports.findByMemberId = async (memberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `SELECT * AS theme_name FROM post WHERE member_id = ?`;
        const [rows] = await db.query(sql, [memberId]);

        if (db && db.end) {
            db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
        }
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Post.findByMemberId() 쿼리 실행 중 오류:", error);
    }
};

// 특정 멤버의 페이지네이션된 게시글 조회
exports.findAllByMemberId = async (memberId, offset, limit) => {
    try {
        const db = await require("../main").connection();
        let [rows] = await db.query(`SELECT 
            p.post_id,
            p.theme_id, 
            p.post_title, 
            p.created_at, 
            t.theme_name, 
            (SELECT image_base64 FROM post_image WHERE post_id = p.post_id LIMIT 1) AS image_base64 
            FROM post p 
            JOIN theme t ON p.theme_id = t.theme_id 
            WHERE p.member_id = ? 
            ORDER BY p.created_at DESC 
            LIMIT ? OFFSET ?`, [memberId, limit, offset]);

        let posts = rows.map(row => {
            return {
                post_title: row.post_title,
                theme_name: row.theme_name,
                theme_id: row.theme_id,
                post_id: row.post_id,
                created_at: row.created_at,
                image_base64: row.image_base64,
            };
        });

        if (db && db.end) {
            db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
        }
        return posts;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
        throw error; // 에러를 던져서 호출한 곳에서 처리할 수 있도록 함
    }
};

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

        if (db && db.end) {
            db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
        }
        return result.insertId;

    } catch (error) {
        console.error("Post.registerPost() 쿼리 실행 중 오류:", error);
    }
};

exports.update = async (post) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `
            UPDATE post 
            SET theme_id = ?,
                post_title = ?,
                post_content = ?,
                hashtags = ?,
                updated_at =  NOW()
            WHERE post_id = ?;
            `;
        await db.query(sql, [
            post.theme_id,
            post.post_title,
            post.post_content,
            post.hashtags,
            post.post_id
        ]);

        if (db && db.end) {
            db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
        }
        return;

    } catch (error) {
        console.error("Post.registerPost() 쿼리 실행 중 오류:", error);
    }
}

exports.delete = async (postId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `DELETE FROM post WHERE post_id = ?`;
        await db.query(sql, [postId]);

        if (db && db.end) {
            db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
        }
        return;

    } catch (error) {
        console.error("Post.registerPost() 쿼리 실행 중 오류:", error);
    }
}


// 조회수 증가 
exports.increasedViews = async (postId) => {
    let db = null;
    try {
        const db = await require('../main').connection(); 

        let sql = 'UPDATE post SET views = views + 1 WHERE post_id = ?';
        await db.query(sql, [postId]);
        if (db && db.end) {
            db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
        }
        return;

    } catch (error) {
        console.error("Post.increasedViews() 쿼리 실행 중 오류:", error);
    }
};

// 최신 등록된 게시글 조회
exports.findLatestPosts = async (limit) => {
    try {
      const db = await require('../main').connection();
  
      let sql = `
        SELECT
          p.post_id,
          p.post_title,
          p.post_content,          p.hashtags,
          p.theme_id,
          p.created_at,
          p.views,
          m.nickname,
          m.picture_base64,
          (SELECT COUNT(*) FROM comment WHERE post_id = p.post_id) AS comment_count,
          (SELECT COUNT(*) FROM bookmark WHERE post_id = p.post_id) AS bookmark_count,
          (SELECT COUNT(*) FROM post_like WHERE post_id = p.post_id) AS like_count,
          (SELECT image_base64 FROM post_image WHERE post_id = p.post_id LIMIT 1) AS thumbnail
        FROM
          post p
        JOIN
          member m ON p.member_id = m.member_id
        ORDER BY p.created_at DESC
        LIMIT ?
      `;
  
      const [rows] = await db.query(sql, [limit]);

      if (db && db.end) {
        db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
    }
      return rows.length > 0 ? rows : null;
  
    } catch (error) {
      console.error("Post.findLatestPosts() 쿼리 실행 중 오류:", error);
    }
  };

// 검색
exports.findByQueryAndSortBy = async (query, sortBy, themeId, pageIndex) => {
    try {
        const db = await require('../main').connection();        

        const pageSize = 6;
        let offset = pageSize * (pageIndex - 1);

        let sql = `
            SELECT 
                p.post_id,
                p.post_title,
                p.post_content,
                p.hashtags,
                p.theme_id,
                p.created_at,
                p.views,
                m.nickname,
                m.picture_base64,
                (SELECT COUNT(*) FROM comment WHERE post_id = p.post_id) AS comment_count,
                (SELECT COUNT(*) FROM bookmark WHERE post_id = p.post_id) AS bookmark_count,
                (SELECT COUNT(*) FROM post_like WHERE post_id = p.post_id) AS like_count,
                (SELECT image_base64 FROM post_image WHERE post_id = p.post_id LIMIT 1) AS thumbnail
            FROM 
                post p 
            JOIN 
                member m ON p.member_id = m.member_id
            WHERE 
                CONCAT(p.post_title, p.post_content, p.hashtags) LIKE ? `;

        if (themeId != 'all')  sql += 'AND p.theme_id = ? '
        switch (sortBy) {
            case 'latest':
                sql += `ORDER BY p.created_at DESC`;
                break;
            case 'views':
                sql += `ORDER BY p.views DESC`;
                break;
            case 'comments':
                sql += `ORDER BY (SELECT COUNT(*) FROM comment WHERE post_id = p.post_id) DESC`;
                break;
            case 'likes':
                sql += `ORDER BY (SELECT COUNT(*) FROM post_like WHERE post_id = p.post_id) DESC`;
                break;
            case 'bookmarks':
                sql += `ORDER BY (SELECT COUNT(*) FROM bookmark WHERE post_id = p.post_id) DESC`;
                break;
            default:
                sql += `ORDER BY p.created_at DESC`;
                break;
        }
        sql += ` LIMIT ? OFFSET ?`;
    

        if (themeId != 'all') {
            const [rows] = await db.query(sql, [`%${query}%`, themeId, pageSize, offset]);
            if (db && db.end) {
                db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
            }
            return rows.length > 0 ? rows : null;
        }
        else {
            const [rows] = await db.query(sql, [`%${query}%`, pageSize, offset]);
            if (db && db.end) {
                db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
            }
            return rows.length > 0 ? rows : null;
        }

    } catch (error) {
        console.error("Post.findByQueryAndSortBy() 쿼리 실행 중 오류:", error);
    }
}

exports.findCountByQueryAndSortBy = async (query, sortBy, themeId) => {
    try {
        const db = await require('../main').connection();        

        let sql = `
            SELECT 
                COUNT(*) AS totalPosts
            FROM 
                post p 
            JOIN 
                member m ON p.member_id = m.member_id
            WHERE 
                CONCAT(p.post_title, p.post_content, p.hashtags) LIKE ? `;

        if (themeId != 'all')  sql += 'AND p.theme_id = ? '
        switch (sortBy) {
            case 'latest':
                sql += `ORDER BY p.created_at DESC`;
                break;
            case 'views':
                sql += `ORDER BY p.views DESC`;
                break;
            case 'comments':
                sql += `ORDER BY (SELECT COUNT(*) FROM comment WHERE post_id = p.post_id) DESC`;
                break;
            case 'likes':
                sql += `ORDER BY (SELECT COUNT(*) FROM post_like WHERE post_id = p.post_id) DESC`;
                break;
            case 'bookmarks':
                sql += `ORDER BY (SELECT COUNT(*) FROM bookmark WHERE post_id = p.post_id) DESC`;
                break;
            default:
                sql += `ORDER BY p.created_at DESC`;
                break;
        }    

        if (themeId != 'all') {
            const [rows] = await db.query(sql, [`%${query}%`, themeId]);
            if (db && db.end) {
                db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
            }
            return rows[0].totalPosts;
        }
        else {
            const [rows] = await db.query(sql, [`%${query}%`]);
            if (db && db.end) {
                db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); });
            }
            return rows[0].totalPosts;;
        }

    } catch (error) {
        console.error("Post.findCountByQueryAndSortBy() 쿼리 실행 중 오류:", error);
    }
}