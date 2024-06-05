// 특정 멤버의 팔로워 추가
exports.findFollowAndAdd = async (userId, follow) => {
    try {
        const db = await require('../main').connection();
        await db.query('INSERT INTO follow VALUES (?,?, NOW())', [userId, follow]);

    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로워 삭제
exports.findFollowAndDelete = async (userId, follow) => {
    try {
        const db = await require('../main').connection();
        await db.query('DELETE FROM follow WHERE followee_id = ? AND follower_id = ?', [follow, userId]);

    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 팔로잉 중인지 확인
exports.checkFollow = async (userId, follow = 0) => {
    try {
        const db = await require('../main').connection();

        [rows] = await db.query(
            'SELECT CASE WHEN EXISTS (SELECT * FROM follow WHERE follower_id = ? AND followee_id = ?) THEN true ELSE false END AS is_following', [follow, userId]
        );
        let is_following = rows[0].is_following;

        return is_following;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로잉 불러오기
exports.findFolloweeById = async (userId, loginId) => {
    try {
        const db = await require('../main').connection();

        let [rows] = await db.query(
            `SELECT m.member_id, 
            m.nickname, 
            m.picture_base64, 
            CASE WHEN EXISTS (SELECT 1 FROM follow WHERE follower_id = ? AND followee_id = m.member_id) THEN true ELSE false END AS is_following 
            FROM follow f 
            JOIN member m ON m.member_id = f.followee_id 
            WHERE f.follower_id = ? 
            ORDER BY f.followed_at`,
            [loginId, userId]);

            let follows = rows.map(row => ({
                member_id: row.member_id,
                nickname: row.nickname,
                picture_base64: row.picture_base64,
                is_following: row.is_following,
            }));
    
            return follows
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}

// 특정 멤버의 팔로워 불러오기
exports.findFollowerById = async (userId, loginId) => {
    try {
        const db = await require('../main').connection();

        let [rows] = await db.query(
            `SELECT m.member_id, 
            m.nickname, 
            m.picture_base64,
            CASE WHEN EXISTS (SELECT 1 FROM follow WHERE follower_id = ? AND followee_id = m.member_id) THEN true ELSE false END AS is_following 
            FROM follow f 
            JOIN member m ON m.member_id = f.follower_id 
            WHERE f.followee_id = ? 
            ORDER BY f.followed_at`,
            [loginId, userId]);

            let follows = rows.map(row => ({
                member_id: row.member_id,
                nickname: row.nickname,
                picture_base64: row.picture_base64,
                is_following: row.is_following,
            }));
    
            return follows
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    }
}