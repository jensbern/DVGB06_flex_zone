import { baseTemplate, confirmPopup } from "./template.js";

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

    .delete{
      margin-top:24px;
      background-color: #fcc4c4;
      cursor:pointer;
    }
    .delete:hover{
      border: 1px solid #fd6b6b;
      background-color: #ffa4a4;
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
    const username = this.getAttribute("username");
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

    UL_dropdown.append(this.addDeleteAccountLI(username));
    UL_dropdown.classList.add("hidden");
    this.shadowRoot.append(UL_dropdown);
  };

  addDeleteAccountLI = (username) => {
    const LI = document.createElement("li");
    LI.classList.add("delete");
    LI.innerText = "Delete Account";
    LI.addEventListener("click", () => {
      confirmPopup(document.body, "Delete account?", (choice) => {
        if (choice) {
          this.deleteAccount(username);
        }
      });
    });
    return LI;
  };

  deleteAccount = (username) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation DeleteStaff($username:String){
          deleteStaff(username:$username){ok}
        }
        `,
        variables: {
          username: username,
        },
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error while deleting User");
        }
      })
      .then((data) => {
        console.log(data);
        if (data.errors) {
          this.addToolTip(
            document.body.querySelector("headerlogin-element"),
            "Error while deleting user"
          );
          console.log("Error while deleting");
        } else {
          window.location = `/`;
        }
      });
  };

  addToolTip = (DOM, text) => {
    const TOOLTIP = document.createElement("div");
    const DOM_rect = DOM.getBoundingClientRect();
    console.log(DOM_rect, DOM_rect.x, DOM_rect.y);
    TOOLTIP.innerText = text;
    TOOLTIP.style = `
      background-color: #fd6b6b;
      display: inline-block;
      border: 1px solid red;
      position: absolute;
      padding: 8px;
      top: ${DOM_rect.y + 16}px;
      left: ${DOM_rect.x - 128}px;
    `;
    DOM.parentElement.append(TOOLTIP);
    const keyup_func = (e) => {
      TOOLTIP.remove();
      DOM.removeEventListener("keyup", keyup_func);
    };
    DOM.addEventListener("keyup", keyup_func);
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
