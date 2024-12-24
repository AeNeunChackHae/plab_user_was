import dotenv from "dotenv";

dotenv.config();

function getEnvValue(key) {
  let value = process.env[key];
  if (value && value.startsWith("[")) {
    value = value.replace(/[\[\]\s]/g, "").split(",");
  }
  return value;
}

export const config = {
  db: {
    db_host: getEnvValue("DB_HOST"),
    db_port: getEnvValue("DB_PORT"),
    db_user: getEnvValue("DB_USER"),
    db_password: getEnvValue("DB_PASSWORD"),
    db_database: getEnvValue("DB_DATABASE"),
  },
  aws: {
    bucket_name: getEnvValue("AWS_BUCKET_NAME"),
    bucket_region: getEnvValue("AWS_BUCKET_REGION"),
    access_key: getEnvValue("AWS_ACCESS_KEY"),
    secret_key: getEnvValue("AWS_SECRET_KEY"),
  },
  mypage: {
    play_style_code: getEnvValue("PLAY_STYLE_CODE"),
    position_type_code: getEnvValue("POSITION_TYPE_CODE"),
    user_status_code: getEnvValue("USER_STATUS_CODE"),
    coupon_status_code: getEnvValue("COUPON_STATUS_CODE"),
    friend_status_code: getEnvValue("FRIEND_STATUS_CODE"),
    level_type_code: getEnvValue("LEVEL_TYPE_CODE"),
    gender_type_code: getEnvValue("GENDER_TYPE_CODE"),
    card_type_code: getEnvValue("CARD_TYPE_CODE"),
    card_reason_code: getEnvValue("CARD_REASON_CODE"),
    feedback_type_code: getEnvValue("FEEDBACK_TYPE_CODE"),
    individual_positive_code: getEnvValue("INDIVIDUAL_POSITIVE_CODE"),
    individual_negative_code: getEnvValue("INDIVIDUAL_NEGATIVE_CODE"),
    manager_positive_feedback_code: getEnvValue(
      "MANAGER_POSITIVE_FEEDBACK_CODE"
    ),
    manager_negative_feedback_code: getEnvValue(
      "MANAGER_NEGATIVE_FEEDBACK_CODE"
    ),
    blacklist_status_code: getEnvValue("BLACKLIST_STATUS_CODE"),
  },
  team: {
    team_status_code: getEnvValue("TEAM_STATUS_CODE"),
    activity_time_code: getEnvValue("ACTIVITY_TIME_CODE"),
    member_status_code: getEnvValue("MEMBER_STATUS_CODE"),
    team_appliance_reject_code: getEnvValue("TEAM_APPLIANCE_REJECT_CODE"),
    team_appliance_status_code: getEnvValue("TEAM_APPLIANCE_STATUS_CODE"),
  },
  payment: {
    cash_receipt_purpose_code: getEnvValue("CASH_RECEIPT_PURPOSE_CODE"),
    bank_code: getEnvValue("BANK_CODE"),
    deposit_reason_code: getEnvValue("DEPOSIT_REASON_CODE"),
    deposit_type_code: getEnvValue("DEPOSIT_TYPE_CODE"),
  },
  stadium_match: {
    match_progress_status_code: getEnvValue("MATCH_PROGRESS_STATUS_CODE"),
    stadium_usage_status_code: getEnvValue("STADIUM_USAGE_STATUS_CODE"),
    parking_permission_code: getEnvValue("PARKING_PERMISSION_CODE"),
    ground_type_code: getEnvValue("GROUND_TYPE_CODE"),
    match_gender_type_code: getEnvValue("MATCH_GENDER_TYPE_CODE"),
    match_level_limit_code: getEnvValue("MATCH_LEVEL_LIMIT_CODE"),
    match_player_count_code: getEnvValue("MATCH_PLAYER_COUNT_CODE"),
    stud_usage_code: getEnvValue("STUD_USAGE_CODE"),
    applicant_status_code: getEnvValue("APPLICANT_STATUS_CODE"),
    match_type_code: getEnvValue("MATCH_TYPE_CODE"),
    match_team_type_code: getEnvValue("MATCH_TEAM_TYPE_CODE"),
    match_result_code: getEnvValue("MATCH_RESULT_CODE"),
    match_reservation_status_code: getEnvValue("MATCH_RESERVATION_STATUS_CODE"),
    positive_feedback_code: getEnvValue("POSITIVE_FEEDBACK_CODE"),
    negative_feedback_code: getEnvValue("NEGATIVE_FEEDBACK_CODE"),
  },
  region: {
    region_main_category_code: getEnvValue("REGION_MAIN_CATEGORY_CODE"),
    region_jeju_code: getEnvValue("REGION_JEJU_CODE"),
    region_gyeongnam_code: getEnvValue("REGION_GYEONGNAM_CODE"),
    region_gyeongbuk_code: getEnvValue("REGION_GYEONGBUK_CODE"),
    region_jeonnam_code: getEnvValue("REGION_JEONNAM_CODE"),
    region_jeonbuk_code: getEnvValue("REGION_JEONBUK_CODE"),
    region_chungnam_code: getEnvValue("REGION_CHUNGNAM_CODE"),
    region_chungbuk_code: getEnvValue("REGION_CHUNGBUK_CODE"),
    region_gangwon_code: getEnvValue("REGION_GANGWON_CODE"),
    region_gyeonggi_code: getEnvValue("REGION_GYEONGGI_CODE"),
    region_sejong_code: getEnvValue("REGION_SEJONG_CODE"),
    region_ulsan_code: getEnvValue("REGION_ULSAN_CODE"),
    region_daejeon_code: getEnvValue("REGION_DAEJEON_CODE"),
    region_gwangju_code: getEnvValue("REGION_GWANGJU_CODE"),
    region_incheon_code: getEnvValue("REGION_INCHEON_CODE"),
    region_daegu_code: getEnvValue("REGION_DAEGU_CODE"),
    region_busan_code: getEnvValue("REGION_BUSAN_CODE"),
    region_seoul_code: getEnvValue("REGION_SEOUL_CODE"),
  },
  manager: {
    manager_status_code: getEnvValue("MANAGER_STATUS_CODE"),
  },
  board_chat: {
    board_tag_code: getEnvValue("BOARD_TAG_CODE"),
  },
  admin_account: {
    account: getEnvValue("ADMIN_ACCOUNT"),
    password: getEnvValue("ADMIN_PASSWORD"),
  },
  jwt: {
    secretKey: getEnvValue('JWT_SECRET'),
    expiresInSec: parseInt(getEnvValue('JWT_EXPIRES_SEC', 259200))
  },
  bcrypt: {
    saltRounds: parseInt(getEnvValue('BCRYPT_SALT_ROUNDS'))
  }  
};
