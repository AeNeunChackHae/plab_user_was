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

export async function applyForMatchWithValidation(req, res) {
  const { match_id, user_id } = req.body;

  if (!match_id || !user_id) {
    return res.status(400).json({ message: "match_id와 user_id가 필요합니다." });
  }

  try {
    // 중복 확인
    const isExisting = await paymemtData.checkExistingParticipant(match_id, user_id);
    if (isExisting) {
      // 중복 데이터가 있지만 status_code가 1인 경우만 업데이트
      const isUpdated = await paymemtData.updateStatusToZero(match_id, user_id);
      if (isUpdated) {
        return res.status(200).json({ message: "매치 신청이 다시 활성화되었습니다." });
      }
      return res.status(400).json({ message: "이미 활성화된 상태입니다." });
    }

    // 현재 참가자 수 확인
    const currentParticipants = await paymemtData.getCurrentParticipants(match_id);

    if (currentParticipants >= 18) {
      return res.status(400).json({ message: "이미 신청이 마감된 매치입니다." });
    }

    // 참가자 수가 17명인 경우 상태 업데이트
    if (currentParticipants === 17) {
      await paymemtData.addSocialMatchParticipant(match_id, user_id);
      await paymemtData.updateMatchStatus(match_id); // 상태 업데이트
      return res.status(201).json({ message: "매치 신청이 완료되었습니다." });
    }

    // 참가자 수가 17명 미만인 경우 신청만 처리
    await paymemtData.addSocialMatchParticipant(match_id, user_id);
    res.status(201).json({ message: "매치 신청이 완료되었습니다." });
  } catch (err) {
    console.error("매치 신청 중 오류:", err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}
// export async function applyForMatchSimple(req, res) {
//     const { match_id, user_id } = req.body;
//     console.log('심플 매치 유저',match_id,user_id)
//     if (!match_id || !user_id) {
//         return res.status(400).json({ message: "match_id와 user_id가 필요합니다." });
//     }

//     try {
//         // 중복 확인
//         const isExisting = await paymemtData.checkExistingParticipant(match_id, user_id);
//         if (isExisting) {
//             return res.status(400).json({ message: "이미 매치에 신청한 사용자입니다." });
//         }

//         await paymemtData.addSocialMatchParticipant(match_id, user_id); // 소셜 매치에 참여
//         res.status(201).json({ message: "매치 신청이 완료되었습니다." });
//     } catch (err) {
//         console.error("매치 신청 중 오류:", err);
//         res.status(500).json({ message: "서버 오류가 발생했습니다." });
//     }
// }
