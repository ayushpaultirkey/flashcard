import H12 from "./../library/h12.js";
import Router from "./router.js";

@Component
class App extends H12.Component {

    constructor() {
        super();
    }
    async init() {

        this.Set("{app}", await Router());

    }
    render() {
        return <>
            <div class="w-full max-w-sm">
                {app}
            </div>
        </>;
    }

}

H12.Component.Render(<App args />, ".app");