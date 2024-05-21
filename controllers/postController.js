const postModel = require('../models/Post');
const ImageModel = require('../models/Image');
const ProductModel = require('../models/Product');
const ThemeModel = require('../models/Theme');

const bodyParser = require('body-parser');

// get: 새 게시글 작성 페이지 반환
exports.newPost = async (req, res) => {
    try {
        // 로그인 안되어있음 -> 로그인 페이지

        // 로그인 되어있음 -> 
        // member id 모델에 등록
        const member_id = 3; // 임시 
        // 테마 전송
        const themes = await ThemeModel.findAll();

        res.render('Post/newPost', {
            memberId: member_id,
            themes: themes
        });
    } catch (error) {
        console.error("새 포스트 작성 페이지 반환 중 오류:", error);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
}

// post: 모델에 게시글 전송
exports.registerPost = async (req, res) => {
    try {
        const { postData, imageDatas, productDatas } = req.body;

        // if member_id가 null -> response 로그인 페이지 
    
        // Post등록
        const savedPostId = await postModel.createPost(postData);

        // image등록
        for (const imageData of imageDatas) {
            imageData.post_id = savedPostId;
            await ImageModel.createPostImage(imageData);
        }
    
        // product등록
        for (const productData of productDatas) {
            productData.post_id = savedPostId;
            await ProductModel.createProduct(productData);
        }
        
        res.redirect(`/post/${savedPostId}`);
    } catch (error) {        
        console.error("포스트 등록 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

