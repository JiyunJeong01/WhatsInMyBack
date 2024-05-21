// PostImage 객체 받아서 DB에 등록
exports.createPostImage = async (post_image) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `
            INSERT INTO post_image (image_id, post_id, image_base64) 
            VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [
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



// postId과 image_id 검색 -> image 객체 반환