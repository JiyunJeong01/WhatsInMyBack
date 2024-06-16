const validator = require('validator');
const bcrypt = require('bcrypt');
const MemberModel = require('../models/Member');
const ThemeModel = require('../models/Theme');
const PreferenceModel = require('../models/Preference')

// GET: 회원가입 페이지 반환
exports.signupPage = async (req, res) => {
    try {
        const themes = await ThemeModel.findAll(); // 테마 목록 불러오기
        res.render("Signup/signup", { themes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load signup page' });
    }
};

// POST: 회원가입 데이터 처리
exports.signup = async (req, res) => {
    const { email, password, username, nickname, job, gender, age, themes } = req.body;

    // gender 값을 변환
    const genderValue = gender === '남' ? 'male' : gender === '여' ? 'female' : '';

    try {
        // 이메일 중복 확인
        const existingEmail = await MemberModel.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: '이미 가입된 이메일입니다.' });
        }

        // 닉네임 중복 확인
        const existingNickname = await MemberModel.getUserByNickname(nickname);
        if (existingNickname) {
            return res.status(400).json({ error: '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력하세요.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱 

        const user = {
            email,
            password: hashedPassword,
            username,
            nickname,
            job,
            gender: genderValue,
            age,
        };

        const memberId = await MemberModel.createUser(user);
        
        for (const themeId of themes) {
            await PreferenceModel.addPreference(memberId, themeId);
        }

        return res.status(200).json({ message: 'Sign up successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

///////////////////////////////////////////

// GET: 로그인 페이지 반환
exports.loginPage = (req, res) => {
    res.render('Login/login');
};

// POST: 로그인 데이터 처리
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // 이메일과 비밀번호의 길이 확인
    if (email.length > 255 || password.length > 255) {
        return res.status(400).json({ error: '이메일 또는 비밀번호의 길이가 허용된 길이를 초과했습니다.' });
    }

    // 이메일 형식 검증
    if (!validator.isEmail(email)) {
        return res.status(400).json({ field: 'email', error: '올바른 이메일 주소를 입력하세요.' });
    }

    try {
        // 입력된 이메일로 사용자 찾기
        const user = await MemberModel.getUserByEmail(email);

        // 사용자가 존재하지 않는 경우
        if (!user) {
            return res.status(404).json({ field: 'email', error: '회원정보를 찾을 수 없습니다.' });
        }

        // 비밀번호가 일치하지 않는 경우
        const passwordMatch = await bcrypt.compare(password, user.password); // 비밀번호 비교
        if (!passwordMatch) {
            return res.status(401).json({ field: 'password', error: '비밀번호가 일치하지 않습니다.' });
        }

        // 로그인 성공 시, 세션에 사용자 정보 저장
        req.session.user = {
            id: user.member_id,
            email: user.email,
            username: user.username
        };

        // 로그인 성공
        return res.status(200).json({ message: '로그인 되었습니다.' });
        //res.redirect('/'); // 로그인 성공 후 메인 페이지로 리디렉션
    } catch (error) {
        console.error("로그인 중 오류:", error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};

///////////////////////////////////////////

// GET: 로그아웃 처리
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.redirect('/');
    });
};