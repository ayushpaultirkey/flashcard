import H12 from "../../library/h12.js";
import Card from "./post/card.js";
import Create from "./post/create.js";

@Component
class Post extends H12.Component {

    constructor() {
        super();
    }
    async init(args = {}) {

    }
    async render() {
        return <>
            <div class="space-y-3">

                <Create args />

                <div class="space-y-3">
                    <Card args={{ name: "ayus", time: "15:00 PM", like: 0, content: "hello world" }} />
                    <Card args={{ name: "ayus", time: "15:00 PM", like: 0, content: "hello world" }} />
                    <Card args={{ name: "ayus", time: "15:00 PM", like: 0, content: "hello world" }} />
                </div>

            </div>
        </>;
    }
}

export default Post;