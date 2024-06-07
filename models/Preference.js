// 사용자가 선택한 선호테마를 DB에 저장
exports.addPreference = async (memberId, themeId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `INSERT INTO preference (member_id, theme_id) VALUES (?, ?)`;
        await db.query(sql, [memberId, themeId]);

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
    } catch (error) {
        console.log("UserModel.addPreference() 쿼리 실행 중 오류:", error);
        throw error;
    }
};

exports.loadTheme = async (userId) => {
    try {
        const db = await require('../main').connection();
        let [rows] = await db.query('SELECT t.theme_name FROM preference p JOIN theme t ON p.theme_id = t.theme_id WHERE p.member_id = ?', [userId]);

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
        return (rows);
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};

exports.updateTheme = async (userId, themes) => {
    try {
        const db = await require('../main').connection();
        const themeNames = themes.split(',').map(theme => theme.trim());
        await db.query('DELETE FROM preference WHERE member_id = ?', [userId]);

        for (const themeName of themeNames) {
            const [theme] = await db.query('SELECT theme_id FROM theme WHERE theme_name = ?', [themeName]);
            if (theme.length > 0) {
                await db.query('INSERT INTO preference (member_id, theme_id) VALUES (?, ?)', [userId, theme[0].theme_id]);
            }
        }

        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
        return true;
    }
    catch (error) {
        console.error("쿼리 실행 중 오류:", error);
    };
};