import E404 from "../page/error/404.js";

class Router {
    constructor(property = {}) {
        this.route = {};
        this.component = null;
        this.key = "";
        this.default = "";
        Object.assign(this, property);
    }
    Add(url = "", component = null) {
        this.list[url] = component;
    }
    Find(hash = "") {

        const _route = this.route[hash.toLowerCase()];

        return (typeof(_route) !== "undefined") ? _route : E404;

    }
    async Set() {
        
        const _url = window.location.hash;
        const _matchurl = _url.match(/\#\w+/g);

        if(_url.length == 0) {
            window.location.hash = this.default;
        }

        if(_matchurl !== null) {

            const _route = this.Find(_matchurl[0]);
            const _component = new _route();
    
            //triggerAnime(".map");
    
            this.component.Set(this.key, await _component.pre());

        };
        
        
    }
    Observe() {

        window.onhashchange = () => {
            this.Set();
        };

    }
}
Router.Hash = function(hash = "") {
    window.location.hash = hash;
}

export default Router;