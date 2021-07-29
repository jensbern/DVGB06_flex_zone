import { baseTemplate, confirmPopup } from "./template.js";

export class Footer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
     section {
       position:fixed;
       bottom: 0;
       background-color: #f7f7f799;
       width: 100%;
       padding: 48px 64px;
       font-size: 1.2em;
       display:flex;
       align-items: center;
       flex-direction: row-reverse;
       justify-content: flex-end;
       border-top: 1px solid lightgray;
     }
     button {
       font-size: 1.1em;
       font-family: inherit;
       padding: 8px;
       margin-left: 16px;
     }

     button:hover + p .right{
      transform:rotate(-40deg) translateY(-6px) scale(-1.2, 1.2);
     }
     button:hover + p .left{
      transform: rotate(40deg) translateY(-6px) scale(1.2);
     }
     .right{
      display: inline-block;
      transform: scale(-1, 1);
      transition: transform 100ms ease-in-out;

     }
     .left{
        display: inline-block;
        transition: transform 80ms ease-in-out;

     }
    `;
    this.shadowRoot.append(STYLE);
  }

  displayCookieInfo = () => {
    const SECTION = document.createElement("section");

    const P = document.createElement("p");
    P.innerHTML =
      "This site uses only functional cookies <span class='left'>💪</span>🍪<span class='right'>💪</span>";
    const BUTTON = document.createElement("button");
    BUTTON.innerText = "I understand";
    BUTTON.addEventListener("click", () => {
      this.okClick(BUTTON);
    });
    SECTION.append(BUTTON, P);
    this.shadowRoot.append(SECTION);
  };

  okClick = (BUTTON_ok) => {
    sessionStorage.setItem("cookie_ok", true);
    BUTTON_ok.removeEventListener("click", this.okClick);
    this.shadowRoot.querySelector("section").remove();
  };

  connectedCallback() {
    if (!sessionStorage.getItem("cookie_ok")) this.displayCookieInfo();
  }

  disconnectedCallback() {
  }
}
