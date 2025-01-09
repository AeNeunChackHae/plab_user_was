import { getIamportToken, verifyPayment } from "../services/iamportService.js";
import * as paymemtData from "../data/payment.js";

export const completePayment = async (req, res) => {
  const { user_id, match_id } = req.body;

  if (!user_id || !match_id) {
    return res.status(400).json({ msg: "user_id 또는 match_id가 누락되었습니다." });
  }

  try {
    // 아임포트 토큰 발급
    const token = await getIamportToken();

    // 예시: 결제 검증 생략 (카카오페이 연동이 필요하다면 verifyPayment 호출 가능)

    // 결제 정보 데이터베이스에 저장
    const paymentData = {
      user_id,
      match_id,
      status_code: 0, // 결제 상태
      match_price: 10000, // 결제 금액 (하드코딩된 예제)
    };

    const saveResult = await paymemtData.savePaymentToDatabase(paymentData);

    if (saveResult.success) {
      res.json({ success: true, message: "결제가 성공적으로 완료되었습니다." });
    } else {
      res.status(500).json({ msg: "결제 데이터 저장 실패", error: saveResult.error });
    }
  } catch (error) {
    res.status(500).json({ msg: "서버 오류", error: error.message });
  }
};

export const getUserByIdController = async (req, res) => {
  const { id } = req.params; // URL 파라미터에서 사용자 ID 가져오기

  try {
    const user = await paymemtData.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json(user); // 사용자 정보 반환
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "사용자 정보를 가져오는 중 오류 발생" });
  }
};