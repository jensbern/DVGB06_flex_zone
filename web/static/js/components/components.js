import {User} from "./user.js";
import {Skills} from "./skills.js";
import {Experiences} from "./experiences.js";
import {CreateUser} from "./createUser.js";
import {HeaderLogin} from "./headerLogin.js";
import {Login} from "./login.js";
import {Search} from "./search.js";
import {Reference} from "./reference.js";
import {Footer} from "./footer.js";
import {Interest} from "./interest.js";
import {Requests} from "./requests.js"

customElements.define("experiences-element", Experiences);
customElements.define("skills-element", Skills);
customElements.define("user-element", User);
customElements.define("createuser-element", CreateUser);
customElements.define("headerlogin-element", HeaderLogin);
customElements.define("login-element", Login);
customElements.define("search-element", Search);
customElements.define("reference-element", Reference);
customElements.define("footer-element", Footer);
customElements.define("interest-element", Interest);
customElements.define("requests-element", Requests);