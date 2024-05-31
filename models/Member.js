const bcrypt = require('bcrypt');

/* 지윤 작업 부분 */
// 전체 멤버 조회
exports.findAll = async () => {
    try {
        const db = await require('../main').connection();
        let sql = 'SELECT * FROM member';
        let [rows, fields] = await db.query(sql);

        let members = [];
        rows.forEach(row => {
            let member = {
                member_id: row.member_id,
                username: row.username,
                nickname: row.nickname,
                email: row.email,
                password: row.password,
                age: row.age,
                gender: row.gender,
                job: row.job,
                notification_setting: row.notification_setting,
                profile_picture: row.profile_picture,
                bio: row.bio,
            };
            members.push(member);
        });
        return members; // ??
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
};

// 특정 멤버 조회
exports.findById = async (userId) => {
    try {
        const db = await require('../main').connection();
        //member 테이블의 기본 정보 수령
        let sql = `SELECT * FROM member WHERE member_id = '${userId}';`;
        let [rows] = await db.query(sql);
        let row = rows[0];

        //팔로잉 수 조회
        sql = `SELECT count(*) AS followeeCount FROM member WHERE member_id in (SELECT followee_id FROM follow WHERE follower_id = '${userId}');`;
        [rows] = await db.query(sql);
        let followeeCount = rows[0].followeeCount;

        //팔로워 수 조회
        sql = `SELECT count(*) AS followerCount FROM member WHERE member_id in (SELECT follower_id FROM follow WHERE followee_id = '${userId}');`;
        [rows] = await db.query(sql);
        let followerCount = rows[0].followerCount;

        let member = {
            member_id: row.member_id,
            username: row.username,
            nickname: row.nickname,
            email: row.email,
            age: row.age,
            gender: row.gender,
            job: row.job,
            follow_notification: row.follow_notification,
            like_notification: row.like_notification,
            comment_notification: row.comment_notification,
            recommend_notification: row.recommend_notification,
            picture_base64: row.picture_base64,
            bio: row.bio,
            followeeCount: followeeCount,
            followerCount: followerCount,
        };
        return member; // ??
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }

};

// 특정 멤버의 팔로잉들 조회
exports.findFolloweeById = async (userId) => {
    try {
        const db = await require('../main').connection();
        let sql = `SELECT m.member_id, m.nickname, m.picture_base64, CASE WHEN f2.follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following FROM member m JOIN follow f ON m.member_id = f.followee_id LEFT JOIN follow f2 ON m.member_id = f2.followee_id AND f2.follower_id = '${userId}' WHERE f.follower_id = '${userId}' ORDER BY f.followed_at;`;

        let [rows, fields] = await db.query(sql);
        let follows = rows.map(row => ({
            member_id: row.member_id,
            nickname: row.nickname,
            picture_base64: row.picture_base64,
            is_following: row.is_following,
        }));

        return follows;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로워들 조회
exports.findFollowerById = async (userId) => {
    try {
        const db = await require('../main').connection();
        let sql = `SELECT m.member_id, m.nickname, m.picture_base64, CASE WHEN f2.follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following FROM member m JOIN follow f ON m.member_id = f.follower_id LEFT JOIN follow f2 ON m.member_id = f2.followee_id AND f2.follower_id = '${userId}' WHERE f.followee_id = '${userId}' ORDER BY f.followed_at;`;

        let [rows, fields] = await db.query(sql);
        let follows = rows.map(row => ({
            member_id: row.member_id,
            nickname: row.nickname,
            picture_base64: row.picture_base64,
            is_following: row.is_following,
        }));

        return follows;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로워 추가
exports.findFollowAndAdd = async (userId, follow) => {
    try {
        const db = await require('../main').connection();
        let sql = `INSERT INTO follow VALUES ('${userId}','${follow}', NOW());`
        await db.query(sql);

    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로워 삭제
exports.findFollowAndDelete = async (userId, follow) => {
    try {
        const db = await require('../main').connection();
        let sql = `DELETE FROM follow WHERE followee_id = '${follow}' AND follower_id = '${userId}';`
        await db.query(sql);

    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

//특정 멤버의 게시글 전체 조회
exports.findAllPostById = async (userId) => {
    try {
        const db = await require("../main").connection();
        let sql = `SELECT p.post_id, p.theme_id, p.post_title, p.created_at, t.theme_name FROM post p JOIN theme t ON p.theme_id = t.theme_id WHERE p.member_id = '${userId}' ORDER BY p.created_at DESC;`;
        let [rows, fields] = await db.query(sql);

        let posts = [];
        rows.forEach(row => {
            let post = {
                post_title: row.post_title,
                theme_name: row.theme_name,
                theme_id: row.theme_id,
                post_id: row.post_id,
                created_at: row.created_at,
            };
            posts.push(post);
        });
        return posts; // ??
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

//특정 멤버의 북마크 전체 조회
exports.findAllBookmarkById = async (userId) => {
    try {
        const db = await require("../main").connection();
        let sql = `SELECT p.post_title, t.theme_name, b.bookmarked_at FROM bookmark b JOIN post p ON b.post_id = p.post_id JOIN theme t ON p.theme_id = t.theme_id WHERE b.member_id = '${userId}' ORDER BY b.bookmarked_at DESC;`;
        let [rows, fields] = await db.query(sql);

        let bookmarks = [];
        rows.forEach(row => {
            let bookmark = {
                post_title: row.post_title,
                theme_name: row.theme_name,
                bookmarked_at: row.bookmarked_at,
            };
            bookmarks.push(bookmark);
        });
        return bookmarks; // ??
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

//특정 멤버의 좋아요 전체 조회
exports.findAllLikeById = async (userId) => {
    try {
        const db = await require("../main").connection();
        let sql = `SELECT p.post_title, t.theme_name, l.liked_at FROM post_like l JOIN post p ON l.post_id = p.post_id JOIN theme t ON p.theme_id = t.theme_id WHERE l.member_id = '${userId}' ORDER BY l.liked_at DESC;`;
        let [rows, fields] = await db.query(sql);

        let likes = [];
        rows.forEach(row => {
            let like = {
                post_title: row.post_title,
                theme_name: row.theme_name,
                liked_at: row.liked_at,
            };
            likes.push(like);
        });
        return likes; // ??
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

/*정빈 작업 부분*/
exports.checkPassword = async (userId, current_password) => {
    try {
        const db = await require('../main').connection();
        let [rows] = await db.query('SELECT password FROM member WHERE member_id = ?', [userId]);

        let password

        rows.forEach(row => {
            password = row.password
        });

        return (bcrypt.compare(current_password, password));
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};

exports.updatePassword = async (userId, new_password) => {
    try {
        const hashedPassword = await bcrypt.hash(new_password, 10);

        const db = await require('../main').connection();
        const [result] = await db.execute('UPDATE member SET password = ? WHERE member_id = ?', [hashedPassword, userId]);

        return (result.affectedRows===1);
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};

exports.deleteMember = async (userId) => {
    try {
        const db = await require('../main').connection();
        const [result] = await db.execute('DELETE FROM member WHERE member_id = ?', [userId]);

        return (result.affectedRows===1);
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};

exports.loadMember = async (userId) => {
    try {
        const db = await require('../main').connection();
        let [rows] = await db.query('SELECT username, nickname, email, age, gender, job, follow_notification, like_notification, comment_notification, recommend_notification, picture_base64, bio FROM member WHERE member_id = ?', [userId]);
    
        return (rows)
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};
    
exports.updateMember = async (userId, username, nickname, email, age, gender, job, follow_notification, like_notification, comment_notification, recommend_notification, picture_base64, bio) => {
    try {
        const db = await require('../main').connection();
        const [result] = await db.execute('UPDATE member SET username = ?, nickname = ?, email = ?, age = ?, gender = ?, job = ?, follow_notification = ?, like_notification = ?, comment_notification = ?, recommend_notification = ?, picture_base64 = ?, bio = ? WHERE member_id = ?',
            [username, nickname, email, age, gender, job, follow_notification, like_notification, comment_notification, recommend_notification, picture_base64, bio, userId]);
    
        return (result.affectedRows===1);
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};
    
exports.getUserByEmail = async (email) => {
    try {
        const db = await require('../main').connection();
        const [rows, fields] = await db.query('SELECT * FROM member WHERE email = ?', [email]);
    
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};
    
exports.getUserByNickname = async (nickname) => {
    try {
        const db = await require('../main').connection();
        const [rows, fields] = await db.query('SELECT * FROM member WHERE nickname = ?', [nickname]);
    
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};