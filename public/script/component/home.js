import H12 from "./../../library/h12.js";
import Create from "./post/create.js";
import Header from "./header.js";
import Post from "./post.js";
import Footer from "./footer.js";

@Component
class Home extends H12.Component {

    constructor() {
        super();
    }
    init() {



    }
    async render() {
        return <>
            <div class="w-full space-y-2">
                <Header args />
                <Create args />
                <div class="space-y-2">
                    <Post args />
                    <Post args />
                    <Post args />
                </div>
            </div>
        </>;
    }

}

export default Home;