// 이메일로 사용자 찾기
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

// 회원 가입
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

