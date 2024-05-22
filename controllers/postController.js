const postModel = require('../models/Post');
const ImageModel = require('../models/Image');
const ProductModel = require('../models/Product');
const ThemeModel = require('../models/Theme');

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
        const { postData, imagesData, productsData } = req.body;

        // if member_id가 null -> response 로그인 페이지 
    
        // Post등록
        const savedPostId = await postModel.create(postData);

        // image등록
        for (const imageData of imagesData) {
            imageData.post_id = savedPostId;
            await ImageModel.create(imageData);
        }
    
        // product등록
        for (const productData of productsData) {
            productData.post_id = savedPostId;
            await ProductModel.create(productData);
        }
        
        res.redirect(`/post/${savedPostId}`);
    } catch (error) {        
        console.error("포스트 등록 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

//edit: 게시글 수정 페이지 반환
exports.editPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        // 로그인 안되어있음 -> 로그인 페이지

        // 로그인 되어있음 -> if(게시글 작성자id  == 로그인된 사용자id)
        // member id 모델에 등록
        const member_id = 4; // 임시 

        // 테마 받아오기 
        const themes = await ThemeModel.findAll();

        // 게시글 정보 받아오기 
        const post = await postModel.findByPostId(postId);
        // if (post == null) 
        const images = await ImageModel.findByPostId(postId);
        const products = await ProductModel.findByPostId(postId);

        res.render(`Post/editPost`, {
            memberId: member_id,
            themes: themes, 

            post: post, 
            imagesData: images,
            productsData: products
        });

    } catch (error) {
        console.error("게시글 수정 페이지 반환 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

exports.updatePost = async (req, res) => {
    try {
        // if member_id가 null -> response 로그인 페이지 
    
        // Post등록

        // image등록
    
        // product등록

        
        //res.redirect(`/post/${}`);
    } catch (error) {
        console.error("게시글 수정 등록 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}


exports.showPost = async (req, res) => {
    try {
        // 로그인된 사용자 id == 게시글 작성자 id -> 수정 삭제 버튼 표시

        // 로그인된 사용자 id != 게시글 작성자 id -> 게시글 열람 & 댓글 작성 가능

        // 로그인 안됨 -> 게시글 열람 & 댓글 작성 불가




    } catch (error) {
        console.error("게시글 보기 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

