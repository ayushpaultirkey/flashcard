const e = require("express");
const MySQL = require("../../../config/mysql");
const date = require("date-and-time");

async function List(request, response) {
    
    const _response = { message: "", success: false, data: [], redirect: "" };
    
    try {

        const _userid = (typeof(request.query.userid) !== "undefined") ? request.query.userid : ((typeof(request.session["flashcard.user"]) !== "undefined") ? request.session["flashcard.user"] : null);

        if(typeof(_userid) == "undefined" || _userid == null) {
            _response.redirect = "#login";
            throw "No user found";
        };


        const _connection = new MySQL.Connection();
        await _connection.Connect();


        let _result = null;
        if(typeof(request.query.userid) == "undefined" && typeof(request.query.self) == "undefined") {
            _result = await _connection.Query(`
                SELECT
                    Post.ID AS post_id,
                    Post.Content AS post_content,
                    Post.Date AS post_date,
                    Post.UserID AS user_id,
                    (SELECT name FROM User WHERE User.ID = Post.UserID) AS user_name,
                    (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID) AS post_like,
                    (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID AND \`Like\`.UserID = ?) AS post_liked
                FROM Post INNER JOIN Follow ON Post.UserID = Follow.FollowingID and follow.UserID = ?
                UNION
                SELECT
                    Post.ID AS post_id,
                    Post.Content AS post_content,
                    Post.Date AS post_date,
                    Post.UserID AS user_id,
                    (SELECT name FROM User WHERE User.ID = Post.UserID) AS user_name,
                    (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID) AS post_like,
                    (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID AND \`Like\`.UserID = ?) AS post_liked
                FROM Post WHERE Post.UserID = ? ORDER BY post_id DESC;
            `, [ request.session["flashcard.user"], _userid, request.session["flashcard.user"], _userid ]);
        }
        else {
            _result = await _connection.Query(
                "SELECT " +
                    "ID AS post_id, " +
                    "Content AS post_content, " +
                    "Date AS post_date, " +
                    "UserID AS user_id, " +
                    "(SELECT name FROM `User` WHERE `User`.`ID` = `Post`.`UserID`) AS user_name, " +
                    "(SELECT COUNT(*) FROM `Like` WHERE `Like`.`PostID` = `Post`.`ID`) AS post_like, " +
                    "(SELECT COUNT(*) FROM `Like` WHERE `Like`.`PostID` = `Post`.`ID` AND `Like`.`UserID` = ?) AS post_liked " +
                "FROM `Post` WHERE `UserID` = ? ORDER BY ID DESC;"
            , [ request.session["flashcard.user"], _userid ]);
        };

        /*`
            SELECT
                ID AS post_id,
                Content AS post_content,
                Date AS post_date,
                UserID AS user_id,
                (SELECT name FROM User WHERE User.ID = Post.UserID) AS user_name,
                (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID) AS post_like,
                (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID AND \`Like\`.UserID = ?) AS post_liked
            FROM Post INNER JOIN Follow ON Post.UserID = Follow.FollowingID and follow.UserID = 8
            UNION
            SELECT
                ID AS post_id,
                Content AS post_content,
                Date AS post_date,
                UserID AS user_id,
                (SELECT name FROM User WHERE User.ID = Post.UserID) AS user_name,
                (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID) AS post_like,
                (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID AND \`Like\`.UserID = ?) AS post_liked
            FROM Post WHERE Post.UserID = 8 ORDER BY Post.ID DESC;
        `

        const _result = await _connection.Query(`
                SELECT
                    Post.ID AS post_id,
                    Post.Content AS post_content,
                    Post.Date AS post_date,
                    Post.UserID AS user_id,
                    (SELECT name FROM User WHERE User.ID = Post.UserID) AS user_name,
                    (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID) AS post_like,
                    (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID AND \`Like\`.UserID = ?) AS post_liked
                FROM Post INNER JOIN Follow ON Post.UserID = Follow.FollowingID and follow.UserID = ?
                UNION
                SELECT
                    Post.ID AS post_id,
                    Post.Content AS post_content,
                    Post.Date AS post_date,
                    Post.UserID AS user_id,
                    (SELECT name FROM User WHERE User.ID = Post.UserID) AS user_name,
                    (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID) AS post_like,
                    (SELECT COUNT(*) FROM \`Like\` WHERE \`Like\`.PostID = Post.ID AND \`Like\`.UserID = ?) AS post_liked
                FROM Post WHERE Post.UserID = ? ORDER BY post_id DESC;
        `, [ request.session["flashcard.user"], _userid, request.session["flashcard.user"], _userid ]);
        const _result = await _connection.Query(
            "SELECT " +
            "ID AS post_id, " +
            "Content AS post_content, " +
            "Date AS post_date, " +
            "UserID AS user_id, " +
            "(SELECT name FROM `User` WHERE `User`.`ID` = `Post`.`UserID`) AS user_name, " +
            "(SELECT COUNT(*) FROM `Like` WHERE `Like`.`PostID` = `Post`.`ID`) AS post_like, " +
            "(SELECT COUNT(*) FROM `Like` WHERE `Like`.`PostID` = `Post`.`ID` AND `Like`.`UserID` = ?) AS post_liked " +
            "FROM `Post` WHERE `UserID` = ? ORDER BY ID DESC;"
        , [ request.session["flashcard.user"], _userid ]);*/

        _result.forEach(x => {
            x.post_delete = (x.user_id == request.session["flashcard.user"]);
            x.post_liked = (x.post_liked != 0) ? true : false;
        });

        _response.data = _result;
        _response.success = true;

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}


module.exports = List;