import {User} from "./user.js";
import {Skills} from "./skills.js";
import {Experiences} from "./experiences.js";
import {CreateUser} from "./createUser.js"

customElements.define("experiences-element", Experiences);
customElements.define("skills-element", Skills);
customElements.define("user-element", User);
customElements.define("createuser-element", CreateUser);