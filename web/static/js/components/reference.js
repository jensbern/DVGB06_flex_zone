import { baseTemplate, confirmPopup, logged_in } from "./template.js";

export class Reference extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
    
      h4{
        font-size: 1.25em;
        padding-top: 8px;
      }
      ul {
        list-style-type: disc;
      }
      ul li {
        margin-left: 24px;
        padding-top: 8px;
      }
      ul li a{
        color: inherit;
        cursor:pointer;
        text-decoration:none;
      }
      li span{
        margin-left: 16px;
        cursor:pointer;
      }

      form p{
        margin-left: 24px;
      }
      input, select, button {
        border: 1px solid darkgrey;
        margin: 8px 0;
        margin-right: 8px;
        padding: 8px;
        font-size: 0.9em;
        background-color: white;
      }

      .suggested_users{
        background-color: white;
        border: 1px solid black;
      }

      .suggested_users p {
        margin: 8px;
        padding: 8px;
        cursor: pointer;
      }

      .suggested_users p:hover{
        background-color: rgb(250, 250, 250);
      }

      input + .suggested_users, button+.suggested_users{
        display:none;
      }

      .user:focus + .suggested_users, .suggested_users:hover{
        display:block;
      }

      .edit{
        background-color: lightgray;
        border-radius: 8px;
        padding: 0 8px;
        transition: box-shadow 50ms ease-in-out;
      }

      .edit:hover, .delete:hover {
        box-shadow: 3px 3px 3px gray;
      }

      .delete{
        background-color: lightgray;
        transition: box-shadow 50ms ease-in-out;
        border: 1px solid black;
        border-radius: 8px;
        padding: 0 8px;
      }

      .hidden {
        display:none;
      }

      .consent_yes{
        color: darkgreen;
        background-color: lightgreen;
        border: 1px solid darkgreen;
        border-radius: 50%;
        padding: 2px 5px 2px 5px;
      }
      .consent_no{
        color: darkred;
        background-color: rgb(255, 216, 216);
        border: 1px solid darkred;
        border-radius: 50%;
        padding: 2px 5px 2px 5px;
      }
      .consent_not_answered {
        background-color: lightgray;
        border: 1px solid darkgray;
        border-radius: 50%;
        padding: 2px 7px 2px 7px;
      }
    `;
    this.shadowRoot.append(STYLE);

    this.suggested_users = [];
  }

  createConsentSPAN = (consent, name) => {
    const SPAN = document.createElement("span")
    if(consent === true){
      SPAN.innerText = "✓"
      SPAN.className = "consent_yes";
      SPAN.setAttribute("title", name + " has approved this reference")
    }else if (consent === false){
      SPAN.innerText = "X"
      SPAN.className = "consent_no";
      SPAN.setAttribute("title", name + " has not approved this reference")
    }else{
      SPAN.innerText = "?"
      SPAN.className = "consent_not_answered";
      SPAN.setAttribute("title", name + " has not answered this reference request")

    }
    return SPAN
  }

  displayReferences = (data) => {
    const REFERENCES = document.createElement("ul");
    REFERENCES.setAttribute(
      "id",
      `reference${this.getAttribute("for_type")}${this.getAttribute("for_id")}`
    );
    
    for (let i = 0; i < data.length; i++) {
      if (!this.getAttribute("edit")) {
        var LI = this.displayReferenceLI(data[i]);
      } else {
        var LI = this.editReferenceLI(data[i]);
      }

      REFERENCES.append(LI);
    }
    this.shadowRoot.append(REFERENCES);
    if (logged_in(this)) {
      this.addReferenceButton(
        this.getAttribute("for_type"),
        this.getAttribute("for_id")
      );
    }else {
      if(!data.length) {
        var LI = document.createElement("li")
        LI.innerText = "No references added yet"
        REFERENCES.append(LI);
      }
    }
  };

  displayReferenceLI = (data) => {
    var LI = document.createElement("li");
    LI.setAttribute("id", `reference${data.uuid}`);
    if(!logged_in(this)){
      var A = document.createElement("a");
      switch (data.refType) {
        case "user":
          A.href = `/user/${data.link}`;
          A.innerText = `User: ${data.link}`;
          break;
        case "phone":
          A.target = "_blank";
          A.href = "tel:" + data.link;
          A.innerText = `Phone: ${data.link}`;
          A.type = "tel";
          break;
        case "email":
          A.href = "mailto:" + data.link;
          A.innerText = `email: ${data.link}`;
          A.target = "_blank";
          A.type = "email";
          break;
        default:
          A.href = data.link;
          A.target = "_blank";
          A.innerText = "External link";
          A.title = data.link;
          break;
      }
      LI.append(A);
    }
    
    const SPAN_settings = document.createElement("span");
    SPAN_settings.classList.add("hidden");
    
    const SPAN_edit = document.createElement("span");
    SPAN_edit.addEventListener("click", (e) => {
      this.displayEditReference(e, data);
    });
    SPAN_edit.innerText = "Edit";
    SPAN_edit.className = "edit";

    const SPAN_delete = document.createElement("span");
    SPAN_delete.innerText = "Delete";
    SPAN_delete.className = "delete";

    SPAN_delete.addEventListener("click", (e) => {
      confirmPopup(document.body, "Delete Reference?", (choice) => {
        if (choice) {
          this.deleteReference(data.uuid);
        }
      });
    });

    const click_event_hide = (e) => {
      if(!e.composedPath().includes(SPAN_settings)){
        SPAN_settings.classList.add("hidden")
        window.removeEventListener("mousedown", click_event_hide)
      }
    }
    const click_event_show = (e) => {
      window.addEventListener("mousedown", click_event_hide)
      SPAN_settings.classList.remove("hidden")
    }
    
    if (logged_in(this)) {
      const SPAN = document.createElement("span");
      SPAN.addEventListener("mouseup", click_event_show)
      SPAN.innerText = data.link;
      SPAN_settings.append(SPAN_edit, SPAN_delete);
      LI.append(SPAN, SPAN_settings)
    }
    if(data.refType === "user"){
      const SPAN = this.createConsentSPAN(data.consent, data.link)
      LI.append(SPAN)
    }
    return LI;
  };

  displayEditReference = (e, reference) => {
    const LI_display = this.shadowRoot.querySelector(
      `#reference${reference.uuid}`
    );
    const LI_edit = this.editReferenceLI(reference);
    LI_display.style = "display:none;";
    this.shadowRoot.querySelector("ul").insertBefore(LI_edit, LI_display);
  };

  editReferenceLI = (data) => {
    const LI = document.createElement("li");
    LI.id = "edit" + data.uuid;
    const FORM = document.createElement("form");
    FORM.id = "edit_reference" + data.uuid;
    const SELECT_type = document.createElement("select");
    SELECT_type.required = true;

    const keyupEvent = () => {
      this.suggestUsersEvent(INPUT_link);
    };

    SELECT_type.setAttribute("id", "reference_type" + data.uuid);
    SELECT_type.setAttribute("name", "reference_type" + data.uuid);
    const options = ["user", "phone", "email", "external link"];

    for (let i = 0; i < options.length; i++) {
      var OPTION_type = document.createElement("option");
      if (options[i]=== data.refType) {
        OPTION_type.selected = true;
      }
      OPTION_type.innerText = options[i];
      OPTION_type.setAttribute("value", options[i]);
      // if (type == options[i].toLowerCase()) {
      //   OPTION_type.selected = true;
      // }
      SELECT_type.append(OPTION_type);
    }
    const INPUT_link = document.createElement("input");
    INPUT_link.setAttribute("id", "reference_link" + data.uuid);
    INPUT_link.setAttribute("name", "reference_link" + data.uuid);

    if (data.refType === "user") {
      INPUT_link.addEventListener("keyup", keyupEvent);
      INPUT_link.classList.add("user");
    }
    INPUT_link.autocomplete = "off";
    INPUT_link.value = data.link;
    INPUT_link.required = true;
    SELECT_type.addEventListener("change", (e) => {
      this.handleTypeChange(e, INPUT_link, keyupEvent);
    });

    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";

    BUTTON_cancel.addEventListener("click", (e) => {
      this.cancelEdit(data.uuid);
    });

    const INPUT_submit = document.createElement("input");
    INPUT_submit.type = "submit";
    INPUT_submit.value = "Edit Reference";
    INPUT_submit.addEventListener("click", (e) => {
      this.checkInputs(e, FORM, () => {
        this.editReference(data.uuid);
      });
    });

    FORM.append(SELECT_type, INPUT_link, INPUT_submit, BUTTON_cancel);
    LI.append(FORM);
    return LI;
  };

  deleteReference = (uuid) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
        mutation delete_reference($uuid: ID!) {
          deleteReference(referenceId: $uuid) {
            ok
          }
        }
        `,
        variables: {
          uuid: uuid,
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.data.deleteReference.ok) {
          this.deleteDisplayedReference(uuid);
        }
      });
  };

  deleteDisplayedReference = (uuid) => {
    this.shadowRoot.querySelector(`#reference${uuid}`).remove();
  };

  editReference = (uuid) => {
    const FORM = this.shadowRoot.querySelector(`#edit_reference${uuid}`);
    const formData = new FormData(FORM);
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
        mutation update_reference($uuid: ID!, $link: String, $refType: String) {
          updateReference(uuid: $uuid, link: $link, type: $refType) {
            ok
            reference {
              link
              uuid
              refType
            }
          }
        }
        `,
        variables: {
          uuid: uuid,
          link: formData.get("reference_link" + uuid),
          refType: formData.get("reference_type" + uuid),
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.updateReference(data.data.updateReference.reference);
      });
  };
  updateReference = (data) => {
    const LI = this.displayReferenceLI(data);
    const LI_old = this.shadowRoot.querySelector("#reference" + data.uuid);
    this.shadowRoot.querySelector("#edit" + data.uuid).remove();
    this.shadowRoot.querySelector("ul").insertBefore(LI, LI_old);
    LI_old.remove();
  };

  cancelEdit = (uuid) => {
    this.shadowRoot.querySelector("#edit" + uuid).remove();
    this.shadowRoot.querySelector("#reference" + uuid).style =
      "display:list-item";
  };

  addReference = (reference) => {
    const UL = this.shadowRoot.querySelector(
      `#reference${this.getAttribute("for_type")}${this.getAttribute("for_id")}`
    );
    const LI = this.displayReferenceLI(reference);
    UL.append(LI);
  };

  getExperienceReferences = (id) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query get_reference($id:ID!) {
          experiences(id: $id) {
            references {
              refType
              link
              uuid
              consent
            }
          }
        }
        `,
        variables: {
          id: id,
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.errors) {
          if (data.data.experiences) {
            this.displayReferences(data.data.experiences[0].references);
          }
        }
      });
  };

  getUsers = (search_string, callback) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query get_user($name: String) {
            staff(name: $name, username: $name) {
              name
              username
            }
          }
        `,
        variables: {
          name: search_string,
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        callback(data);
      });
  };

  getSkillReferences = (id) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query get_reference($id:ID!) {
          skills(id: $id) {
            references {
              refType
              link
              uuid
              consent
            }
          }
        }
        `,
        variables: {
          id: id,
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.data.skills) {
          this.displayReferences(data.data.skills[0].references);
        }
      });
  };

  createReference = () => {
    const FORM = this.shadowRoot.querySelector("#create_reference");
    const formData = new FormData(FORM);
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
        mutation create_reference($for_type:String!, $for_id:ID!, $type:String!, $link:String! ) {
          createReference(forId: $for_id, forType: $for_type, type: $type, link: $link) {
            ok
            reference {
              refType
              link
              uuid
            }
          }
        }
        `,
        variables: {
          for_id: this.getAttribute("for_id"),
          for_type: this.getAttribute("for_type"),
          type: formData.get("reference_type"),
          link: formData.get("reference_link"),
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.addReference(data.data.createReference.reference);
        this.handleCancel();
      });
  };

 

  checkInputs = (e, FORM, callback) => {
    var isValid = true;
    const REQUIRED_ELEMENTS = FORM.querySelectorAll("[required]");
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      var type = REQUIRED_ELEMENTS[i].getAttribute("type");
      switch (type) {
        case "email":
          const mail_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
          isValid = isValid && mail_regex.test(REQUIRED_ELEMENTS[i].value)
          break;
      }
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      callback();
    }
  };

  addReferenceButton = () => {
    const BUTTON = document.createElement("button");
    BUTTON.setAttribute("id", "add_reference");
    BUTTON.innerText = "Add reference";
    BUTTON.addEventListener("click", () => {
      BUTTON.disabled = true;
      this.createReferenceFORM(BUTTON);
    });
    this.shadowRoot.append(BUTTON);
  };

  createReferenceFORM = (INSERT_BEFORE) => {
    const FORM = document.createElement("form");
    FORM.setAttribute("id", "create_reference");
    const P_refrence = document.createElement("p");
    const SELECT_type = document.createElement("select");
    SELECT_type.required = true;
    SELECT_type.setAttribute("id", "reference_type");
    SELECT_type.setAttribute("name", "reference_type");

    const keyupEvent = () => {
      this.suggestUsersEvent(INPUT_link);
    };

    var OPTION_type = document.createElement("option");
    OPTION_type.innerText = "Select Type";
    OPTION_type.setAttribute("value", "");
    SELECT_type.append(OPTION_type);
    const options = ["user", "phone", "email", "external link"];

    for (let i = 0; i < options.length; i++) {
      var OPTION_type = document.createElement("option");
      OPTION_type.innerText = options[i];
      OPTION_type.setAttribute("value", options[i]);
      // if (type == options[i].toLowerCase()) {
      //   OPTION_type.selected = true;
      // }
      SELECT_type.append(OPTION_type);
    }

    const INPUT_link = document.createElement("input");
    INPUT_link.setAttribute("id", "reference_link");
    INPUT_link.setAttribute("name", "reference_link");
    INPUT_link.setAttribute("placeholder", "link");
    INPUT_link.autocomplete = "off";

    SELECT_type.addEventListener("change", (e) => {
      this.handleTypeChange(e, INPUT_link, keyupEvent);
    });

    INPUT_link.required = true;
    P_refrence.append(SELECT_type, INPUT_link, "*");
    FORM.append(P_refrence);

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", "Create Reference");
    INPUT_submit.addEventListener("click", (e) => {
      this.checkInputs(e, FORM, () => {
        this.createReference();
      });
    }); //onSubmit
    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";
    BUTTON_cancel.addEventListener("click", this.handleCancel);
    P_submit.append(BUTTON_cancel, INPUT_submit);
    FORM.append(P_submit);
    this.shadowRoot.insertBefore(FORM, INSERT_BEFORE);
  };

  suggestUsersEvent = (INPUT) => {
    if (!this.suggested_users.length && INPUT.value.length >= 1) {
      this.getUsers(INPUT.value[0], (data) => {
        this.suggested_users = data.data.staff;
        var suggested_users = this.suggested_users.filter((e) => {
          return (
            e.name.toLowerCase().includes(INPUT.value) ||
            e.username.toLowerCase().includes(INPUT.value)
          );
        });
        this.displaySuggestUsers(suggested_users, INPUT);
      });
    } else if (INPUT.value.length == 0) {
      this.suggested_users = [];
      const OLD = INPUT.parentNode.querySelector("aside");
      if (OLD) OLD.remove();
    } else {
      var suggested_users = this.suggested_users.filter((e) => {
        return (
          e.name.toLowerCase().includes(INPUT.value) ||
          e.username.toLowerCase().includes(INPUT.value)
        );
      });

      this.displaySuggestUsers(suggested_users, INPUT);
    }
  };

  displaySuggestUsers = (suggested_users, INPUT) => {
    const OLD = INPUT.parentNode.querySelector(".suggested_users");
    if (OLD) OLD.remove();

    const INPUT_rect = INPUT.getBoundingClientRect();
    const ASIDE_users = document.createElement("aside");
    ASIDE_users.classList.add("suggested_users");
    ASIDE_users.style = `
    position:absolute;
    z-index:1;
    // top: ${0}px;
    left: ${INPUT_rect.width * 0.9}px; 
    `;
    for (let i = 0; i < suggested_users.length; i++) {
      var P_user = document.createElement("p");
      P_user.innerText = `${suggested_users[i].name}[${suggested_users[i].username}]`;
      P_user.addEventListener("click", () => {
        this.clickedSuggestedUser(suggested_users[i], ASIDE_users, INPUT);
      });
      ASIDE_users.append(P_user);
    }

    INPUT.parentNode.insertBefore(ASIDE_users, INPUT.nextSibling);
  };

  clickedSuggestedUser = (user, ASIDE, INPUT) => {
    ASIDE.remove();
    INPUT.value = user.username;
  };

  handleTypeChange = (e, INPUT_link, keyupEvent) => {
    switch (e.target.value) {
      case "email":
        INPUT_link.setAttribute("type", "email");
        INPUT_link.setAttribute("placeholder", "Email address");
        INPUT_link.removeEventListener("keyup", keyupEvent);
        INPUT_link.classList.remove("user");

        break;

      case "phone":
        INPUT_link.setAttribute("type", "tel");
        INPUT_link.setAttribute("placeholder", "Phone number");
        INPUT_link.removeEventListener("keyup", keyupEvent);
        INPUT_link.classList.remove("user");

        break;

      case "user":
        INPUT_link.setAttribute("type", "text");
        INPUT_link.setAttribute("placeholder", "Username");
        INPUT_link.classList.add("user");
        INPUT_link.addEventListener("keyup", keyupEvent);
        break;

      default:
        INPUT_link.setAttribute("type", "text");
        INPUT_link.setAttribute("placeholder", "External link");
        INPUT_link.classList.remove("user");

        INPUT_link.removeEventListener("keyup", keyupEvent);

        break;
    }
  };

  handleCancel = () => {
    this.shadowRoot.querySelector("#add_reference").disabled = false;
    this.shadowRoot.querySelector("form").remove();
  };

  connectedCallback() {
    const for_type = this.getAttribute("for_type");
    const for_id = this.getAttribute("for_id");
    const H4 = document.createElement("h4");
    H4.innerText = "References:";
    this.shadowRoot.append(H4);
    if (for_type === "experience") {
      this.getExperienceReferences(for_id);
    } else if (for_type === "skill") {
      this.getSkillReferences(for_id);
    }
  }

  disconnectedCallback() {}
}
