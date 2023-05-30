let Table = {
    "/public/view/login.html": "./component/auth/login.js",
    "/public/view/signup.html": "./component/auth/signup.js",
    "/public/view/home.html": "./component/home.js"
};

const Router = async function() {

    let _url = window.location.href.split(window.location.host)[1].replace(window.location.hash, "");
    
    if(typeof(Table[_url]) !== "undefined") {

        let _module = await import(Table[_url]);
        var _component = new _module.default();
        return await _component._init();
    }
    else {
        return "";
    }

}

export default Router;