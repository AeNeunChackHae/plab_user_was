import bcrypt from "bcrypt";
import { updatePasswordByid } from "../data/mypage-change-pw.js";

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { newPassword } = req.body;

    if (!id) {
      return res.status(401).json({ message: "유효하지 않은 사용자입니다." });
    }
    if (!newPassword) {
      return res.status(400).json({ message: "새 비밀번호를 입력해주세요." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const isUpdated = await updatePasswordByid({
      id,
      newPassword: hashedPassword,
    });

    if (isUpdated) {
      return res
        .status(200)
        .json({ message: "비밀번호가 성공적으로 변경되었습니다." });
    } else {
      return res.status(404).json({
        message:
          "비밀번호 업데이트에 실패했습니다. 사용자 정보를 확인해주세요.",
      });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ message: "서버 오류로 인해 비밀번호 변경에 실패했습니다." });
  }
};
