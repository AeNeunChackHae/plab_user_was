import * as authRepository from '../data/auth.js'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { hashPassword, generateTemporaryPassword } from "../utils/password.js";
import { sendEmail } from "../utils/email.js";


async function createJwtToken(id) {
    return jwt.sign(
    {id}, config.jwt.user_secretKey, {expiresIn: config.jwt.expiresInSec})
}

// 회원가입
export async function signup(req, res, next) {
    try {
        const { email, login_password, login_password_confirm, username, phone_number, gender, year, month, day } = req.body
    
        const foundEmail = await authRepository.findByEmail(email)
        if(foundEmail){
            return res.status(409).json({message: `${email}이 이미 있습니다`})
        }
    
        const foundPhone = await authRepository.findByPhone(phone_number)
        if(foundPhone){
            return res.status(409).json({message: `${phone_number} 이미 있습니다`})
        }
    
        if (login_password !== login_password_confirm) {
            return res.status(400).send({message: "비밀번호와 비밀번호 확인이 일치하지 않습니다."})
        }
    
        const birth_date = `${year}-${month}-${day}`
    
        const hashed = await bcrypt.hash(login_password, config.bcrypt.saltRounds)
        const users = await authRepository.createUser({phone_number, email, login_password: hashed, username, gender, birth_date})
        const token = await createJwtToken(users.id)
        res.status(201).json({token, email})
    } catch (err) {
        res.status(400).send(err.message);
    }
}

// 로그인
export async function login(req, res, next) {
    try {
      const { email, login_password } = req.body;
  
      // 1️사용자 이메일로 조회
      const user = await authRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: '이메일을 찾을 수 없습니다.' });
      }
  
      // 2️비밀번호 검증
      const isValidPassword = await bcrypt.compare(login_password, user.login_password);
      if (!isValidPassword) {
        return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
  
      // 3️JWT 토큰 생성
      const token = await createJwtToken(user.id);
  
      // 4️로그인 성공 응답
      res.status(200).json({
        success: true,
        message: '로그인 성공',
        token,
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: '서버 오류로 로그인에 실패했습니다.',
      });
    }
  }

// 토큰 인증
export async function verify(req, res, next) {
    const token = req.header['Token']
    if(token){
        res.status(200).json(token)
    }
}

// 로그인(토큰) 유지
export async function me(req, res, next) {
    const user = await authRepository.findById(req.userId)
    if(!user){
        return res.status(404).json({message:`일치하는 사용자가 없음`})
    }
    res.status(200).json({token: req.token, id: user.id})
}

// 로그아웃
export const logout = (req, res) => {
    try {
      // 로그아웃 처리 (프론트에서 클라이언트가 토큰을 삭제하도록 안내)
      console.log(`User ID: ${req.userId} 로그아웃`);
  
      res.json({
        success: true,
        message: '로그아웃 되었습니다. 브라우저에서 토큰을 삭제해주세요.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: '서버 오류로 로그아웃에 실패했습니다.',
      });
    }
  };

// 회원 탈퇴
export async function deleteAccount(req, res) {
    try {
      const userId = req.userId;
  
      // 진행 예정 매치 확인
      const upcomingMatches = await authRepository.findUpcomingMatchesByUserId(userId);
      if (upcomingMatches.length > 0) {
        return res.status(400).json({
          success: false,
          message: '진행 예정인 매치가 있습니다. 매치 완료 후 탈퇴가 가능합니다.',
          data: upcomingMatches,
        });
      }
  
      // 사용자 삭제
      await authRepository.deleteUserById(userId);
      console.log(`User ID: ${userId} 계정 삭제`);
  
      return res.status(200).json({
        success: true,
        message: '계정이 성공적으로 삭제되었습니다.',
      });
    } catch (error) {
      console.error('Account deletion error:', error);
      return res.status(500).json({
        success: false,
        message: '서버 오류로 인해 계정 삭제에 실패했습니다.',
      });
    }
  }

  
// 이메일 찾기위한 유저  확인인
export async function findEmailController(req, res) {
  const { username, phoneNumber } = req.body;
  console.log('username, phoneNumber',username, phoneNumber)

  // 입력 값 검증
  if (!username || !phoneNumber) {
    return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
  }

  try {
    const email = await authRepository.findEmailByUserInfo(username, phoneNumber);

    if (!email) {
      return res.status(404).json({ message: '일치하는 사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ email });
  } catch (error) {
    console.error('Error in findEmailController:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}

// 비밀번호 찾기 및 재설정정
export async function sendResetPasswordEmail(req, res) {
    console.log('리엑트에서 쐈음')
    const { name, phoneNumber, email } = req.body;
    console.log(' name, phoneNumber, email', name, phoneNumber, email)
  
    // 입력값 검증
    if (!name || !phoneNumber || !email) {
      return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
    }
  
    try {
      // 유저 정보 조회
      const user = await authRepository.findUserByInfo(name, phoneNumber, email);
      console.log('user',user)
  
      if (!user) {
        return res.status(404).json({ message: "일치하는 사용자를 찾을 수 없습니다." });
      }
  
      // 임시 비밀번호 생성 및 해시화
      const temporaryPassword = generateTemporaryPassword();
      const hashedPassword = await hashPassword(temporaryPassword);
  
      // DB에 비밀번호 업데이트
      await authRepository.updatePassword(user.id, hashedPassword);
  
      // 이메일 전송
      await sendEmail({
        to: email, // 유저 이메일
        subject: "임시 비밀번호 발급",
        text: `안녕하세요, ${name}님.\n\n임시 비밀번호는 다음과 같습니다: ${temporaryPassword}\n로그인 후 반드시 비밀번호를 변경해주세요. \n임시 비밀번호인 만큼, 로그인하신 후 직접 비밀번호를 꼭 변경해 주세요.`,
      });
  
      res.status(200).json({ message: "임시 비밀번호가 이메일로 전송되었습니다." });
    } catch (error) {
      console.error("Error in sendResetPasswordEmail:", error);
      res.status(500).json({ message: "이메일 전송 중 오류가 발생했습니다." });
    }
  }