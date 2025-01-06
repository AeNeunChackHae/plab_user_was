import { getFAQs, postFAQ } from "../data/cs.js";

// FAQ 목록 불러오기
export async function getFAQsHandler(req, res) {
    try {
        const faqs = await getFAQs();
        res.status(200).json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ message: "FAQ 데이터를 불러오는데 실패했습니다." });
    }
}

// 문의 등록
export async function postFAQHandler(req, res) {
    try {
        const { user_id, title, content } = req.body;

        if (!user_id || !title || !content) {
            return res.status(400).json({ message: "user_id, title, content 값이 필요합니다." });
        }

        const result = await postFAQ(user_id, title, content);
        res.status(201).json({ message: "문의가 성공적으로 등록되었습니다." });
    } catch (error) {
        console.error("Error posting FAQ:", error);
        res.status(500).json({ message: "문의 등록에 실패했습니다." });
    }
}
