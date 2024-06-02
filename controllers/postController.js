const PostModel = require('../models/Post');
const ImageModel = require('../models/Image');
const ProductModel = require('../models/Product');
const ThemeModel = require('../models/Theme');
const MemberModel = require('../models/Member');
const CommentModel = require('../models/Comment');
const PostInteractionModel = require('../models/PostInteraction');


// 게시글 목록 조회
exports.getPosts = async (req, res) => {
    const Previews = await PostModel.findByQueryAndSortBy('', 'date', 'all');
    res.render('Post/posts', { Previews, formatDate });
};

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
        const savedPostId = await PostModel.create(postData);

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
        
        return res.json({ success: true, redirect: `/post/${savedPostId}/detail` });
        //return res.redirect(`/post/${savedPostId}/detail`);
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


        // 게시글 정보 받아오기 
        const themes = await ThemeModel.findAll(); // 테마 받아오기 
        const post = await PostModel.findByPostId(postId); // if (post == null) 
        const images = await ImageModel.findByPostId(postId); 
        const products = await ProductModel.findByPostId(postId); 

        // 기존 데이터를 페이지 객체에 저장
        const pages = {};
        images.forEach(function(post_image) {
            if (!pages[post_image.image_id]) {
                pages[post_image.image_id] = { products: [], image: '' };
            }
            pages[post_image.image_id].image = post_image.image_base64;
        });
        products.forEach(function(product) {
            if (!pages[product.image_id]) {
                pages[product.image_id] = { products: [], image: '' };
            }
            pages[product.image_id].products.push({
                name: product.product_name,
                category: product.product_category,
                brand: product.brand,
                link: product.purchase_link
            });
        });
        res.render(`Post/editPost`, { themes, post, pages });
 
    } catch (error) {
        console.error("게시글 수정 페이지 반환 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 게시글 수정
exports.updatePost = async (req, res) => {
    try {
        const { postData, imagesData, productsData } = req.body;
        const postId = postData.post_id;

        // if member_id가 null -> response 로그인 페이지 
    
        // Post 수정
        await PostModel.update(postData);
        
        // image삭제
        await ImageModel.delete(postId);
        // image등록
        for (const imageData of imagesData) {
            imageData.post_id = postId;
            if (imageData.image_base64.data) {
                const uint8Array = new Uint8Array(imageData.image_base64.data);
                imageData.image_base64 = Buffer.from(uint8Array);
            }
            await ImageModel.create(imageData);
        }

        //product 삭제
        await ProductModel.delete(postId);
        //product등록
        for (const productData of productsData) {
            productData.post_id = postId;
            await ProductModel.create(productData);
        }
        
        return res.json({ success: true, redirect: `/post/${postId}/detail` });
    } catch (error) {
        console.error("게시글 수정 등록 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 게시글 삭제
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // if member_id가 null -> response 로그인 페이지 
        // if (삭제하는 게시글의 작성자 == 로그인된 사용자)

        await PostModel.delete(postId);
        
        res.redirect('/post/posts'); 
    } catch (error) {
        console.error("게시글 수정 등록 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 게시글 
exports.getPostDetail = async (req, res) => {
    try {
        const postId = req.params.postId;
        const memberId = 20; // 임시 

        // 로그인된 사용자 id == 게시글 작성자 id -> 수정 삭제 버튼 표시
        // 로그인된 사용자 id != 게시글 작성자 id -> 게시글 열람 & 댓글 작성 가능
        // 로그인 안됨 -> 게시글 열람 & 댓글 작성 불가
        
        await PostModel.increasedViews(postId); // 조회수++

        const post = await PostModel.findByPostId(postId);
        const member = await MemberModel.findByMemberId(post.member_id);
        const comments = await CommentModel.findByPostId(postId);

        const images = await ImageModel.findByPostId(postId); 
        const products = await ProductModel.findByPostId(postId); 
        // 기존 데이터를 페이지 객체에 저장
        const pages = {};
        images.forEach(function(post_image) {
            if (!pages[post_image.image_id]) {
                pages[post_image.image_id] = { products: [], image: '' };
            }
            pages[post_image.image_id].image = post_image.image_base64;
        });
        products.forEach(function(product) {
            if (!pages[product.image_id]) {
                pages[product.image_id] = { products: [], image: '' };
            }
            pages[product.image_id].products.push({
                name: product.product_name,
                category: product.product_category,
                brand: product.brand,
                link: product.purchase_link
            });
        });
    
        res.render('Post/post-detail', { post, member, comments, pages })

    } catch (error) {
        console.error("게시글 보기 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 좋아요 토글 
exports.toggleLike = async (req, res) => { 
    try {
        let { postId, memberId } = req.body;
        postId = parseInt(postId); // 추출한 body값을 정수로 변환
        memberId = parseInt(memberId);
        let liked = true;

        if (await PostInteractionModel.findLikeByMemberAndPost(postId, memberId) == null) { // 좋아요 추가
            PostInteractionModel.createLike(postId, memberId);
        }
        else { // 좋아요 삭제
            PostInteractionModel.deleteLike(postId, memberId);
            liked = false;
        }
    
        return res.json({ response: true, liked });
    } catch (error) {
        console.error("좋아요 오류:", error);
    }
  }


// 북마크 토글
exports.toggleBookmark = async (req, res) => {
    try {
        let { postId, memberId } = req.body;
        postId = parseInt(postId); // 추출한 body값을 정수로 변환
        memberId = parseInt(memberId);
        let bookmarked = true;

        if (await PostInteractionModel.findBookmarkByMemberAndPost(postId, memberId) == null) { // 북마크 추가
            PostInteractionModel.createBookmark(postId, memberId);
        }
        else { // 북마크 삭제
            PostInteractionModel.deleteBookmark(postId, memberId);
            bookmarked = false;
        }

        return res.json({ response: true, bookmarked });
    } catch (error) {
        console.error("북마크 오류:", error);
    }
  }


//검색
exports.findQuery = async (req, res) => {
    try {
        let selectedOpt = { query : req.query.query, sortBy : req.params.sortBy, theme : req.params.theme }

        const themes = await ThemeModel.findAll();
        results = await PostModel.findByQueryAndSortBy(selectedOpt.query, selectedOpt.sortBy, selectedOpt.theme);
        res.render('Post/searchResult', { Previews : results, themes, selectedOpt });

    } catch (error) {
        console.error("게시글 보기 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${year}/${month}/${day} 작성시간:${hours}시 ${minutes}분`;
}