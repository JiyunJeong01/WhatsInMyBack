// PostImage 객체 받아서 DB에 등록
exports.create = async (post_image) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `
            INSERT INTO post_image (image_id, post_id, image_base64) 
            VALUES (?, ?, ?)`;
        await db.query(sql, [
            post_image.image_id,
            post_image.post_id,
            post_image.image_base64,
        ]);

        //return findById(image_id, post_id);
        return;

    } catch (error) {
        console.error("registerPostImage() 쿼리 실행 중 오류:", error);
    }
}

// postId로 검색 -> image배열 반환
exports.findByPostId = async (postId) => {
    try {
        const db = await require('../main').connection(); 
        let sql = 'SELECT * FROM post_image WHERE post_id = ?';
        const [rows] = await db.query(sql, [postId]);
        return rows;

    } catch (error) {
        console.error("Image.findByPostId() 쿼리 실행 중 오류:", error);
    }
};

exports.delete = async (postId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `DELETE FROM post_image WHERE post_id = ?`;
        await db.query(sql, [postId]);
        return;

    } catch (error) {
        console.error("Post.registerPost() 쿼리 실행 중 오류:", error);
    }
}