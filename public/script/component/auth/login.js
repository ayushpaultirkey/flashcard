import Button from "../../property/button.js";
import Input from "../../property/input.js";
import Route from "../../router/route.js";
import H12 from "./../../../library/h12.js";

@Component
class Login extends H12.Component {

    constructor() {
        super();
    }
    init() {

        this.Set("{login}", this.Login);
        this.Set("{signup}", this.Signup);

    }
    render() {
        return <>
            <div class="w-full flex flex-col space-y-2">
                <label class="text-xl font-bold">Flashcards</label>
                <label>Login</label>
                <input type="text" placeholder="Username" inherit={ ... Input.Class } />
                <input type="text" placeholder="Password" inherit={ ... Input.Class } />
                <button onclick="{login}" inherit={ ... Button.Class }>Login</button>
                <div>
                    <label class="block text-sm mt-5">Don't have an account ?</label>
                </div>
                <button onclick="{signup}" inherit={ ... Button.Class }>Signup</button>
            </div>
        </>;
    }
    Login() {

    }
    Signup() {
        window.location.href = Route.signup;
    }

}

export default Login;