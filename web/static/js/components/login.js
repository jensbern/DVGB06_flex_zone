import { baseTemplate, confirmPopup } from "./template.js";

export class Login extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `

    `;
    this.shadowRoot.append(STYLE);
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
      top: ${DOM_rect.y + DOM_rect.height + 8}px;
      left: ${DOM_rect.x }px;
    `;
    DOM.parentElement.append(TOOLTIP);
    const click_func = (e) => {
      TOOLTIP.remove();
      window.removeEventListener("click", click_func);
    };
    window.addEventListener("click", click_func);
  };

  displayLoginForm = () => {
    const FORM = document.createElement("form");

    const P_username = document.createElement("p");
    const LABEL_username = document.createElement("label");
    LABEL_username.innerText = "Username";
    LABEL_username.setAttribute("for", "username")
    const INPUT_username = document.createElement("input");
    INPUT_username.setAttribute("type", "text");
    INPUT_username.setAttribute("id", "username");
    INPUT_username.setAttribute("name", "username");
    INPUT_username.setAttribute("placeholder", "Username")
    INPUT_username.required = true;
    P_username.append(LABEL_username, INPUT_username, "*")

    FORM.append(P_username);

    const P_password = document.createElement("p");
    const LABEL_password = document.createElement("label");
    LABEL_password.innerText = "Password";
    LABEL_password.setAttribute("for", "password")
    const INPUT_password = document.createElement("input");
    INPUT_password.setAttribute("type", "password");
    INPUT_password.setAttribute("id", "password");
    INPUT_password.setAttribute("name", "password");
    INPUT_password.setAttribute("placeholder", "Password")
    INPUT_password.required = true;
    P_password.append(LABEL_password, INPUT_password, "*")
    FORM.append(P_password)

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", "Login");
    INPUT_submit.addEventListener("click", this.checkInputs); //onSubmit
    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";
    BUTTON_cancel.addEventListener("click", this.handleCancel);
    P_submit.append(BUTTON_cancel, INPUT_submit);
    FORM.append(P_submit);

    this.shadowRoot.append(FORM)
  }

  checkInputs = (e) => {
    var isValid = true;
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll("[required]");
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      this.handleLogin();
    }
  }

  handleLogin = () => {
    const FORM = this.shadowRoot.querySelector("form");
    const formData = new FormData(FORM);
    fetch("/graphql", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation login($username: String!, $password: String!) {
          loginUser(username: $username, password: $password) {
            resp {
              accessToken
              msg
            }
          }
        }`,
        variables: {
          "username": formData.get("username"),
          "password": formData.get("password")
        }
      })
    }).then(resp => {
      return resp.json()
    }).then(data => {
      if(data.data.loginUser.resp.msg){
        this.addToolTip(this.shadowRoot.querySelector('form button'), data.data.loginUser.resp.msg)
      }else {
        // document.cookie = `accessToken=${}`;
        localStorage.setItem("accessToken", data.data.loginUser.resp.accessToken)
        window.location = `/user/${formData.get("username")}`
      }
    })
  }

  handleCancel = (e) => {
    e.preventDefault();
    window.location = "/"
  }

  connectedCallback() {
    this.displayLoginForm()
  }

  disconnectedCallback() {
  }
}
