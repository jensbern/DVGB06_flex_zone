import { baseTemplate, confirmPopup } from "./template.js";

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
    `;
    this.shadowRoot.append(STYLE);
  }

  displayReferences = (data) => {
    const UL = document.createElement("ul");
    UL.setAttribute(
      "id",
      `reference${this.getAttribute("for_type")}${this.getAttribute("for_id")}`
    );
    for (let i = 0; i < data.length; i++) {
      var LI = this.createReferenceLI(data[i]);
      UL.append(LI);
    }
    this.shadowRoot.append(UL);
    if(!this.getAttribute("edit"))
    this.addReferenceButton(
      this.getAttribute("for_type"),
      this.getAttribute("for_id")
    );
  };

  createReferenceLI = (data) => {
    // console.log(data)
    var LI = document.createElement("li");
    LI.setAttribute("id", `reference${data.uuid}`)
    var A = document.createElement("a");
    A.target = "_blank";
    switch (data.refType) {
      case "user":
        A.href = `/user/${data.link}`;
        A.innerText = `User: ${data.link}`;
        break;
      case "phone":
        A.href = "tel:"+data.link;
        A.innerText = `Phone: ${data.link}`;
        A.type = "tel";
        break;
      case "email":
        A.href = "mailto:"+data.link;
        A.innerText = `email: ${data.link}`;
        A.type = "email";
        break;
      default:
        A.href = data.link;
        A.innerText = "External link";
        A.title = data.link;
        break;
    }
    LI.append(A);
    return LI
  };

  addReference = (reference) => {
    const UL = this.shadowRoot.querySelector(
      `#reference${this.getAttribute("for_type")}${this.getAttribute("for_id")}`
    );
    const LI = this.createReferenceLI(reference)
    UL.append(LI)
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
        if (data.data.experiences) {
          this.displayReferences(data.data.experiences[0].references);
        }
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
        // console.log(this.getAttribute("for_type"), data)
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
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
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
        this.addReference(data.data.createReference.reference)
        this.handleCancel()
      });
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
      top: ${DOM_rect.y + DOM_rect.height + 8}px;
      left: ${DOM_rect.x}px;
    `;
    DOM.parentElement.append(TOOLTIP);
    const click_func = (e) => {
      TOOLTIP.remove();
      window.removeEventListener("click", click_func);
    };
    window.addEventListener("click", click_func);
  };

  checkInputs = (e) => {
    var isValid = true;
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll("[required]");
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      this.createReference();
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
    SELECT_type.addEventListener("change", this.handleTypeChange);

    var OPTION_type = document.createElement("option");
    OPTION_type.innerText = "Select Type";
    OPTION_type.setAttribute("value", "");
    SELECT_type.append(OPTION_type);
    const options = ["User", "Phone", "Email", "External link"];

    for (let i = 0; i < options.length; i++) {
      var OPTION_type = document.createElement("option");
      OPTION_type.innerText = options[i];
      OPTION_type.setAttribute("value", options[i].toLowerCase());
      // if (type == options[i].toLowerCase()) {
      //   OPTION_type.selected = true;
      // }
      SELECT_type.append(OPTION_type);
    }

    const INPUT_link = document.createElement("input");
    INPUT_link.setAttribute("id", "reference_link");
    INPUT_link.setAttribute("name", "reference_link");
    INPUT_link.setAttribute("placeholder", "link");
    INPUT_link.required = true;
    P_refrence.append(SELECT_type, INPUT_link, "*");
    FORM.append(P_refrence);

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", "Create Reference");
    INPUT_submit.addEventListener("click", this.checkInputs); //onSubmit
    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";
    BUTTON_cancel.addEventListener("click", this.handleCancel);
    P_submit.append(BUTTON_cancel, INPUT_submit);
    FORM.append(P_submit);
    this.shadowRoot.insertBefore(FORM, INSERT_BEFORE);
  };

  handleTypeChange = (e) => {
    const INPUT_link = this.shadowRoot.querySelector("#reference_link");
    switch (e.target.value) {
      case "email":
        INPUT_link.setAttribute("type", "email");
        INPUT_link.setAttribute("placeholder", "Email address");
        break;

      case "phone":
        INPUT_link.setAttribute("type", "tel");
        INPUT_link.setAttribute("placeholder", "Phone number");
        break;
      
      case "user":
      INPUT_link.setAttribute("type", "tel");
      INPUT_link.setAttribute("placeholder", "Username");

      break;

      default:
        INPUT_link.setAttribute("type", "text");
        INPUT_link.setAttribute("placeholder", "External link");
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
    const edit = this.getAttribute("edit");
    const H4 = document.createElement("h4");
    H4.innerText = "References:";
    this.shadowRoot.append(H4);
    // console.log(for_type, for_id)
    if (for_type === "experience") {
      this.getExperienceReferences(for_id);
    } else if (for_type === "skill") {
      this.getSkillReferences(for_id);
    }
  }

  // static get observedAttributes() { return ['edit']; }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   console.log("name:", name, "old value: ", oldValue, "new value:", newValue);
  // }

  disconnectedCallback() {}
}
