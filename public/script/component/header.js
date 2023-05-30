import Button from "../property/button.js";
import H12 from "./../../library/h12.js";

@Component
class Header extends H12.Component {

    constructor() {
        super();
    }
    init() {

        this.Set("{visible}", "hidden");
        this.Set("{toggle}", this.ShowMenu);

    }
    render() {
        return <>
            <div class="w-full p-4 rounded-md bg-gray-50 border-gray-200 border-2 border-solid shadow-lg">
                <label class="text-sm">Flashcard</label>
                <label class="float-right text-xs mt-1 cursor-pointer font-bold" onclick="{toggle}">MENU</label>
                <div class="flex flex-col mt-4 space-y-1 {visible}">
                    <button props={ ... Button.Alternative } class=" text-left">Home</button>
                    <button props={ ... Button.Alternative } class=" text-left">Search</button>
                    <button props={ ... Button.Alternative } class=" text-left">Profile</button>
                    <button props={ ... Button.Alternative } class=" text-left">Logout</button>
                </div>
            </div>
        </>;
    }
    ShowMenu() {
        this.Set("{visible}", (this.Get("{visible}") == "visible") ? "hidden" : "visible");
    }

}

export default Header;