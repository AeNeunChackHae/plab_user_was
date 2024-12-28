export const mypageQuery = {
  selectUserMypageByEmail:
    "SELECT id, username, prefer_position, level_code FROM PFB_USER WHERE email = ?",
};
