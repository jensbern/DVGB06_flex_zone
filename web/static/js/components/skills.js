import { baseTemplate, confirmPopup, logged_in } from "./template.js";

export class Skills extends HTMLElement {
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
        position: relative;
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
      span ul{
        display:none;
        text-align: right;
        position: absolute;
        right: 0;
        padding: 16px 0;
        z-index:1;

      }

      span:hover ul, span ul:hover{
        display:block;
      }

      span ul li{
        margin-bottom: 8px;
        background-color: rgb(250, 250, 250);
        border: 1px solid gray;
        padding: 8px;
        cursor: pointer;
      }
    `;
    this.shadowRoot.append(STYLE);

    // <article>
    //   <h3>name</h3>
    //   <p>Description</p>
    //   <a>reference</a>
    // </article>
  }

  settingsButton = (root, skill) => {
    const SPAN = document.createElement("span");
    SPAN.innerText = "...";
    SPAN.style = `
      position: absolute;
      top: 0;
      right: 0;
      margin: 16px;
      border: 1px solid gray;
      padding: 4px 8px 8px 8px;
      border-radius: 4px;
    `;
    const UL = document.createElement("ul");
    const LI_edit = document.createElement("li");
    LI_edit.innerText = "Edit";
    LI_edit.addEventListener("click", (e) => {
      this.editSkill(skill);
    });
    const LI_delete = document.createElement("li");
    LI_delete.innerText = "Delete";
    LI_delete.addEventListener("click", (e) => {
      this.deleteSkill(skill.uuid);
    });
    UL.append(LI_edit, LI_delete);
    SPAN.append(UL);

    root.append(SPAN);
  };

  addSkill = (skill, root) => {
    const SECTION = document.createElement("section");
    const ARTIClE = document.createElement("article");
    if (logged_in(this)) {
      this.settingsButton(ARTIClE, skill);
    }
    SECTION.setAttribute("id", `skill${skill.uuid}`);
    const H3_name = document.createElement("h3");
    H3_name.innerText = skill.name;
    ARTIClE.append(H3_name);
    const P_description = document.createElement("p");
    P_description.innerText = skill.description;
    ARTIClE.append(P_description);
    const A_reference = document.createElement("a");
    A_reference.setAttribute("href", skill.reference);
    A_reference.setAttribute("target", "_blank");
    A_reference.innerText = "Reference";
    ARTIClE.append(A_reference);
    SECTION.append(ARTIClE);
    if (!root) {
      this.shadowRoot.insertBefore(
        SECTION,
        this.shadowRoot.querySelector("#add_skill")
      );
    } else {
      root.querySelector("article").remove();
      root.append(ARTIClE);
    }
  };

  displaySkills(skills) {
    for (var i = 0; i < skills.length; i++) {
      const SECTION = document.createElement("section");
      const ARTIClE = document.createElement("article");
      if (logged_in(this)) {
        this.settingsButton(ARTIClE, skills[i].node);
      }

      SECTION.setAttribute("id", `skill${skills[i].node.uuid}`);
      const H3_name = document.createElement("h3");
      H3_name.innerText = skills[i].node.name;
      ARTIClE.append(H3_name);
      const P_description = document.createElement("p");
      P_description.innerText = skills[i].node.description;
      ARTIClE.append(P_description);
      const A_reference = document.createElement("a");
      A_reference.setAttribute("href", skills[i].node.reference);
      A_reference.setAttribute("target", "_blank");
      A_reference.innerText = "Reference";
      ARTIClE.append(A_reference);
      SECTION.append(ARTIClE);
      this.shadowRoot.append(SECTION);
    }
  }

  editSkill = (skill) => {
    const SECTION = this.shadowRoot.querySelector(`#skill${skill.uuid}`);
    SECTION.querySelector("article").style = "display:none;";
    this.displayCreateSkill(
      SECTION,
      null,
      (e) => {
        this.checkEditSkill(e, skill.uuid);
      },
      (e) => {
        this.cancelEditSkill(skill.uuid);
      },
      skill.name,
      skill.description,
      skill.reference
    );
  };

  checkEditSkill = (e, skill_id) => {
    var isValid = true;
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll(
      `#skill${skill_id} [required]`
    );
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      this.submitEditSkill(skill_id);
    }
  };

  submitEditSkill = (skill_id) => {
    const SECTION = this.shadowRoot.querySelector(`#skill${skill_id}`);
    const FORM = SECTION.querySelector("form");
    var formData = new FormData(FORM);
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
        mutation UpdateSkill($skill_id:ID!, $name: String, $description: String, $reference: String) {
          updateSkill(skillId: $skill_id, name: $name, description: $description, reference: $reference) {
            ok
            skill {
              uuid
              name
              description
              reference
            }
          }
        }
        `,
        variables: {
          skill_id: skill_id,
          name: formData.get("skill_title"),
          description: formData.get("skill_description"),
          reference: formData.get("skill_reference"),
        },
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error");
        }
      })
      .then((data) => {
        this.cancelEditSkill(skill_id);
        this.addSkill(data.data.updateSkill.skill, SECTION);
      });
  };

  cancelEditSkill = (skill_id) => {
    const SELECT = this.shadowRoot.querySelector(`#skill${skill_id}`);
    SELECT.querySelector("form").remove();
    SELECT.querySelector("article").style = "display:block";
  };

  deleteSkillButton = (root, skill_id) => {
    const SPAN = document.createElement("span");
    SPAN.innerText = "X";
    SPAN.style = `
      position: absolute;
      top: 0;
      right: 0;
      margin: 16px;
    `;

    SPAN.addEventListener("click", (e) => {
      this.deleteSkill(skill_id);
    });
    root.append(SPAN);
  };

  deleteSkill = (skill_id) => {
    confirmPopup(document.body, "Delete Skill?", (choice) => {
      if (choice) {
        this.submitDeleteSkill(skill_id);
      }
    });
  };

  submitDeleteSkill = (skill_id) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
          mutation DeleteSkill($skill_id: ID) {
            deleteSkill(skillId: $skill_id) {
              ok
            }
          }
        `,
        variables: {
          skill_id: skill_id,
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.errors) {
          throw new Error("Error removing skill");
        }
        this.shadowRoot.querySelector(`#skill${skill_id}`).remove();
      });
  };

  getSkillsData = (username, callback) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query ($username:String){
          staff(username: $username) {
            skills {
              edges {
                node {
                  name
                  uuid
                  description
                  reference
                }
              }
            }
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

  concealCreateSkill = () => {
    this.shadowRoot.querySelector("#add_skill").disabled = false;
    this.shadowRoot.querySelector("form").remove();
  };

  handleCreateSkill = (e, skill_id) => {
    var isValid = true;
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll(`[required]`);
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  displayCreateSkill = (
    root,
    BUTTON,
    onSubmit,
    onCancel,
    title,
    description,
    reference
  ) => {
    const BUTTON_add_skill = BUTTON; //BUTTON

    const FORM_createSkill = document.createElement("form");
    const P_title = document.createElement("p");
    const LABEL_title = document.createElement("label");
    LABEL_title.innerText = "Title";
    LABEL_title.setAttribute("for", "skill_title");
    LABEL_title.style = "display:none;";
    const INPUT_title = document.createElement("input");
    INPUT_title.setAttribute("type", "text");
    INPUT_title.setAttribute("id", "skill_title");
    INPUT_title.setAttribute("name", "skill_title");
    INPUT_title.setAttribute("placeholder", "Title ...");
    INPUT_title.required = true;
    INPUT_title.value = title ? title : "";

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
    TEXTAREA_description.setAttribute("name", "skill_description");
    TEXTAREA_description.setAttribute("placeholder", "Description ...");
    TEXTAREA_description.value = description ? description : "";

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
    INPUT_reference.setAttribute("name", "skill_reference");
    INPUT_reference.setAttribute(
      "placeholder",
      "Reference URL (e.g. video, article, ...)"
    );
    INPUT_reference.value = reference ? reference : "";
    P_reference.append(LABEL_reference, INPUT_reference);
    FORM_createSkill.append(P_reference);

    const P_submit = document.createElement("p");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("value", "Create Skill");
    INPUT_submit.addEventListener("click", onSubmit); // onSubmit
    const BUTTON_cancel = document.createElement("button");
    BUTTON_cancel.innerText = "Cancel";
    BUTTON_cancel.addEventListener("click", onCancel); // onCancel
    P_submit.append(BUTTON_cancel, INPUT_submit);
    FORM_createSkill.append(P_submit);

    if (BUTTON != null) {
      BUTTON_add_skill.disabled = true;
      root.insertBefore(FORM_createSkill, BUTTON_add_skill); // Root
    } else {
      root.append(FORM_createSkill);
    }
  };

  addCreateSkillButton = () => {
    const BUTTON_addSkill = document.createElement("button");
    BUTTON_addSkill.innerText = "Add skill";
    BUTTON_addSkill.setAttribute("id", "add_skill");
    BUTTON_addSkill.addEventListener("click", () => {
      this.displayCreateSkill(
        this.shadowRoot,
        BUTTON_addSkill,
        this.handleCreateSkill,
        this.concealCreateSkill
      );
    });

    this.shadowRoot.append(BUTTON_addSkill);
  };

  handleSubmit = () => {
    // console.log("TODO: Create Experience");
    const FORM = this.shadowRoot.querySelector("form");
    const username = this.getAttribute("username");
    var formData = new FormData(FORM);
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
          mutation CreateSkill($name:String, $description:String, $staff_username:String, $reference:String) {
            createSkill(description: $description, name: $name, staffUsername: $staff_username, reference: $reference) {
              ok
              skill {
                description
                name
                uuid
                reference
              }
            }
          }
        `,
        variables: {
          name: formData.get("skill_title"),
          description: formData.get("skill_description"),
          reference: formData.get("skill_reference"),
          staff_username: username,
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
        this.concealCreateSkill();
        this.addSkill(data.data.createSkill.skill);
      });
  };

  connectedCallback() {
    const username = this.getAttribute("username");
    if (username) {
      this.getSkillsData(username, (data) => {
        this.displaySkills(data.data.staff[0].skills.edges);
        if (logged_in(this)) {
          this.addCreateSkillButton();
        }
      });
    }
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("button").removeEventListener("click");
  }
}
