//models/Memeber.js

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