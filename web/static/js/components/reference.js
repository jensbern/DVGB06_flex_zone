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
        cursor:pointer
      }
    `;
    this.shadowRoot.append(STYLE);

  }

  displayReferences = (data) => {
    console.log(data)
    const UL = document.createElement("ul")
    for(let i = 0; i < data.length; i++) {
      var LI = document.createElement("li")
      var A = document.createElement("a")
      A.target="_blank";
      switch (data[i].refType) {
        case "user":
          A.href = `/user/${data[i].link}`
          A.innerText = `User: ${data[i].link}`
          break;
        case "phone":
          A.href = data[i].link
          A.innerText = `Phone: ${data[i].link}`
          A.type = "tel"
          break;
        case "email":
          A.href = data[i].link
          A.innerText = `email: ${data[i].link}`
          A.type = "email"
          break;
        default:
          A.href = data[i].link
          A.innerText = "External link"
          break;
      }
      LI.append(A);
      UL.append(LI)
    }
    this.shadowRoot.append(UL)
  }

  getExperienceReferences = (id) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
          "id": id
        }
      })
    }).then(response => {
      return response.json()
    }).then(data => {
      if(data.data.experiences[0]){
        this.displayReferences(data.data.experiences[0].references)

      }
    })
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

 


  connectedCallback() {
    const for_type = this.getAttribute("for_type")
    const for_id = this.getAttribute("for_id")
    const H4 = document.createElement("h4");
    H4.innerText = "References:"
    this.shadowRoot.append(H4);
    console.log(for_type, for_id)
    if(for_type === "experience"){
      this.getExperienceReferences(for_id);
    }else if (for_type === "skill"){

    }
  }

  disconnectedCallback() {
  }
}
