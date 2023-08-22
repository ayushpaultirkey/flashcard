const MySQL = require("../../../config/mysql");

async function Logout(request, response) {
    
    const _response = { message: "", success: false, redirect: "" };
    
    try {

        response.clearCookie("flashcard.user");
        request.session.destroy();

        _response.redirect = "#login";

    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}

module.exports = Logout;