export const mypageQuery = {
  selectUserMypageByEmail:
    "SELECT id, email, username, prefer_position, ability, level_code FROM PFB_USER WHERE id = ?"
};
