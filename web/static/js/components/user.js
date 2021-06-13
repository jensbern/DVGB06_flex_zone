import { baseTemplate } from "./template.js";

export class User extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: "open"})
    shadowRoot.append(baseTemplate.content.cloneNode(true));

    const username = this.getAttribute("username");
    const userid = this.getAttribute("userid");

    

    const H3_username = document.createElement("h3");
    H3_username.innerText = username;
    shadowRoot.append(H3_username);

    const H3_contactInfo = document.createElement("h3");
    H3_contactInfo.innerText = userid;
    shadowRoot.append(H3_contactInfo);
  }

  connectedCallback() {

  }

  disconnectedCallback() {

  }
}