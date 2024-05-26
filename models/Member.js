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
exports.findById = async (id) => {
    try {
        const db = await require('../main').connection();
        //member 테이블의 기본 정보 수령
        let sql = `SELECT * FROM member WHERE member_id = '${id}';`;
        let [rows] = await db.query(sql);
        let row = rows[0];

        //팔로잉 수 조회
        sql = `SELECT count(*) AS followeeCount FROM member WHERE member_id in (SELECT followee_id FROM follow WHERE follower_id = '${id}');`;
        [rows] = await db.query(sql);
        let followeeCount = rows[0].followeeCount;

        //팔로워 수 조회
        sql = `SELECT count(*) AS followerCount FROM member WHERE member_id in (SELECT follower_id FROM follow WHERE followee_id = '${id}');`;
        [rows] = await db.query(sql);
        let followerCount = rows[0].followerCount;

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
            followeeCount: followeeCount,
            followerCount: followerCount,
        };
        return member; // ??
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }

};

// 특정 멤버의 팔로잉들 조회
exports.findFolloweeById = async (id) => {
    try {
        const db = await require('../main').connection();
        let sql = `SELECT m.member_id, m.nickname, CASE WHEN f2.follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following FROM member m JOIN follow f ON m.member_id = f.followee_id LEFT JOIN follow f2 ON m.member_id = f2.followee_id AND f2.follower_id = '${id}' WHERE f.follower_id = '${id}' ORDER BY f.followed_at;`;

        let [rows, fields] = await db.query(sql);
        let followees = rows.map(row => ({
            member_id: row.member_id,
            nickname: row.nickname,
            is_following: row.is_following,
        }));

        return followees;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로워들 조회
exports.findFollowerById = async (id) => {
    try {
        const db = await require('../main').connection();
        let sql = `SELECT m.member_id, m.nickname, CASE WHEN f2.follower_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_following FROM member m JOIN follow f ON m.member_id = f.follower_id LEFT JOIN follow f2 ON m.member_id = f2.followee_id AND f2.follower_id = '${id}' WHERE f.followee_id = '${id}' ORDER BY f.followed_at;`;

        let [rows, fields] = await db.query(sql);
        let followers = rows.map(row => ({
            member_id: row.member_id,
            nickname: row.nickname,
            is_following: row.is_following,
        }));

        return followers;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로워 추가
exports.findFollowAndAdd = async (id, follow) => {
    try {
        const db = await require('../main').connection();
        let sql = `INSERT INTO follow VALUES ('${id}','${follow}', NOW());`
        await db.query(sql);

    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로워 삭제
exports.findFollowAndDelete = async (id, follow) => {
    try {
        const db = await require('../main').connection();
        let sql = `DELETE FROM follow WHERE followee_id = '${follow}' AND follower_id = '${id}';`
        await db.query(sql);

    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

//특정 멤버의 게시글 전체 조회
exports.findAllPostById = async (id) => {
    try {
        const db = await require("../main").connection();
        let sql = `SELECT p.post_id, p.theme_id, p.post_title, p.created_at, t.theme_name FROM post p JOIN theme t ON p.theme_id = t.theme_id WHERE p.member_id = '${id}' ORDER BY p.created_at DESC;`;
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
exports.findAllBookmarkById = async (id) => {
    try {
        const db = await require("../main").connection();
        let sql = `SELECT p.post_title, t.theme_name, b.bookmarked_at FROM bookmark b JOIN post p ON b.post_id = p.post_id JOIN theme t ON p.theme_id = t.theme_id WHERE b.member_id = '${id}' ORDER BY b.bookmarked_at DESC;`;
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
exports.findAllLikeById = async (id) => {
    try {
        const db = await require("../main").connection();
        let sql = `SELECT p.post_title, t.theme_name, l.liked_at FROM post_like l JOIN post p ON l.post_id = p.post_id JOIN theme t ON p.theme_id = t.theme_id WHERE l.member_id = '${id}' ORDER BY l.liked_at DESC;`;
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