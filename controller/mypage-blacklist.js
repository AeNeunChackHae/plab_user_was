import {
  getBlacklistedUsersById,
  addUserToBlacklist,
  removeUserFromBlacklist,
} from "../data/mypage-blacklist.js";

// 블랙리스트 불러오는 함수
export async function getBlacklistedUsersController(req, res) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "유저 ID가 필요합니다" });
  }

  try {
    const blacklistedUsers = await getBlacklistedUsersById({ id });

    if (blacklistedUsers.length === 0) {
      return res.status(404).json({ message: "블랙 멤버가 없습니다" });
    }

    return res.status(200).json(blacklistedUsers);
  } catch (error) {
    console.error("블랙리스트 fetch 오류:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
}

// 블랙리스트 추가하는 함수
export async function addUserToBlacklistController(req, res) {
  const { userId, blackUserId } = req.body;

  if (!userId || !blackUserId) {
    return res
      .status(400)
      .json({ message: "User ID 와 Black User ID 가 필요합니다" });
  }

  try {
    const success = await addUserToBlacklist({ userId, blackUserId });

    if (!success) {
      return res.status(500).json({ message: "블랙 유저 등록에 실패했습니다" });
    }

    return res
      .status(201)
      .json({ message: "블랙리스트에 성공적으로 등록되었습니다" });
  } catch (error) {
    console.error("블랙 리스트 유저 등록 에러:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
}

// 블랙리스트 삭제하는 함수
export async function removeUserFromBlacklistController(req, res) {
  const { userId, blackUserId } = req.body;

  if (!userId || !blackUserId) {
    return res
      .status(400)
      .json({ message: "User ID 와 Black User ID가 필요합니다" });
  }

  try {
    const success = await removeUserFromBlacklist({ userId, blackUserId });

    if (!success) {
      return res.status(500).json({ message: "블랙 유저 삭제에 실패했습니다" });
    }

    return res.status(200).json({ message: "블랙 유저 삭제에 성공했습니다" });
  } catch (error) {
    console.error("블랙 유저 삭제 실패:", error);
    return res.status(500).json({ message: "서버 오류" });
  }
}
