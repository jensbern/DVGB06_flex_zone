import { baseTemplate } from "./template.js";

export class CreateUser extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
    form {
      margin: 8px;
      padding: 8px;
      background-color: rgb(252, 252, 252);
      border: 1px solid lightgrey;
    }
    input[type="text"], input[type="password"], input[type="url"], textarea, select{
      width: 90%;
      margin: 8px;
      padding: 8px;
      border: 1px solid darkgrey;
      font-size: 1.1em;
      font-family: Georgia, 'Times New Roman', Times, serif;
      }
    input, button {
      border: 1px solid darkgrey;
      margin: 8px 0;
      
      padding: 8px;
      font-size: 1.05em;
      background-color: white;
    }
    form button, form input {
      margin: 8px;
      padding: 8px;
      font-size: 1.05em;
      background-color: white;
    }
    #contact_address {
      width: 60%;
    }
    #contact_type {
      width: 30%;
    }
    `;
    this.shadowRoot.append(STYLE);
  }

  displayCreateUser = () => {
    const FORM_createUser = document.createElement("form");
    const P_name = document.createElement("p");
    const LABEL_name = document.createElement("label");
    LABEL_name.innerText = "Name";
    LABEL_name.setAttribute("for", "user_name");
    LABEL_name.style = "display:none;";
    const INPUT_name = document.createElement("input");
    INPUT_name.setAttribute("type", "text");
    INPUT_name.setAttribute("id", "user_name");
    INPUT_name.setAttribute("name", "name");
    INPUT_name.setAttribute("placeholder", "Name");
    INPUT_name.required = true;
    P_name.append(LABEL_name, INPUT_name, "*");
    FORM_createUser.append(P_name);

    const P_usernname = document.createElement("p");
    const LABEL_username = document.createElement("label");
    LABEL_username.innerText = "Username";
    LABEL_username.setAttribute("for", "username");
    LABEL_username.style = "display:none;";
    const INPUT_username = document.createElement("input");
    INPUT_username.setAttribute("type", "text");
    INPUT_username.setAttribute("id", "username");
    INPUT_username.setAttribute("name", "username");
    INPUT_username.setAttribute("placeholder", "Username");
    INPUT_username.required = true;
    P_usernname.append(LABEL_username, INPUT_username, "*");
    FORM_createUser.append(P_usernname);

    const P_password = document.createElement("p");
    const LABEL_password = document.createElement("label");
    LABEL_password.innerText = "Password";
    LABEL_password.setAttribute("for", "password");
    LABEL_password.style = "display:none;";
    const INPUT_password = document.createElement("input");
    INPUT_password.setAttribute("type", "password");
    INPUT_password.setAttribute("id", "password");
    INPUT_password.setAttribute("name", "password");
    INPUT_password.setAttribute("placeholder", "Password");
    INPUT_password.required = true;
    P_password.append(LABEL_password, INPUT_password, "*");
    FORM_createUser.append(P_password);

    const P_contact = document.createElement("p");
    const LABEL_contact_address = document.createElement("label");
    LABEL_contact_address.innerText = "contact address";
    LABEL_contact_address.setAttribute("for", "contact_address");
    LABEL_contact_address.style = "display:none";
    const INPUT_contact_address = document.createElement("input");
    INPUT_contact_address.setAttribute("type", "text");
    INPUT_contact_address.setAttribute("id", "contact_address");
    INPUT_contact_address.setAttribute("name", "contact_address");
    INPUT_contact_address.setAttribute(
      "placeholder",
      "Contact address (email, discord, phone ...)"
    );
    INPUT_contact_address.required = true;

    const LABEL_contact_type = document.createElement("label");
    LABEL_contact_type.innerText = "contact type";
    LABEL_contact_type.setAttribute("for", "contact_type");
    LABEL_contact_type.style = "display:none";
    const SELECT_contact_type = document.createElement("select");
    SELECT_contact_type.setAttribute("type", "text");
    SELECT_contact_type.setAttribute("id", "contact_type");
    SELECT_contact_type.setAttribute("name", "contact_type");
    SELECT_contact_type.required = true;
    SELECT_contact_type.addEventListener(
      "change",
      this.handleContactTypeChange
    );
    var OPTION_type = document.createElement("option");
    OPTION_type.innerText = "Select contact type";
    OPTION_type.setAttribute("value", "");
    SELECT_contact_type.append(OPTION_type);
    const options = ["Discord", "Email", "Phone", "Twitter", "Other"];
    for (let i = 0; i < options.length; i++) {
      var OPTION_type = document.createElement("option");
      OPTION_type.innerText = options[i];
      OPTION_type.setAttribute("value", options[i].toLowerCase());
      SELECT_contact_type.append(OPTION_type);
    }
    P_contact.append(
      LABEL_contact_type,
      SELECT_contact_type,
      "*",
      LABEL_contact_address,
      INPUT_contact_address,
      "*"
    );

    FORM_createUser.append(P_contact);

    const P_contact_description = document.createElement("p");
    P_contact_description.setAttribute("id", "contact_description_container");
    P_contact_description.style.display = "none";
    const LABEL_description = document.createElement("label");
    LABEL_description.innerText = "Description";
    LABEL_description.setAttribute("for", "contact_description");
    LABEL_description.style = "display:none;";
    const TEXTAREA_description = document.createElement("textarea");
    TEXTAREA_description.style = "resize: none;";
    TEXTAREA_description.setAttribute("id", "contact_description");
    TEXTAREA_description.setAttribute("name", "contact_description");
    TEXTAREA_description.setAttribute("placeholder", "Contact description ...");
    P_contact_description.append(LABEL_description, TEXTAREA_description);
    FORM_createUser.append(P_contact_description);

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", "Create User");
    INPUT_submit.addEventListener("click", this.handleCreateUser);
    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";
    BUTTON_cancel.addEventListener("click", this.handleCancel);
    P_submit.append(BUTTON_cancel, INPUT_submit);
    FORM_createUser.append(P_submit);
    this.shadowRoot.prepend(FORM_createUser);
  };

  handleCancel = (e) => {
    e.preventDefault();
    console.log("TODO: Go back to start-page");
  };

  handleCreateUser = (e) => {
    var isValid = true;
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll("[required]");
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  handleContactTypeChange = (e) => {
    const INPUT_contact_address =
      this.shadowRoot.querySelector("#contact_address");
    const P_contact_description = this.shadowRoot.querySelector(
      "#contact_description_container"
    );
    switch (e.target.value) {
      case "email":
        INPUT_contact_address.setAttribute("type", "email");
        P_contact_description.style.display = "none";
        break;

      case "phone":
        INPUT_contact_address.setAttribute("type", "tel");
        P_contact_description.style.display = "none";
        break;

      case "other":
        INPUT_contact_address.setAttribute("type", "text");
        P_contact_description.style.display = "block";
        break;

      default:
        INPUT_contact_address.setAttribute("type", "text");
        P_contact_description.style.display = "none";
        break;
    }
  };

  handleSubmit = () => {
    // console.log("TODO: Create Experience");
    const FORM = this.shadowRoot.querySelector("form");
    var formData = new FormData(FORM);
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation CreateStaff($contact_info: String, $contact_type: String, $password: String, $username: String, $name: String) {
            createStaff(contactInfo: $contact_info, contactType: $contact_type, password: $password, username: $username, name: $name) {
              ok
              staff {
                username
              }
            }
          }
          `,
        variables: {
          username: formData.get("username"),
          name: formData.get("name"),
          password: formData.get("password"),
          contact_info: formData.get("contact_address"),
          contact_type: formData.get("contact_type"),
        },
      }),
    })
      .then((response) => {
        if (response.ok){
        return response.json();
        } else{
          throw new Error("Username already exists")
        }
      })
      .then((data) => {
        console.log(data);
        if(data.errors){
          // TODO: Lägg till feedback till användare
          console.log("Username already exists");
        }
        window.location = `/user/${data.data.createStaff.staff.username}`;
      });
  }

  connectedCallback() {
    this.displayCreateUser();
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#contact_type")
      .removeEventListener("change");
  }
}
