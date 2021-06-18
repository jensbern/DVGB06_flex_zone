import { baseTemplate } from "./template.js";

export class CreateSkill extends HTMLElement {
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
    input[type="text"], input[type="url"], textarea{
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
    `;
    this.shadowRoot.append(STYLE);

    const BUTTON_addSkill = document.createElement("button");
    BUTTON_addSkill.innerText = "Add skill";
    BUTTON_addSkill.setAttribute("id", "add_skill");
    BUTTON_addSkill.addEventListener("click", this.displayCreateSkill);

    this.shadowRoot.append(BUTTON_addSkill);
  }

  displayCreateSkill = () => {
    this.shadowRoot.querySelector("#add_skill").disabled = true;

    const FORM_createSkill = document.createElement("form");
    const P_title = document.createElement("p");
    const LABEL_title = document.createElement("label");
    LABEL_title.innerText = "Title";
    LABEL_title.setAttribute("for", "skill_title");
    LABEL_title.style = "display:none;";
    const INPUT_title = document.createElement("input");
    INPUT_title.setAttribute("type", "text");
    INPUT_title.setAttribute("id", "skill_title");
    INPUT_title.setAttribute("placeholder", "Title ...");
    INPUT_title.required = true;
    P_title.append(LABEL_title, INPUT_title, "*");
    FORM_createSkill.append(P_title);

    const P_description = document.createElement("p");
    const LABEL_description = document.createElement("label");
    LABEL_description.innerText = "Description";
    LABEL_description.setAttribute("for", "skill_description");
    LABEL_description.style = "display:none;";
    const TEXTAREA_description = document.createElement("textarea");
    TEXTAREA_description.style = "resize: none;";
    TEXTAREA_description.setAttribute("id", "skill_description");
    TEXTAREA_description.setAttribute("placeholder", "Description ...");
    P_description.append(LABEL_description, TEXTAREA_description);
    FORM_createSkill.append(P_description);

    const P_reference = document.createElement("p");
    const LABEL_reference = document.createElement("label");
    LABEL_reference.innerText = "Reference";
    LABEL_reference.setAttribute("for", "skill_reference");
    LABEL_reference.style = "display:none;";
    const INPUT_reference = document.createElement("input");
    INPUT_reference.setAttribute("type", "url");
    INPUT_reference.setAttribute("id", "skill_reference");
    INPUT_reference.setAttribute(
      "placeholder",
      "Reference URL (e.g. video, article, ...)"
    );
    P_reference.append(LABEL_reference, INPUT_reference);
    FORM_createSkill.append(P_reference);

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", "Create Skill");
    INPUT_submit.addEventListener("click", this.handleCreateSkill);
    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";
    BUTTON_cancel.addEventListener("click", this.concealCreateSkill);
    P_submit.append(BUTTON_cancel, INPUT_submit);
    FORM_createSkill.append(P_submit);

    this.shadowRoot.prepend(FORM_createSkill);
  };

  handleCreateSkill = (e) => {
    var isValid = true;
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll("[required]");
    for(let i = 0; i < REQUIRED_ELEMENTS.length; i++){
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      console.log("TODO: Create Experience");
    } 
  };

  concealCreateSkill = () => {
    this.shadowRoot.querySelector("#add_skill").disabled = false;
    this.shadowRoot.querySelector("form").remove();
  };

  connectedCallback() {}

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").removeEventListener("click");
  }
}