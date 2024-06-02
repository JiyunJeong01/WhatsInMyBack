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