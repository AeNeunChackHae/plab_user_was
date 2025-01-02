import { db } from '../mysql.js';
import { matchQuery } from '../query/main.js';

// 매치 목록 조회 (POST 방식: 필터 적용)
export async function getFilteredMatches(date, region, gender, level) {
    try {
        let query = matchQuery.selectFilteredMatches;
        const params = [];
        
        // 날짜 필터
        if (date) {
            query = query.replace('{dateCondition}', `AND DATE(m.match_start_time) = ?`);
            params.push(date);
        } else {
            query = query.replace('{dateCondition}', '');
        }

        // 지역 필터 (코드로 필터링)
        if (region && region.length > 0) {
            query = query.replace('{regionCondition}', `AND s.main_region IN (${region.map(() => '?').join(',')})`);
            params.push(...region.map((code) => Number(code)));
        } else {
            query = query.replace('{regionCondition}', '');
        }

        // 성별 필터 (코드로 필터링)
        if (gender && gender.length > 0) {
            query = query.replace('{genderCondition}', `AND m.allow_gender IN (${gender.map(() => '?').join(',')})`);
            params.push(...gender.map((g) => Number(g)));
        } else {
            query = query.replace('{genderCondition}', '');
        }

        // 레벨 필터 (코드로 필터링)
        if (level && level.length > 0) {
            query = query.replace('{levelCondition}', `AND m.level_criterion IN (${level.map(() => '?').join(',')})`);
            params.push(...level.map((code) => Number(code)));
        } else {
            query = query.replace('{levelCondition}', '');
        }

        // 디버깅 메시지
        // console.log('SQL 파라미터:', params);
        // console.log('최종 SQL 쿼리:', query);

        const [results] = await db.execute(query, params);
        return results;
    } catch (err) {
        console.error('매치 목록 조회 중 오류 발생:', err);
        throw err;
    }
}

// 필터 옵션 데이터 조회
export async function getFilterOptions() {
    try {
        const [results] = await db.execute(matchQuery.selectFilterOptions);
        return results;
    } catch (err) {
        console.error('필터 옵션 조회 중 오류 발생:', err);
        throw err;
    }
}
