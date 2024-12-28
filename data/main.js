import { db } from '../mysql.js';
import { matchQuery } from '../query/main.js';

// 매치 목록 조회 (POST 방식: 필터 적용)
export async function getFilteredMatches(date, region, gender, level) {
    try {
        let query = matchQuery.selectFilteredMatches;
        const params = [];
        
        // 날짜 필터
        if (date) {
            query = query.replace('{dateCondition}', `AND DATE(M.match_start_time) = ?`);
            params.push(date);
        } else {
            query = query.replace('{dateCondition}', '');
        }

        // 지역 필터 (코드로 필터링)
        if (region && region.length > 0) {
            query = query.replace('{regionCondition}', `AND S.main_region IN (${region.map(() => '?').join(',')})`);
            params.push(...region.map((code) => Number(code)));
        } else {
            query = query.replace('{regionCondition}', '');
        }

        // 성별 필터 (코드로 필터링)
        if (gender && gender.length > 0) {
            query = query.replace('{genderCondition}', `AND M.allow_gender IN (${gender.map(() => '?').join(',')})`);
            params.push(...gender.map((g) => Number(g)));
        } else {
            query = query.replace('{genderCondition}', '');
        }

        // 레벨 필터 (코드로 필터링)
        if (level && level.length > 0) {
            query = query.replace('{levelCondition}', `AND M.level_criterion IN (${level.map(() => '?').join(',')})`);
            params.push(...level.map((code) => Number(code)));
        } else {
            query = query.replace('{levelCondition}', '');
        }
        console.log('SQL Params:', params);

        const [results] = await db.execute(query, params);
        return results;
    } catch (err) {
        console.error('Error fetching filtered matches:', err);
        throw err;
    }
}

// 필터 옵션 데이터 조회
export async function getFilterOptions() {
    try {
        const [results] = await db.execute(matchQuery.selectFilterOptions);
        return results;
    } catch (err) {
        console.error('Error fetching filter options:', err);
        throw err;
    }
}
