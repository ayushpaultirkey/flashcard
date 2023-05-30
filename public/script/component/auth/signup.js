import Button from "../../property/button.js";
import Input from "../../property/input.js";
import Route from "../../router/route.js";
import H12 from "./../../../library/h12.js";

@Component
class Signup extends H12.Component {

    constructor() {
        super();
    }
    init() {

        this.Set("{login}", this.Login);
        this.Set("{signup}", this.Signup);
        
    }
    render() {
        return <>
            <div class="w-full max-w-sm flex flex-col space-y-2">
                <label class="text-xl font-bold">Flashcards</label>
                <label>Signup</label>
                <input type="text" placeholder="Name" inherit={ ... Input.Class } />
                <input type="text" placeholder="Username" inherit={ ... Input.Class } />
                <input type="password" placeholder="Password" inherit={ ... Input.Class } />
                <button onclick="{signup}" inherit={ ... Button.Class }>Signup</button>
                <div>
                    <label class="block text-sm mt-5">Already have an account ?</label>
                </div>
                <button onclick="{login}" inherit={ ... Button.Class }>Login</button>
            </div>
        </>;
    }
    Login() {
        window.location.href = Route.login;
    }
    Signup() {

    }

}

export default Signup;