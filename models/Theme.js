// DB에 저장된 테마 데이터를 받아오기
exports.findAll = async () => {
    try {
        const db = await require('../main').connection(); 
  
        let sql = 'SELECT * FROM theme';
        const [rows] = await db.query(sql);
        
        if (db && db.end) { db.end().catch(err => { console.error('DB 연결 종료 중 오류:', err); }); }
        return rows; 
  
    } catch (error) {
        console.error("Theme.findAll() 쿼리 실행 중 오류:", error);
    }
}