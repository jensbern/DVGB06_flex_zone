import { baseTemplate, confirmPopup } from "./template.js";

export class Search extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
      article {
        border: 1px solid lightgrey;
        padding: 16px;
        margin: 8px;
        background-color: #fff;
        position:relative;
      }

      #search_result section {
        background-color: rgb(252, 252, 252);
        padding: 8px;
        margin-top: 16px; 
        border-left: 1px solid lightgrey;
        border-right: 1px solid lightgrey;
      }

      h3 {
        padding-top: 16px;
        font-size: 1.4em;
      }
      h4 {
        font-size: 1.3em;
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
        display:none;
        margin: 8px;
        margin-right: 0px;
        padding: 8px;
      }
    `;
    this.shadowRoot.append(STYLE);
  }

  displaySearch = () => {
    const FORM = document.createElement("form");

    const P_search = document.createElement("p");
    const LABEL_search = document.createElement("label")
    LABEL_search.innerText = "Search";
    LABEL_search.setAttribute("for", "search")
    const INPUT_search = document.createElement("input");
    INPUT_search.setAttribute("type", "text");
    INPUT_search.setAttribute("id", "search");
    INPUT_search.setAttribute("name", "search");
    INPUT_search.required = true;
    INPUT_search.setAttribute("placeholder", "e.g. Username or name...");
    P_search.append(LABEL_search, INPUT_search, "*")
    FORM.append(P_search);


    const P_submit = document.createElement("p");
    const LABEL_submit = document.createElement("label");
    LABEL_submit.innerText = "Submit";
    LABEL_submit.setAttribute("for", "submit");
    const INPUT_submit = document.createElement("input");
    INPUT_submit.setAttribute("type", "submit");
    INPUT_submit.setAttribute("id", "submit");
    INPUT_submit.value = "Search"
    INPUT_submit.addEventListener("click", e => {
      this.handleSubmit(e)
    })
    P_submit.append(LABEL_submit, INPUT_submit);
    FORM.append(P_submit);
    this.shadowRoot.append(FORM);
  }

  handleSubmit = (e) => {
    var isValid = true;
    const REQUIRED_ELEMENTS = this.shadowRoot.querySelectorAll("[required]");
    for (let i = 0; i < REQUIRED_ELEMENTS.length; i++) {
      isValid = isValid && !!REQUIRED_ELEMENTS[i].value;
    }
    if (isValid) {
      e.preventDefault();
      this.search();
    }
  };
  search = () => {
    const FORM = this.shadowRoot.querySelector("form");
    const formData = new FormData(FORM)
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Search($q:String){
            search(q: $q) {
              __typename
              ... on Staff {
                username
                name
                contactInfo
                contactType
              }
              ... on Experience {
                type
                description
                staff {
                  name
                  username
                }
              }
              ... on Skill {
                name
                description
                staff {
                  name
                  username
                }
              }
            }
          }
        `,
        variables: {
          q: formData.get("search"),
        },
      }),
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        this.displaySearchData(data.data.search);
      });
    }
    
  displaySearchData = (data) => {
    const SECTION_search = this.shadowRoot.querySelector("#search_result");
    SECTION_search.innerHTML = "";
    if(!data.length){
      const H3_error = document.createElement("h3");
      H3_error.innerText = "No result found";
      SECTION_search.append(H3_error);
      return;
    }
    
    var currentType = "";
    var ARTICLE_current = document.createElement("article");
    for(let i = 0; i < data.length; i++){
      if(currentType == data[i]["__typename"]){
        ARTICLE_current.append(this.createSearchDataElement(data[i]));
      } else {
        currentType = data[i]["__typename"];
        ARTICLE_current = document.createElement("article");
        const H3_type = document.createElement("h3")
        H3_type.innerText = currentType;
        ARTICLE_current.append(H3_type);
        ARTICLE_current.append(this.createSearchDataElement(data[i]));
        
        SECTION_search.append(ARTICLE_current);
      }
    }
  }

  createSearchDataElement = (data) => {
    const SECTION = document.createElement("section");
    const H4_name = document.createElement("h4");
    const A_name = document.createElement("a");
    A_name.target = "_blank";
    const P_type = document.createElement("p");
    const P_description = document.createElement("p");
    H4_name.append(A_name);
    SECTION.append(H4_name);
    switch (data["__typename"]) {
      case "Staff":
        A_name.innerText = data.name;
        A_name.href = `/user/${data.username}`;
        let P_contact = document.createElement("p");
        P_contact.innerText = `${data.contactInfo} [${data.contactType}]`
        SECTION.append(P_contact)
        break;

      case "Experience":
        A_name.innerText = data.staff.name
        A_name.href = `/user/${data.staff.username}`
        H4_name.append(A_name)
        SECTION.append(H4_name)
        P_type.innerText = data.type;
        P_description.innerText = data.description;
        SECTION.append(P_type, P_description);
        break;

      case "Skill":
        A_name.innerText = data.staff.name;
        A_name.href = `/user/${data.staff.username}`;
        H4_name.append(A_name);
        SECTION.append(H4_name);
        P_type.innerText = data.name;
        P_description.innerText = data.description;
        SECTION.append(P_type, P_description);
        break;

      default:
        break;
      
    }
    return SECTION;
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
      left: ${DOM_rect.x}px;
    `;
    DOM.parentElement.append(TOOLTIP);
    const click_func = (e) => {
      TOOLTIP.remove();
      window.removeEventListener("click", click_func);
    };
    window.addEventListener("click", click_func);
  };

  
  connectedCallback() {
    this.displaySearch()
    const SECTION_search_result = document.createElement("section")
    SECTION_search_result.setAttribute("id", "search_result")
    this.shadowRoot.append(SECTION_search_result);
  }

  disconnectedCallback() {}
}
