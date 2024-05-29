// Product 객체 받아서 DB에 등록
exports.create = async (product) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `
            INSERT INTO product (product_id, post_id, image_id, product_name, product_category, brand, purchase_link) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [
            product.product_id,
            product.post_id,
            product.image_id,
            product.product_name,
            product.product_category,
            product.brand,
            product.purchase_link,
        ]);

        //return findById(product_id);
        return;

    } catch (error) {
        console.error("registerProduct() 쿼리 실행 중 오류:", error);
    }
}


exports.findByPostId = async (postId) => {
    try {
        const db = await require('../main').connection(); 
        let sql = 'SELECT * FROM product WHERE post_id = ?';
        const [rows] = await db.query(sql, [postId]);
        return rows;

    } catch (error) {
        console.error("Product.findByPostId() 쿼리 실행 중 오류:", error);
    }
};

exports.delete = async (postId) => {
    try {
        const db = await require('../main').connection(); 

        let sql = `DELETE FROM product WHERE post_id = ?`;
        await db.query(sql, [postId]);
        return;

    } catch (error) {
        console.error("Post.registerPost() 쿼리 실행 중 오류:", error);
    }
}