import { baseTemplate } from "./template.js";

export class Experiences extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: "open"})
    shadowRoot.append(baseTemplate.content.cloneNode(true));
    // const username = this.getAttribute("username");
    // const userid = this.getAttribute("userid")
    // console.log(username, userid);
    // shadowRoot.innerHTML = username + " " + userid
  }
  
  connectedCallback() {

  }

  disconnectedCallback() {

  }
}