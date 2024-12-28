import { deleteUsermember } from "../data/mypage-withdrawarl.js";

export async function deleteUser(req, res) {
  const { email } = req.body;

  try {
    const isDeleted = await deleteUsermember({ email });

    if (!isDeleted) {
      return res
        .status(404)
        .json({ message: "유저가 삭제되었거나 찾을 수 없습니다" });
    }

    res.status(200).json({ message: "탈퇴가 완료되었습니다" });
  } catch (error) {
    console.error("유저 삭제 중 오류가 발생했습니다:", error);
    res.status(500).json({ message: "서버 오류" });
  }
}
