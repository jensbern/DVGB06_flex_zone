import { baseTemplate, confirmPopup, logged_in } from "./template.js";

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

    a:hover li, .logout:hover {
      background-color: rgb(250,250,250);
      border: 1px solid gray;
      cursor:pointer;
    }

    .hidden{
      display:none;
    }
    `;
    this.shadowRoot.append(STYLE);
    if(sessionStorage.getItem("accessToken")){
      this.refreshAccessToken()
    }
  }

  createDropdownButton = (logged_in_as) => {
    const BUTTON = document.createElement("button");
    BUTTON.innerHTML = logged_in_as? logged_in_as : "Log in | Create account";
    BUTTON.addEventListener("click", () => {
      const UL_dropdown = this.shadowRoot.querySelector("ul");
      UL_dropdown.classList.toggle("hidden");
    });
    this.shadowRoot.append(BUTTON);
  };

  createDropdown = () => {
    const logged_in_as = this.getAttribute("logged_in_as");
    
    const UL_dropdown = document.createElement("ul");
    if (logged_in_as && logged_in_as != "None") {
      var LI_option = document.createElement("li");
      var A_option = document.createElement("a");

      LI_option.innerText = "Edit account";
      A_option.setAttribute(
        "href",
        `/edituser/${this.getAttribute("logged_in_as")}`
      );
      A_option.append(LI_option);
      UL_dropdown.append(A_option);
      UL_dropdown.append(this.addLogoutLI());
    } else {
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
    }
    UL_dropdown.classList.add("hidden");
    this.shadowRoot.append(UL_dropdown);
  };

  addLogoutLI = () => {
    const LI = document.createElement("li");
    LI.classList.add("logout")
    LI.innerText = "Log out";
    LI.addEventListener("click", () => {
      confirmPopup(document.body, "Log out?", (choice) => {
        if (choice) {
          this.logoutAccount();
        }
      });
    });
    return LI;
  }

  logoutAccount = () => {
    sessionStorage.removeItem("accessToken");
    document.cookie =
      "access_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location = "/"
  }

  
  addToolTip = (DOM, text) => {
    const TOOLTIP = document.createElement("div");
    const DOM_rect = DOM.getBoundingClientRect();
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

  refreshAccessToken = () => {
    fetch("/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("refreshToken")
      }
    }).then(resp => {
      return resp.json()
    }).then(data => {
      let d = new Date();
      d.setTime(d.getTime() + 60*60*1000) // set expiration to 1h
      document.cookie = `access_token_cookie=${data.access_token}; expires=${d.toUTCString()}; path=/`;
      sessionStorage.setItem("accessToken", data.access_token)

    })
  }
  connectedCallback() {
    if (
      this.getAttribute("logged_in_as") &&
      this.getAttribute("logged_in_as") != "None"
    ) {
      this.createDropdownButton(this.getAttribute("logged_in_as"));
    } else {
      this.createDropdownButton();
    }
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
