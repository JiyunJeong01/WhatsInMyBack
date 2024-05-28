// DB에 저장된 사용자 이메일 받아오기
exports.findByEmail = async (email) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `SELECT * FROM member WHERE email = ?`;
        const [rows] = await db.query(sql, [email]);
        return rows.length > 0 ? rows[0] : null; // 사용자가 존재하면 첫 번째 사용자 객체 반환, 아니면 null 반환
    } catch (error) {
        console.error("UserModel.findByEmail() 쿼리 실행 중 오류:", error);
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

// 사용자가 선택한 선호테마를 DB에 저장
exports.addPreference = async (memberId, themeId) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `INSERT INTO preference (member_id, theme_id) VALUES (?, ?)`;
        await db.query(sql, [memberId, themeId]);
    } catch (error) {
        console.log("UserModel.addPreference() 쿼리 실행 중 오류:", error);
        throw error;
    }
};