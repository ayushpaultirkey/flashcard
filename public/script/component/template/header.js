import Component from "../../../library/h12.js";

@Component
class Header extends Component {

    constructor() {
        super();
    }
    async init(args = {}) {
        
        this.Set("{c-hidden}", "hidden");
        this.Set("{e-hidden}", this.Menu);
        this.Set("{user.logout}", this.Logout);

    }
    render() {
        return <>
            <div>
                <div class="flex items-center">
                    <a class="sm:text-xl" href="#home">flashcard</a>
                    <span class="w-full"></span>
                    <button onclick="{e-hidden}" class="fa fa-bars text-xl transition-colors hover:text-blue-500"></button>
                </div>
                <div class="flex flex-col text-sm space-y-2 my-3 font-semibold underline {c-hidden}">
                    <a href="#home">Home</a>
                    <a href="#search">Search</a>
                    <a href="#user">Profile</a>
                    <label onclick="{user.logout}">Logout</label>
                </div>
            </div>
        </>;
    }
    Menu() {

        this.Set("{c-hidden}", (this.Get("{c-hidden}") == "hidden") ? "visible" : "hidden");

    }
    async Logout() {

        const _response = await fetch("/api/logout");
        const _data = await _response.json();

        if(_data.redirect.length > 0) {
            window.location.hash = _data.redirect;
        };

    }
}

export default Header;