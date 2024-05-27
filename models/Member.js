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