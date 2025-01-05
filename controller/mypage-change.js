import * as mypageChangeRepository from '../data/mypage-change.js';
import { config } from '../config.js';
import * as bcrypt from 'bcrypt'

// 사용자 정보 조회
export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    console.log('사용자 ID 없음');
    return res.status(400).json({ message: '유효하지 않은 사용자입니다.' });
  }

  try {
    const userProfile = await mypageChangeRepository.getUserProfileData(userId);
    if (!userProfile) {
      console.log('사용자 정보 없음');
      return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    // 프로필 경로 기본값 설정
    userProfile.profile_path = userProfile.profile_path || config.profile.basic_profile_path;

    res.json(userProfile);
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ message: '사용자 정보를 조회하는 중 오류가 발생했습니다.' });
  }
};

// 사용자 정보 수정
export const updateUserProfile = async (req, res) => {
  const userId = req.userId;
  const {
    username,
    gender,
    prefer_position,
    ability,
    introduce,
  } = req.body;

  const profile_path = req.awsUploadPath || config.profile.basic_profile_path;

  if (!userId) {
    console.log('사용자 ID 없음');
    return res.status(400).json({ message: '유효하지 않은 사용자입니다.' });
  }

  // 최소한의 검증만 수행
  if (!username || !gender || !prefer_position || !ability || !introduce) {
    console.error('필수 값이 누락되었습니다.');
    return res.status(400).json({ message: '모든 필수 값을 입력해야 합니다.' });
  }

  try {
    await mypageChangeRepository.updateUserProfileData(req.photo_except, userId, {
      username,
      gender,
      prefer_position,
      ability,
      introduce,
      profile_path,
    });

    res.json({ message: '사용자 정보가 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('사용자 정보 수정 오류:', error);
    res.status(500).json({ message: error.message || '사용자 정보를 수정하는 중 오류가 발생했습니다.' });
  }
};

// 사용자 이메일 생년월일 조회
export const getUserInfo = async (req, res) => {
  const userId = req.userId;

  try {
      const userInfo = await mypageChangeRepository.getUserInfoData(userId);
      res.json({ success: true, data: userInfo });
  } catch (error) {
      res.status(500).json({ success: false, message: '사용자 정보를 불러오는데 실패했습니다.', error });
  }
};

// 생년월일 변경
export const updateBirthDate = async (req, res) => {
  const userId = req.userId;
  const { birthDate } = req.body;

  try {
      await mypageChangeRepository.updateBirthDateData(userId, birthDate);
      res.json({ success: true, message: '생년월일이 성공적으로 변경되었습니다.' });
  } catch (error) {
      res.status(500).json({ success: false, message: '생년월일 변경에 실패했습니다.', error });
  }
};

// 비밀번호 변경
export const updatePassword = async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    // 기존 비밀번호 확인
    const user = await mypageChangeRepository.getUserPassword(userId);
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.login_password);

    if (!isPasswordMatch) {
      console.log('기존 비밀번호 불일치');
      return res.status(400).json({ message: '기존 비밀번호가 일치하지 않습니다.' });
    }

    // 새 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

    // 비밀번호 업데이트
    await mypageChangeRepository.updatePasswordData(userId, hashedPassword);

    res.json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({ success: false, message: '비밀번호 변경에 실패했습니다.', error });
  }
};
