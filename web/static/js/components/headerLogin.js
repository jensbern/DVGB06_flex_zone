import { baseTemplate } from "./template.js";

export class HeaderLogin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `

    button{
      margin: 8px;
      padding: 8px 16px;
      font-family: Georgia, "Times New Roman", Times, serif;
      font-size: 1.2em;
      justify-self: right;
    }
    
    ul {
      background-color: rgb(250,250,250);
      padding: 8px;
      position: absolute;
      border: 1px solid gray;
      width: 350px;
      margin: 8px;
      margin-top: 72px;
    }
    
    li{
      font-size: 1.1em;
      background-color: rgb(254,254,254);
      padding: 8px;
      margin: 8px;
      border: 1px solid lightgray;
    }
    
    a{
      color: inherit;
      text-decoration:none;
    }

    a:hover li {
      background-color: rgb(250,250,250);
      border: 1px solid gray;
    }

    .hidden{
      display:none;
    }
    `;
    this.shadowRoot.append(STYLE);
  }

  createDropdownButton = () => {
    const BUTTON = document.createElement("button");
    BUTTON.innerHTML = "Log in | Create account";
    BUTTON.addEventListener("click", () => {
      const UL_dropdown = this.shadowRoot.querySelector("ul");
      UL_dropdown.classList.toggle("hidden");
    });
    this.shadowRoot.append(BUTTON);
  };

  createDropdown = () => {
    const UL_dropdown = document.createElement("ul");
    const options = ["Login", "Create account"];
    const links = ["/login", "/createuser"];
    for (let i = 0; i < options.length; i++) {
      var LI_option = document.createElement("li");
      var A_option = document.createElement("a");

      LI_option.innerText = options[i];
      A_option.setAttribute("href", links[i]);
      A_option.append(LI_option);
      UL_dropdown.append(A_option);
    }
    UL_dropdown.classList.add("hidden");
    this.shadowRoot.append(UL_dropdown);
  };

  connectedCallback() {
    this.createDropdownButton();
    this.createDropdown();
    const UL_dropdown = this.shadowRoot.querySelector("ul");
    const BUTTON_dropdown = this.shadowRoot.querySelector("button");
    this.dropdownEvent = window.addEventListener("click", (e) => {
      if (!(e.path.includes(UL_dropdown) || e.path.includes(BUTTON_dropdown))) {
        UL_dropdown.classList.add("hidden");
      }
    });
  }

  disconnectedCallback() {
    window.removeEventListener("click", this.dropdownEvent);
  }
}
