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