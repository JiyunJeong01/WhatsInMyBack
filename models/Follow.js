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