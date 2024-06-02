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
