const PostModel = require('../models/Post');
const ImageModel = require('../models/Image');
const ProductModel = require('../models/Product');
const ThemeModel = require('../models/Theme');
const MemberModel = require('../models/Member');
const CommentModel = require('../models/Comment');
const PostInteractionModel = require('../models/PostInteraction');


// 게시글 목록 조회
exports.getPosts = async (req, res) => {
    let page = 1;
    if (req.query.page) { page = parseInt(req.query.page); }

    const Previews = await PostModel.findByQueryAndSortBy('', 'date', 'all', page);
    const PreviewsCount = await PostModel.findCountByQueryAndSortBy('', 'date', 'all');
    const totalPages = Math.ceil(PreviewsCount / 6);

    res.render('Post/posts', { Previews, PreviewsCount, totalPages, currentPage: page, formatDate });
};

// get: 새 게시글 작성 페이지 반환
exports.newPost = async (req, res) => {
    try {
        // 로그인 여부 확인
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const themes = await ThemeModel.findAll();  // 테마 전송

        res.render('Post/newPost', {
            memberId: req.session.user.id,
            themes: themes,
            formatDate
        });
    } catch (error) {
        console.error("새 포스트 작성 페이지 반환 중 오류:", error);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
}

// post: 모델에 게시글 전송
exports.registerPost = async (req, res) => {
    try {
        // 로그인 여부 확인
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { postData, imagesData, productsData } = req.body;
    
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
        // 로그인 여부 확인
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 게시글 정보 받아오기 
        const postId = req.params.postId;
        const post = await PostModel.findByPostId(postId); // if (post == null)

        // 로그인된 사용자와 게시글 작성자가 다르면 접근 차단
        if (post.member_id !== req.session.user.id) {
            return res.status(403).json({ error: '수정 권한이 없습니다.' });
        }

        const themes = await ThemeModel.findAll(); // 테마 받아오기 
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
        res.render(`Post/editPost`, { themes, post, pages, formatDate });
 
    } catch (error) {
        console.error("게시글 수정 페이지 반환 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 게시글 수정
exports.updatePost = async (req, res) => {
    try {
        // 로그인 여부 확인
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { postData, imagesData, productsData } = req.body;
        const postId = postData.post_id;
    
        // Post 수정
        await PostModel.update(postData);
        
        // image삭제
        await ImageModel.delete(postId);
        // image등록
        for (const imageData of imagesData) {
            imageData.post_id = postId;
            if (imageData.image_base64.data) { // 이미지 값이 바이너리 데이터의 숫자 배열인 경우 
                const uint8Array = new Uint8Array(imageData.image_base64.data); //데이터를 이진 형식으로 바꿈
                imageData.image_base64 = Buffer.from(uint8Array); // 변환된 데이터를 다시 버퍼로 변환하여 할당
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
        // 로그인 여부 확인
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const postId = req.params.postId;
        const post = await PostModel.findByPostId(postId);

        if (post.member_id !== req.session.user.id) {
            return res.status(403).json({ error: '삭제 권한이 없습니다.' });
        }

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
        
        await PostModel.increasedViews(postId); // 조회수++

        const post = await PostModel.findByPostId(postId);
        const member = await MemberModel.findByMemberId(post.member_id);
        const comments = await CommentModel.findByPostId(postId); 
        
        if (IsProfileImageundefined(member.picture_base64)) member.picture_base64 = "/images/default_profile.jpg";
        comments.forEach(function(comment) {
            if (IsProfileImageundefined(comment.picture_base64)) comment.picture_base64 = "/images/default_profile.jpg";
            comment.replies.forEach(reply => {
                if (IsProfileImageundefined(reply.picture_base64)) reply.picture_base64 = "/images/default_profile.jpg";
            });
        });

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

        // 현재 세션에 저장된 사용자와 게시글 작성자가 같은 경우 -> 수정 삭제 버튼 표시
        const isAuthor = req.session.user && req.session.user.id === post.member_id;
        res.render('Post/post-detail', { post, member, comments, pages, isAuthor, formatDate }); // 수정: isAuthor 변수를 템플릿에 전달

    } catch (error) {
        console.error("게시글 보기 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

// 좋아요 토글 
exports.toggleLike = async (req, res) => { 
    try {
        // 로그인 여부 확인
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

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
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

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
        let opt = { 
            query : req.query.query, 
            sortBy : req.query.sortBy, 
            theme : req.query.theme, 
            page: parseInt(req.query.page)
        }

        const themes = await ThemeModel.findAll();
        const Previews = await PostModel.findByQueryAndSortBy(opt.query, opt.sortBy, opt.theme, opt.page);
        const PreviewsCount = await PostModel.findCountByQueryAndSortBy(opt.query, opt.sortBy, opt.theme);
        const totalPages = Math.ceil(PreviewsCount / 6);

        res.render('Post/searchResult', { Previews, themes, selectedOpt: opt, PreviewsCount, totalPages, formatDate });
    } catch (error) {
        console.error("게시글 보기 중 오류:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const KoreaData = new Date(date.getTime() + 9 * 60 * 60 * 1000); 

    const year = KoreaData.getFullYear();
    const month = KoreaData.getMonth() + 1;
    const day = KoreaData.getDate();
    const hours = KoreaData.getHours();
    const minutes = KoreaData.getMinutes();
    return `${year}/${month}/${day} 작성시간:${hours}시 ${minutes}분`;
}

function IsProfileImageundefined(picture_base64) { // 프로필이 없으면 기본이미지로 설정하는 함수
    if (!picture_base64 || picture_base64.length == 0) return true;
    else false;
}