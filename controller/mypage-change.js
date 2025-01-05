import { getUserProfileData, updateUserProfileData } from '../data/mypage-change.js';
import { config } from '../config.js';

// ✅ 사용자 정보 조회
export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    console.log('사용자 ID 없음');
    return res.status(400).json({ message: '유효하지 않은 사용자입니다.' });
  }

  try {
    const userProfile = await getUserProfileData(userId);
    if (!userProfile) {
      console.log('사용자 정보 없음');
      return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    // 프로필 경로 기본값 설정
    userProfile.profile_path = userProfile.profile_path || "https://d31wz4d3hgve8q.cloudfront.net/static/img/img_profile_default.png";

    res.json(userProfile);
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ message: '사용자 정보를 조회하는 중 오류가 발생했습니다.' });
  }
};

// ✅ 사용자 정보 수정
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
    await updateUserProfileData(req.photo_except, userId, {
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
