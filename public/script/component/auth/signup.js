import Component from "../../../library/h12.js";

@Component
class Signup extends Component {

    constructor() {
        super();
    }
    async init() {

        this.Unique();
        this.Set("{button.signup}", this.Signup);

        this.Set("{error.visible}", "hidden");
        this.Set("{error.message}", "");

    }
    render() {
        return <>
            <div class="h-full flex items-center">
                <div class="w-full flex flex-col space-y-3">
                    <label class="text-lg font-bold text-gray-700">flashcard.<label class="text-xs">v0.1</label></label>
                    <label class="text-sm font-bold text-gray-700">Signup</label>
                    <label class="text-xs font-bold text-red-500 {error.visible}">{error.message}</label>
                    <input id="name" class="bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md" type="text" placeholder="Name" />
                    <input id="username" class="bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md" type="text" placeholder="Username" />
                    <input id="password" class="bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md" type="password" placeholder="Password" />
                    <div>
                        <button onclick="{button.signup}" class="bg-blue-400 text-xs px-6 py-2 w-24 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-200">Signup</button>
                    </div>
                    <label class="text-sm">Already have an account<br/>Login</label>
                    <div>
                        <button onclick="window.location.hash = '#login';" class="bg-gray-200 text-xs px-6 py-2 w-24 rounded-lg transition-shadow hover:shadow-md">Login</button>
                    </div>
                </div>
            </div>
        </>;
    }
    async Signup() {
        
        this.Set("{error.visible}", "hidden");
        this.Set("{error.message}", "");

        const _name = this.element.name;
        const _username = this.element.username;
        const _password = this.element.password;

        try {

            if(_name.value.length < 2 || _username.value.length < 2 || _password.value.length < 2) {
                throw "Enter name, username and password";
            };

            const _response = await fetch(`/api/signup?name=${_name.value}&username=${_username.value}&password=${_password.value}`);
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

export default Signup;