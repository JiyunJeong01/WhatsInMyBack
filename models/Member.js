// DB에 저장된 사용자 이메일 받아오기
exports.getUserByEmail = async (email) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `SELECT * FROM member WHERE email = ?`;
        const [rows] = await db.query(sql, [email]);
        return rows.length > 0 ? rows[0] : null; // 사용자가 존재하면 첫 번째 사용자 객체 반환, 아니면 null 반환
    } catch (error) {
        console.error("UserModel.getUserByEmail() 쿼리 실행 중 오류:", error);
        throw error;
    }
};


// DB에 저장된 사용자 닉네임 받아오기
exports.getUserByNickname = async (nickname) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `SELECT * FROM member WHERE nickname = ?`;
        const [rows] = await db.query(sql, [nickname]);
        return rows.length > 0 ? rows[0] : null; // 사용자가 존재하면 첫 번째 사용자 객체 반환, 아니면 null 반환
    } catch (error) {
        console.error("UserModel.getUserByNickname() 쿼리 실행 중 오류:", error);
        throw error;
    }
};

// 사용자 정보 DB에 저장
exports.createUser = async (user) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `
            INSERT INTO member (email, password, username, nickname, job, gender, age) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [
            user.email,
            user.password,
            user.username,
            user.nickname,
            user.job,
            user.gender,
            user.age,
        ]);
        return result.insertId;
    } catch (error) {
        console.error("UserModel.createUser() 쿼리 실행 중 오류:", error);
        throw error;
    }
};

exports.findByMemberId = async (memberId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = 'SELECT * FROM member WHERE member_id = ?';
        const [rows] = await db.query(sql, [memberId]);
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error("Post.findByMemberId() 쿼리 실행 중 오류:", error);
    }
};

const bcrypt = require('bcrypt');
const { connection } = require('../main');

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
        let [rows] = await db.query(
            'SELECT * FROM member WHERE member_id = ?',
            [userId]
        );
        let row = rows[0];

        //팔로잉 수 조회
        [rows] = await db.query(
            'SELECT count(*) AS followeeCount FROM member WHERE member_id in (SELECT followee_id FROM follow WHERE follower_id = ?)' ,[userId]  
        );
        let followeeCount = rows[0].followeeCount;

        //팔로워 수 조회
        [rows] = await db.query(
            'SELECT count(*) AS followerCount FROM member WHERE member_id in (SELECT follower_id FROM follow WHERE followee_id = ?)' ,[userId]
        );
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

/*
// 특정 멤버의 팔로잉들 조회
exports.findFolloweeById = async (userId) => {
    try {
        const db = await require('../main').connection();
        let [rows] = await db.query(
            'SELECT m.member_id, m.nickname, m.picture_base64 FROM member m JOIN follow f ON m.member_id = f.followee_id WHERE f.follower_id = ? ORDER BY f.followed_at',
            [userId]);
        let follows = rows.map(row => ({
            member_id: row.member_id,
            nickname: row.nickname,
            picture_base64: row.picture_base64,
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
        let [rows] = await db.query(
            'SELECT m.member_id, m.nickname, m.picture_base64 FROM member m JOIN follow f ON m.member_id = f.follower_id WHERE f.followee_id = ? ORDER BY f.followed_at', 
            [userId]);
        let follows = rows.map(row => ({
            member_id: row.member_id,
            nickname: row.nickname,
            picture_base64: row.picture_base64,
        }));

        return follows;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
} */
// 특정 멤버의 팔로잉들 조회
exports.findFolloweeById = async (userId, loginId) => {
    try {
        const db = await require('../main').connection();

        let [rows] = await db.query(
            'SELECT m.member_id, m.nickname, m.picture_base64, CASE WHEN f2.follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following FROM member m JOIN follow f ON m.member_id = f.followee_id LEFT JOIN follow f2 ON m.member_id = f2.followee_id AND f2.follower_id = ? WHERE f.follower_id = ? ORDER BY f.followed_at',
            [loginId,userId]);

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
exports.findFollowerById = async (userId, loginId) => {
    try {
        const db = await require('../main').connection();

        let [rows] = await db.query(
            'SELECT m.member_id, m.nickname, m.picture_base64, CASE WHEN f2.follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following FROM member m JOIN follow f ON m.member_id = f.follower_id LEFT JOIN follow f2 ON m.member_id = f2.followee_id AND f2.follower_id = ? WHERE f.followee_id = ? ORDER BY f.followed_at',
            [loginId,userId]);
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

//특정 멤버의 게시글 전체 조회
exports.findAllPostById = async (userId) => {
    try {
        const db = await require("../main").connection();
        let [rows] = await db.query('SELECT p.post_id, p.theme_id, p.post_title, p.created_at, t.theme_name, (SELECT image_base64 FROM post_image WHERE post_id = p.post_id LIMIT 1) AS image_base64 FROM post p JOIN theme t ON p.theme_id = t.theme_id WHERE p.member_id = ? ORDER BY p.created_at DESC',[userId]);

        let posts = [];
        rows.forEach(row => {
            let post = {
                post_title: row.post_title,
                theme_name: row.theme_name,
                theme_id: row.theme_id,
                post_id: row.post_id,
                created_at: row.created_at,
                image_base64: row.image_base64,
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
        let [rows] = await db.query('SELECT p.post_id,p.post_title, t.theme_name, b.bookmarked_at, (SELECT image_base64 FROM post_image WHERE post_id = p.post_id LIMIT 1) AS image_base64 FROM bookmark b JOIN post p ON b.post_id = p.post_id JOIN theme t ON p.theme_id = t.theme_id WHERE b.member_id = ? ORDER BY b.bookmarked_at DESC',[userId]);

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
        return bookmarks; // ??
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

//특정 멤버의 좋아요 전체 조회
exports.findAllLikeById = async (userId) => {
    try {
        const db = await require("../main").connection();
        let [rows] = await db.query('SELECT p.post_id, p.post_title, t.theme_name, l.liked_at, (SELECT image_base64 FROM post_image WHERE post_id = p.post_id LIMIT 1) AS image_base64 FROM post_like l JOIN post p ON l.post_id = p.post_id JOIN theme t ON p.theme_id = t.theme_id WHERE l.member_id = ? ORDER BY l.liked_at DESC',[userId]);

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
