export const cardQuery = {
  getCardStatsById: `SELECT 
      PFB_CARD.id AS card_id, 
      PFB_CARD.card_type, 
      PFB_CARD.description_code, 
      PFB_CARD.match_id, 
      PFB_MATCH.match_start_time, 
      PFB_MATCH.match_end_time, 
      PFB_MATCH.match_type, 
      PFB_MATCH.status_code, 
      PFB_MATCH.allow_gender, 
      PFB_MATCH.level_criterion 
    FROM
      PFB_CARD  
    INNER JOIN 
      PFB_MATCH ON PFB_CARD.match_id = PFB_MATCH.id 
    WHERE
      PFB_CARD.user_id = ? `,
};
