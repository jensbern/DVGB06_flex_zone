import {User} from "./user.js";
import {Skills} from "./skills.js";
import {Experiences} from "./experiences.js";
import {CreateUser} from "./createUser.js"
import {HeaderLogin} from "./headerLogin.js"

customElements.define("experiences-element", Experiences);
customElements.define("skills-element", Skills);
customElements.define("user-element", User);
customElements.define("createuser-element", CreateUser);
customElements.define("headerlogin-element", HeaderLogin);