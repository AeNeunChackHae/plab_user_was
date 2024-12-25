import * as authRepository from '../data/auth.js'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'


async function createJwtToken(id) {
    return jwt.sign(
    {id}, config.jwt.secretKey, {expiresIn: config.jwt.expiresInSec})
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
    const { email, login_password } = req.body
    const user = await authRepository.findByEmail(email)
    if(!user){
        res.status(401).json({message:`아이디 이메일을 찾을 수 없음`})
    }
    const isValidPassword = await bcrypt.compare(login_password, user.login_password)
    if(!isValidPassword){
        return res.status(401).json({message: `아이디 또는 비밀번호를 확인하세요`})
    }
    const token = await createJwtToken(user.id)
    res.status(201).json({token, id: user.id})
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