import { baseTemplate } from "./template.js";

export class CreateExperience extends HTMLElement {
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
    input[type="text"], input[type="url"], textarea, select{
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
    label{
      margin: 8px;
      margin-right: 0px;
      padding: 8px;
    }
    input[type="date"]{
      margin-left: 0px;
    }
    `;
    this.shadowRoot.append(STYLE);

    const BUTTON_addExperience = document.createElement("button");
    BUTTON_addExperience.innerText = "Add Experience";
    BUTTON_addExperience.setAttribute("id", "add_Experience");
    BUTTON_addExperience.addEventListener(
      "click",
      this.displayCreateExperience
    );

    this.shadowRoot.append(BUTTON_addExperience);
  }

  displayCreateExperience = () => {
    this.shadowRoot.querySelector("#add_Experience").disabled = true;

    const FORM_createExperience = document.createElement("form");
    const P_type = document.createElement("p");
    const LABEL_type = document.createElement("label");
    LABEL_type.innerText = "Type";
    LABEL_type.setAttribute("for", "experience_type");
    LABEL_type.style = "display:none;";
    const SELECT_type = document.createElement("select");
    SELECT_type.setAttribute("type", "text");
    SELECT_type.setAttribute("id", "experience_type");
    SELECT_type.setAttribute("name", "experience_type");
    SELECT_type.required = true;

    
    var OPTION_type = document.createElement("option");
    OPTION_type.innerText = "Select Type";
    OPTION_type.setAttribute("value", "");
    SELECT_type.append(OPTION_type);
    const options = [
      "Analyst",
      "Coach",
      "Positional Coach",
      "Sports Psychologist",
      "Other",
    ];
    for (let i = 0; i < options.length; i++) {
      var OPTION_type = document.createElement("option");
      OPTION_type.innerText = options[i];
      OPTION_type.setAttribute("value", options[i].toLowerCase());
      SELECT_type.append(OPTION_type);
    }

    P_type.append(LABEL_type, SELECT_type, "*");
    FORM_createExperience.append(P_type);

    const P_at = document.createElement("p");
    const LABEL_at = document.createElement("label");
    LABEL_at.innerText = "at";
    LABEL_at.setAttribute("for", "experience_at");
    LABEL_at.style = "display:none;";
    const INPUT_at = document.createElement("input");
    INPUT_at.setAttribute("type", "text");
    INPUT_at.setAttribute("id", "experience_at");
    INPUT_at.setAttribute("name", "experience_at");
    INPUT_at.setAttribute("placeholder", "At (team, company, ... )")
    INPUT_at.required = true;
    P_at.append(LABEL_at, INPUT_at, "*");
    FORM_createExperience.append(P_at);

    const P_description = document.createElement("p");
    const LABEL_description = document.createElement("label");
    LABEL_description.innerText = "Description";
    LABEL_description.setAttribute("for", "experience_description");
    LABEL_description.style = "display:none;";
    const TEXTAREA_description = document.createElement("textarea");
    TEXTAREA_description.style = "resize: none;";
    TEXTAREA_description.setAttribute("id", "experience_description");
    TEXTAREA_description.setAttribute("name", "experience_description");
    TEXTAREA_description.setAttribute("placeholder", "Description ...");
    P_description.append(LABEL_description, TEXTAREA_description);
    FORM_createExperience.append(P_description);

    const P_from_to = document.createElement("p");
    const LABEL_from = document.createElement("label");
    LABEL_from.innerText = "From ";
    LABEL_from.setAttribute("for", "experience_from");
    const INPUT_from = document.createElement("input");
    INPUT_from.setAttribute("type", "date");
    INPUT_from.setAttribute("id", "experience_from");
    INPUT_from.setAttribute("name", "experience_from");
    INPUT_from.required = true;
    const LABEL_to = document.createElement("label");
    LABEL_to.innerText = "To";
    LABEL_to.setAttribute("for", "experience_to");
    const INPUT_to = document.createElement("input");
    INPUT_to.setAttribute("type", "date");
    INPUT_to.setAttribute("id", "experience_to");
    INPUT_to.setAttribute("name", "experience_to");
    P_from_to.append(LABEL_from, INPUT_from, "*", LABEL_to, INPUT_to);
    FORM_createExperience.append(P_from_to);

    const P_reference = document.createElement("p");
    const LABEL_reference = document.createElement("label");
    LABEL_reference.innerText = "Reference";
    LABEL_reference.setAttribute("for", "experience_reference");
    LABEL_reference.style = "display:none;";
    const INPUT_reference = document.createElement("input");
    INPUT_reference.setAttribute("type", "url");
    INPUT_reference.setAttribute("id", "experience_reference");
    INPUT_reference.setAttribute("name", "experience_reference");
    INPUT_reference.setAttribute(
      "placeholder",
      "Reference URL (e.g. video, article, ...)"
    );
    P_reference.append(LABEL_reference, INPUT_reference);
    FORM_createExperience.append(P_reference);

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", "Create Experience");
    INPUT_submit.addEventListener("click", this.handleCreateExperience);
    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";
    BUTTON_cancel.addEventListener("click", this.concealCreateExperience);
    P_submit.append(BUTTON_cancel, INPUT_submit);
    FORM_createExperience.append(P_submit);

    this.shadowRoot.prepend(FORM_createExperience);
  };

  handleCreateExperience = (e) => {
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

  concealCreateExperience = () => {
    this.shadowRoot.querySelector("#add_Experience").disabled = false;
    this.shadowRoot.querySelector("form").remove();
  };

  connectedCallback() {}

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").removeEventListener("click");
  }
}
