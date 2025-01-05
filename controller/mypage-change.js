import { getUserProfileData, updateUserProfileData } from '../data/mypage-change.js';
import { config } from '../config.js';

/**
 * 배열 값 변환 함수
 * @param {any} value - 환경 변수 값
 * @returns {string[]} - 배열로 변환된 값
 */
function ensureArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    return value
      .replace(/[\[\]\s]/g, "") // 대괄호 및 공백 제거
      .split(",") // 콤마로 분리
      .map((item) => item.trim());
  }
  return [];
}

/**
 * 매핑된 값 반환 함수
 * @param {number|string} key - 키값 (숫자 또는 문자열)
 * @param {string[]} mappingArray - 매핑 배열
 * @param {string} label - 오류 메시지용 라벨
 * @returns {string} - 매핑된 텍스트 값
 */
function mapValue(key, mappingArray, label) {
  if (key === null || key === undefined) return "알 수 없음";
  const index = Number(key);
  if (index >= 0 && index < mappingArray.length) {
    return mappingArray[index];
  }
  console.warn(`유효하지 않은 ${label} 키: ${key}`);
  return "알 수 없음";
}

// 사용자 정보 조회
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

    const genderMapping = ensureArray(config.mypage.gender_type_code);
    const positionMapping = ensureArray(config.mypage.position_type_code);
    const abilityMapping = ensureArray(config.mypage.play_style_code);
 
    userProfile.gender = mapValue(userProfile.gender, genderMapping, "gender");
    userProfile.prefer_position = mapValue(userProfile.prefer_position, positionMapping, "position");
    userProfile.ability = mapValue(userProfile.ability, abilityMapping, "ability");

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
