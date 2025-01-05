import * as authRepository from '../data/auth.js'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'


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