const UserModel = require('../models/User');
const ThemeModel = require('../models/Theme');

// GET: 회원가입 페이지 반환
exports.signupPage = async (req, res) => {
    try {
        const themes = await ThemeModel.findAll();
        
        res.render('Signup/signup', {
            themes // themes 데이터를 EJS 템플릿에 전달
        });

    } catch (error) {
        console.error("회원가입 페이지 반환 중 오류: ", error);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
    
};


// POST: 회원가입 데이터 처리
exports.signup = async (req, res) => {
    const { email, password, username, nickname, job, gender, age, themes } = req.body;

    // 입력 데이터 검증
    if (!email || !password || !username || !nickname || !job || !gender || !age) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // gender 값을 변환
    const genderValue = gender === '남' ? 'male' : gender === '여' ? 'female' : '';

    try {
        const user = {
            email,
            password,
            username,
            nickname,
            job,
            gender: genderValue,
            age,
        };

        const memberId = await UserModel.createUser(user);
        
        for (const themeId of themes) {
            await UserModel.addPreference(memberId, themeId);
        }

        res.status(201).json({ message: 'User created successfully', memberId });
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

    try {
        // 입력된 이메일로 사용자 찾기
        const user = await UserModel.findByEmail(email);

        // 사용자가 존재하지 않는 경우
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 비밀번호가 일치하지 않는 경우
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 로그인 성공
        res.redirect('/signup'); // 회원가입 페이지로 리디렉션
    } catch (error) {
        console.error("로그인 중 오류:", error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};