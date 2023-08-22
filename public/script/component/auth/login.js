import Component from "../../../library/h12.js";

@Component
class Login extends Component {

    constructor() {
        super();
    }
    async init() {

        const _response = await fetch("/api/user/get");
        const _data = await _response.json();

        if(_data.success) {
            window.location.hash = "#home";
        };

        this.Unique();
        this.Set("{e.login}", this.Login);

        this.Set("{error.visible}", "hidden");
        this.Set("{error.message}", "");

    }
    render() {
        return <>
            <div class="h-full flex items-center">
                <div class="w-full flex flex-col space-y-3">
                    <label class="text-lg font-bold text-gray-700">flashcard.<label class="text-xs">v0.1</label></label>
                    <label class="text-sm font-bold text-gray-700">Login</label>
                    <label class="text-xs font-bold text-red-500 {error.visible}">{error.message}</label>
                    <input id="username" class="bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md" type="text" placeholder="Username" />
                    <input id="password" class="bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md" type="password" placeholder="Password" />
                    <div>
                        <button onclick="{e.login}" class="bg-blue-400 text-xs px-6 py-2 w-24 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-200">Login</button>
                    </div>
                    <label class="text-sm">Don't have an account<br/>Signup</label>
                    <div>
                        <button onclick="window.location.hash = '#signup';" class="bg-gray-200 text-xs px-6 py-2 w-24 rounded-lg transition-shadow hover:shadow-md">Signup</button>
                    </div>
                </div>
            </div>
        </>;
    }
    async Login() {
        
        this.Set("{error.visible}", "hidden");
        this.Set("{error.message}", "");

        const _username = this.element.username;
        const _password = this.element.password;

        try {

            if(_username.value.length < 2 || _password.value.length < 2) {
                throw "Enter username and password";
            };

            const _response = await fetch(`/api/login?username=${_username.value}&password=${_password.value}`);
            const _data = await _response.json();

            if(!_data.success) {
                throw _data.message;
            };
            
            window.location.hash = '#home';

        }
        catch(ex) {
            this.Set("{error.visible}", "visible");
            this.Set("{error.message}", ex);
        };

    }
}

export default Login;