import { baseTemplate, confirmPopup } from "./template.js";

export class Login extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
      article {
        border: 1px solid darkgrey;
        padding: 16px;
        margin-bottom: 8px;
        background-color: #fff;
        position:relative;
      }
      h3 {
        padding-top: 8px;
        font-size: 1.4em;
      }
      p{
        padding: 8px 0;
        font-size: 1.2em;
      }
      a {
        font-size: 1.1em;
      }
      form {
        margin: 8px;
        padding: 8px;
        background-color: rgb(252, 252, 252);
        border: 1px solid lightgrey;
      }
      input[type="text"], input[type="password"]{
        
        margin: 8px;
        padding: 8px;
        border: 1px solid darkgrey;
        font-size: 1.1em;
        font-family: Georgia, 'Times New Roman', Times, serif;
        }
        
      form button, form input[type="submit"] {
        margin: 8px;
        padding: 8px;
        font-size: 1.05em;
        background-color: white;
        cursor: pointer;
        border: 1px solid darkgrey;
      }
      form button:hover, form input[type="submit"]:hover{
        background-color: rgb(250,250,250);
        box-shadow:  3px 3px 2px rgb(240,240,240);

      }
      label{
        margin: 8px;
        margin-right: 0px;
        padding: 8px;
      }
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation login($username: String!, $password: String!) {
          loginUser(username: $username, password: $password) {
            tokens {
              accessToken
              refreshToken
            }
            msg
          }
        }`,
        variables: {
          username: formData.get("username"),
          password: formData.get("password"),
        },
      }),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        if (data.data.loginUser.msg) {
          this.addToolTip(
            this.shadowRoot.querySelector("form button"),
            data.data.loginUser.msg
          );
        } else {
          // document.cookie = `accessToken=${}`;
          window.sessionStorage.setItem(
            "accessToken",
            data.data.loginUser.tokens.accessToken
          );
          window.localStorage.setItem(
            "refreshToken",
            data.data.loginUser.tokens.refreshToken
          );
          let d = new Date();
          d.setTime(d.getTime() + 60 * 60 * 1000); // set expiration to 1h
          document.cookie = `access_token_cookie=${
            data.data.loginUser.tokens.accessToken
          }; expires=${d.toUTCString()}; path=/`;
          window.location = `/user/${formData.get("username")}`;
        }
      });
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
