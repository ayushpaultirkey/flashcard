import Component from "./../library/h12.js";
import Router from "./router.js";

import Signup from "./component/auth/signup.js";
import Login from "./component/auth/login.js";
import Home from "./component/home.js";
import User from "./component/user.js";
import Search from "./component/search.js";

@Component
class App extends Component {

    constructor() {
        super();
    }
    async init() {
        
        const router = new Router({
            component: this,
            key: "{app}",
            route: {
                "#login": Login,
                "#signup": Signup,
                "#home": Home,
                "#user": User,
                "#search": Search
            },
            default: "#login"
        });
        router.Set();
        router.Observe();

    }
    async render() {
        return <>
            <div class="w-full h-full overflow-auto p-6 scroll">
                {app}
            </div>
        </>;
    }

}

Component.Render(App, {}, ".app");