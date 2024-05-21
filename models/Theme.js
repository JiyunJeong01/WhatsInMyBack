// 전체 테마 조회
exports.findAll = async () => {
    try {
        const db = await require('../main').connection(); 

        let sql = 'SELECT * FROM theme';
        const [rows] = await db.query(sql);
        return rows; 

    } catch (error) {
        console.error("Theme.findAll() 쿼리 실행 중 오류:", error);
    }
};