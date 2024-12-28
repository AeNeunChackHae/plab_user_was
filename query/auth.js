export const authQuery = {
  selectUserByEmail: "SELECT * FROM PFB_USER WHERE email=?",
  selectUserByphone: "SELECT * FROM PFB_USER WHERE phone_number=?",
  insertUser:
    "INSERT INTO PFB_USER (phone_number, email, login_password, username, gender, birth_date) VALUES (?, ?, ?, ?, ?, ?)",
};

/*
    조인을 통해서 값을 가져와야 할 시 아래처럼 이름을 지정한다.
    ex) joinMatchAndStadium -> (join(테이블명)and(테이블명)and...)


    내용이 길 경우 아래처럼 나눠서 적는다.
    ex)
    joinStadiumAndMatch : `
        SELECT 
            s.width,
            s.height,
            s.shower_yn AS shower,
            s.parking_yn AS parking,
            s.lend_shoes_yn AS lendShoes,
            s.sell_drink_yn AS sellDrink,
            s.notice
        FROM 
            PFB_STADIUM s
        JOIN 
            PFB_MATCH m ON s.id = m.stadium_id
        WHERE 
            m.id = ?;
    `;
*/
