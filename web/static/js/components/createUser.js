import { baseTemplate, confirmPopup, logged_in } from "./template.js";

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

    p {
      margin: 8px;
    }
    input[type="text"], input[type="password"], input[type="url"], textarea, select{
      padding: 8px;
      width: 90%;
      border: 1px solid darkgrey;
      font-size: 1.1em;
      font-family: Georgia, 'Times New Roman', Times, serif;
      box-sizing: border-box;
      }
    input, button {
      border: 1px solid darkgrey;
      // margin: 8px 0;
      
      padding: 8px;
      font-size: 1.05em;
      background-color: white;
    }
    form button, form input, form select, form textarea {
      margin: 8px;
      padding: 8px;
      font-size: 1.05em;
      background-color: white;
    }
    legend, label{
      margin-left: 8px;
    }
    fieldset {
      display:flex;
      align-items:center;
    }

    a {
      display:block;
      margin-top: 16px;
      font-size: 1.2em;
      color: black;
      text-decoration: none;
    }
    
    .error:focus {
      border: 2px solid red;
      outline-color: red;
      background-color: lightred;
    }

    .update{
      display: grid;
      grid-template-columns: 3fr 2fr;
    }

    @media (max-width: 1010px){
      .update {
        grid-template-columns: 1fr;
      }
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

  displayCreateUser = (user) => {
    const FORM_createUser = document.createElement("form");
    FORM_createUser.setAttribute("id", "update_user");
    const P_name = document.createElement("p");
    const LABEL_name = document.createElement("label");
    LABEL_name.innerText = "Name";
    LABEL_name.setAttribute("for", "user_name");
    LABEL_name.style = "display:block;";
    const INPUT_name = document.createElement("input");
    INPUT_name.setAttribute("type", "text");
    INPUT_name.setAttribute("id", "user_name");
    INPUT_name.setAttribute("name", "name");
    INPUT_name.setAttribute("placeholder", "Name");
    INPUT_name.required = true;
    INPUT_name.value = user ? user.name : "";

    P_name.append(LABEL_name, INPUT_name, "*");
    FORM_createUser.append(P_name);

    const P_usernname = document.createElement("p");
    const LABEL_username = document.createElement("label");
    LABEL_username.innerText = "Username";
    LABEL_username.setAttribute("for", "username");
    LABEL_username.style = "display:block;";
    const INPUT_username = document.createElement("input");
    INPUT_username.setAttribute("type", "text");
    INPUT_username.setAttribute("id", "username");
    INPUT_username.setAttribute("name", "username");
    INPUT_username.setAttribute("placeholder", "Username");
    INPUT_username.required = true;
    INPUT_username.value = user ? user.username : "";

    P_usernname.append(LABEL_username, INPUT_username, "*");
    FORM_createUser.append(P_usernname);

    if (!user) {
      const P_password = document.createElement("p");
      const LABEL_password = document.createElement("label");
      LABEL_password.innerText = "Password";
      LABEL_password.setAttribute("for", "password");
      LABEL_password.style = "display:none;";
      const INPUT_password = document.createElement("input");
      INPUT_password.setAttribute("type", "password");
      INPUT_password.setAttribute("id", "password");
      INPUT_password.setAttribute("name", "password");
      INPUT_password.setAttribute(
        "placeholder",
        user ? "New password" : "Password"
      );
      P_password.append(LABEL_password, INPUT_password, "*");
      FORM_createUser.append(P_password);
    }

    const P_contact = document.createElement("p");
    const FIELDSET = document.createElement("fieldset");
    const LEGEND = document.createElement("legend");
    LEGEND.innerText = "Contact Information";
    FIELDSET.append(LEGEND);

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
    INPUT_contact_address.required = !!!user;
    INPUT_contact_address.value = user ? user.contactInfo : "";

    const LABEL_contact_type = document.createElement("label");
    LABEL_contact_type.innerText = "contact type";
    LABEL_contact_type.setAttribute("for", "contact_type");
    LABEL_contact_type.style = "display:none";
    const SELECT_contact_type = document.createElement("select");
    SELECT_contact_type.setAttribute("type", "text");
    SELECT_contact_type.setAttribute("id", "contact_type");
    SELECT_contact_type.setAttribute("name", "contact_type");
    SELECT_contact_type.required = !!!user;
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
      if (user && options[i].toLowerCase() === user.contactType) {
        OPTION_type.selected = true;
      }
      SELECT_contact_type.append(OPTION_type);
    }
    
    FIELDSET.append(
      LABEL_contact_type,
      SELECT_contact_type,
      LABEL_contact_address,
      INPUT_contact_address,
      "*"
    );
    P_contact.append(FIELDSET);

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

    if(!options.includes(user.contactType) && user != null){
      P_contact_description.style.display = "block";
      TEXTAREA_description.innerText = user.contactType;
      OPTION_type.selected = true; 
    }

    P_contact_description.append(LABEL_description, TEXTAREA_description);
    FORM_createUser.append(P_contact_description);

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", user ? "Update User" : "Create User");
    INPUT_submit.addEventListener("click", (e) => {
      this.handleCreateUser(e, user ? user.uuid : "");
    });
    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";
    BUTTON_cancel.addEventListener("click", this.handleCancel);
    P_submit.append(BUTTON_cancel, INPUT_submit);
    FORM_createUser.append(P_submit);
    this.shadowRoot.querySelector("section").prepend(FORM_createUser);
  };

  displayUpdatePassword = (userid) => {
    const FORM = document.createElement("form");
    FORM.setAttribute("id", "update_password");
    const P_password_old = document.createElement("p");
    const LABEL_password_old = document.createElement("label");
    LABEL_password_old.innerText = "Old password";
    LABEL_password_old.setAttribute("for", "password_old");
    LABEL_password_old.style = "display:none;";
    const INPUT_password_old = document.createElement("input");
    INPUT_password_old.setAttribute("type", "password");
    INPUT_password_old.setAttribute("id", "password_old");
    INPUT_password_old.setAttribute("name", "password_old");
    INPUT_password_old.setAttribute("placeholder", "Old password");
    INPUT_password_old.required = true;
    P_password_old.append(LABEL_password_old, INPUT_password_old, "*");
    FORM.append(P_password_old);

    const P_password = document.createElement("p");
    const LABEL_password = document.createElement("label");
    LABEL_password.innerText = "Password";
    LABEL_password.setAttribute("for", "password");
    LABEL_password.style = "display:none;";
    const INPUT_password = document.createElement("input");
    INPUT_password.setAttribute("type", "password");
    INPUT_password.setAttribute("id", "password");
    INPUT_password.setAttribute("name", "password");
    INPUT_password.setAttribute("placeholder", "New password");
    INPUT_password.required = true;
    P_password.append(LABEL_password, INPUT_password, "*");
    FORM.append(P_password);

    const P_password_confirm = document.createElement("p");
    const LABEL_password_confirm = document.createElement("label");
    LABEL_password_confirm.innerText = "Confirm password";
    LABEL_password_confirm.setAttribute("for", "password_confirm");
    LABEL_password_confirm.style = "display:none;";
    const INPUT_password_confirm = document.createElement("input");
    INPUT_password_confirm.setAttribute("type", "password");
    INPUT_password_confirm.setAttribute("id", "password_confirm");
    INPUT_password_confirm.setAttribute("name", "password_confirm");
    INPUT_password_confirm.setAttribute(
      "placeholder",
      "Confirm new password (enter new password again)"
    );
    INPUT_password_confirm.required = true;

    P_password_confirm.append(
      LABEL_password_confirm,
      INPUT_password_confirm,
      "*"
    );
    FORM.append(P_password_confirm);

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", "Update Password");
    INPUT_submit.addEventListener("click", (e) => {
      this.handleUpdatePassword(e, userid);
    });
    const SPAN_message = document.createElement("span");
    SPAN_message.setAttribute("id", "password_update_message");
    P_submit.append(INPUT_submit, SPAN_message);
    FORM.append(P_submit);
    this.shadowRoot.querySelector("section").append(FORM);
  };

  handleCancel = (e) => {
    e.preventDefault();
    const username = this.getAttribute("username");
    if (username) {
      window.location = `/user/${username}`;
    } else {
      window.location = "/";
    }
  };

  handleCreateUser = (e, userid) => {
    var isValid = true;
    const username = this.getAttribute("username");
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll(
      "#update_user [required]"
    );
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      if (username) {
        this.updateStaff(userid);
      } else {
        this.handleSubmit();
      }
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
      top: ${DOM_rect.y}px;
      left: ${DOM_rect.x + DOM_rect.width + 32}px;
    `;
    DOM.parentElement.append(TOOLTIP);
    const keyup_func = (e) => {
      TOOLTIP.remove();
      DOM.removeEventListener("keyup", keyup_func);
    };
    DOM.addEventListener("keyup", keyup_func);
  };

  handleSubmit = () => {
    const FORM = this.shadowRoot.querySelector("#update_user");
    const INPUT_username = this.shadowRoot.querySelector("#username");
    INPUT_username.classList.remove("error");
    console.log(formData.get("contact_type"), formData.get("contact_type") === "other")
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
              tokens{
                accessToken
                refreshToken
              }
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
          contact_type:
            formData.get("contact_type") === "other"
              ? formData.get("contact_description")
              : formData.get("contact_type"),
        },
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Username already exists");
        }
      })
      .then((data) => {
        if (data.errors) {
          // TODO: Lägg till feedback till användare

          INPUT_username.classList.add("error");
          INPUT_username.focus();
          this.addToolTip(INPUT_username, "Username already taken");
        } else {
          window.sessionStorage.setItem(
            "accessToken",
            data.data.createStaff.tokens.accessToken
          );
          window.localStorage.setItem(
            "refreshToken",
            data.data.createStaff.tokens.refreshToken
          );
          let d = new Date();
          d.setTime(d.getTime() + 60 * 60 * 1000); // set expiration to 1h
          document.cookie = `access_token_cookie=${
            data.data.createStaff.tokens.accessToken
          }; expires=${d.toUTCString()}; path=/`;
          window.location = `/user/${data.data.createStaff.staff.username}`;
        }
      });
  };

  updateStaff = () => {
    const FORM = this.shadowRoot.querySelector("#update_user");
    const INPUT_username = this.shadowRoot.querySelector("#username");
    const username = this.getAttribute("username");
    const formData = new FormData(FORM);
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
          mutation UpdateStaff($current_username: String!, $name: String, $new_username: String, $contact_info: String, $contact_type: String) {
            updateStaff(currentUsername: $current_username, newUsername: $new_username, name: $name, contactInfo: $contact_info, contactType: $contact_type) {
              ok
              staff {
                username
              }
            }
          }
        `,
        variables: {
          current_username: username,
          name: formData.get("name"),
          new_username: formData.get("username"),
          contact_info: formData.get("contact_address"),
          contact_type:
            formData.get("contact_type") === "other"
              ? formData.get("contact_description")
              : formData.get("contact_type"),
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.errors) {
          // TODO: Lägg till feedback till användare

          INPUT_username.classList.add("error");
          INPUT_username.focus();
          this.addToolTip(INPUT_username, "Username already taken");
        } else {
          window.location = `/edituser/${data.data.updateStaff.staff.username}`;
        }
      });
  };

  handleUpdatePassword = (e, userid) => {
    var isValid = true;
    const username = this.getAttribute("username");
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll(
      "#update_password [required]"
    );
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      console.log(e);
      e.preventDefault();
      if (username) {
        this.updatePassword(userid);
      } else {
        this.handleSubmit();
      }
    }
  };

  updatePassword = (userid) => {
    const FORM = this.shadowRoot.querySelector("#update_password");
    const formData = new FormData(FORM);
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
          mutation UpdatePassword($staff_id: ID!, $old_password: String!, $confirm_password: String!, $new_password: String!) {
            updatePassword(staffUuid: $staff_id, oldPassword: $old_password, confirmPassword: $confirm_password, newPassword: $new_password) {
              ok
            }
          }
        `,
        variables: {
          staff_id: userid,
          old_password: formData.get("password_old"),
          confirm_password: formData.get("password_confirm"),
          new_password: formData.get("password"),
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.data.updatePassword.ok) {
          this.shadowRoot.querySelector("#password_update_message").innerText =
            "Password update succesful!";
          const FORM_password_inputs = this.shadowRoot.querySelectorAll(
            "#update_password input"
          );
          for (let i = 0; i < FORM_password_inputs.length - 1; i++) {
            FORM_password_inputs[i].value = "";
          }
        } else {
          this.shadowRoot.querySelector("#password_update_message").innerText =
            "Password information is not valid";
        }
      });
  };

  getUserData = (username, callback) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query ($username:String)
          {
            staff(username: $username) {
              name
              uuid
              username
              contactInfo
              contactType
            }
          }
        `,
        variables: {
          username: username,
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        callback(data);
      });
  };

  addDeleteAccountLI = (username) => {
    const BUTTON = document.createElement("button");
    BUTTON.classList.add("delete");
    BUTTON.innerText = "Delete Account";
    BUTTON.addEventListener("click", () => {
      confirmPopup(document.body, "Delete account?", (choice) => {
        if (choice) {
          this.deleteAccount(username);
        }
      });
    });
    return BUTTON;
  };

  deleteAccount = (username) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
        mutation DeleteStaff($username:String!){
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
          console.log("Error while deleting");
        } else {
          window.sessionStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
          document.cookie =
            "access_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location = `/`;
        }
      });
  };

  connectedCallback() {
    const username = this.getAttribute("username");
    const SECTION = document.createElement("section");
    this.shadowRoot.append(SECTION);
    if (username) {
      SECTION.classList.add("update");
      this.getUserData(username, (data) => {
        this.shadowRoot.style = "";
        this.displayCreateUser(data.data.staff[0]);
        this.displayUpdatePassword(data.data.staff[0].uuid);
      });
    } else {
      this.displayCreateUser();
    }
    if (logged_in(this)) {
      const BUTTON_delete = this.addDeleteAccountLI(username);
      this.shadowRoot.append(BUTTON_delete);
      const A = document.createElement("a");
      A.href = "/user/" + username;
      A.innerText = " 👈 Back to userpage";
      this.shadowRoot.append(A);
    } else {
      const A = document.createElement("a");
      A.href = "/";
      A.innerText = "👈 Back to startpage";
      this.shadowRoot.append(A);
    }
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#contact_type")
      .removeEventListener("change");
  }
}
