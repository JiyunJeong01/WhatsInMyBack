// Product 객체 받아서 DB에 등록
exports.createProduct = async (product) => {
    try {
        const db = await require('../main').connection(); 
        let sql = `
            INSERT INTO product (product_id, post_id, image_id, product_name, product_category, brand, purchase_link) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [
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

// post_id, image_id로 제품 배열 반환 


// findById
