import { fetchBlacklist, addBlacklistUser, updateBlacklistStatus } from "../data/mypage-blacklist.js";
import { config } from "../config.js";

// 블랙리스트 유저 목록 불러오기
export async function getBlacklist(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId 값이 필요합니다." });
    }

    const blacklist = await fetchBlacklist(userId);

    if (!blacklist.length) {
      return res.status(200).json({ message: "블랙리스트에 등록된 사용자가 없습니다.", data: [] });
    }

    const responseData = blacklist.map(user => ({
      userId: user.userId,
      username: user.username,
      profilePath: user.profilePath || config.profile.basic_profile_path,
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching blacklist:", error);
    res.status(500).json({ message: "서버 오류" });
  }
}

// 블랙리스트 유저 추가
export async function addBlacklist(req, res) {
  try {
    const { userId, blackUserId } = req.body;

    if (!userId || !blackUserId) {
      return res.status(400).json({ message: "userId와 blackUserId 값이 필요합니다." });
    }

    await addBlacklistUser(userId, blackUserId);
    res.status(200).json({ message: "블랙리스트에 사용자가 추가되었습니다." });
  } catch (error) {
    console.error("Error adding user to blacklist:", error);
    res.status(500).json({ message: "서버 오류" });
  }
}

// 블랙리스트 유저 삭제 (상태 변경)
export async function removeBlacklist(req, res) {
  try {
    const { userId, blackUserId } = req.body;

    if (!userId || !blackUserId) {
      return res.status(400).json({ message: "userId와 blackUserId 값이 필요합니다." });
    }

    await updateBlacklistStatus(userId, blackUserId, 1); // 상태 코드 1: 삭제 상태
    res.status(200).json({ message: "블랙리스트 상태가 업데이트되었습니다." });
  } catch (error) {
    console.error("Error updating blacklist status:", error);
    res.status(500).json({ message: "서버 오류" });
  }
}
