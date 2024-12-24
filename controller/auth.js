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
            return res.status(400).send("비밀번호와 비밀번호 확인이 일치하지 않습니다.")
        }
    
        const birth_date = `${year}-${month}-${day}`
    
        const hashed = bcrypt.hashSync(login_password, config.bcrypt.saltRounds)
        const users = await authRepository.createUser({phone_number, email, login_password: hashed, username, gender, birth_date})
        const token = await createJwtToken(users.id)
        res.status(201).json({token, email})
    } catch (err) {
        res.status(400).send(err.message);
    }
}


// 로그인
export async function login(req, res, next) {
    const { username, password } = req.body
    const user = await authRepository.findByUsername(username)
    if(!user){
        res.status(401).json(`${username} 아이디를 찾을 수 없음`)
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword){
        return res.status(401).json({message: `아이디 또는 비밀번호를 확인하세요`})
    }
    const token = await createJwtToken(user.id)
    res.status(201).json({token, username})
}