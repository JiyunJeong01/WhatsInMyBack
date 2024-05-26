exports.checkPassword = async (userId, current_password) => {
    try {
        const db = await require('../main').connection();
        let [rows] = await db.query('SELECT password FROM member WHERE member_id = ?', [userId]);

        let password

        rows.forEach(row => {
            password = row.password
        });

        return (current_password === password);
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
}

exports.updatePassword = async (userId, new_password) => {
    try {
        const db = await require('../main').connection();
        const [result] = await db.execute('UPDATE member SET password = ? WHERE member_id = ?', [new_password, userId]);

        return (result.affectedRows===1);
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
}

exports.deleteMember = async (userId) => {
    try {
        const db = await require('../main').connection();
        const [result] = await db.execute('DELETE FROM member WHERE member_id = ?', [userId]);

        return (result.affectedRows===1);
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
}

exports.loadMember = async (userId) => {
    try {
        const db = await require('../main').connection();
        let [rows] = await db.query('SELECT username, nickname, email, age, gender, job, follow_notification, like_notification, comment_notification, recommend_notification, picture_base64, bio FROM member WHERE member_id = ?', [userId]);

        return (rows)
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
}

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
}

exports.getUserByEmail = async (email) => {
    try {
        const db = await require('../main').connection();
        const [rows, fields] = await db.query('SELECT * FROM member WHERE email = ?', [email]);

        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
}

exports.getUserByNickname = async (nickname) => {
    try {
        const db = await require('../main').connection();
        const [rows, fields] = await db.query('SELECT * FROM member WHERE nickname = ?', [nickname]);

        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
}