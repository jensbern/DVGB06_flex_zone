import { baseTemplate } from "./template.js";
// Template data from graphql
const data = {
  "data": {
    "allStaff": {
      "edges": [
        {
          "node": {
            "name": "Pelle",
            "skills": {
              "edges": [
                {
                  "node": {
                    "name": "Pick ban",
                    "description": "good at planning pick ban against specific opponents",
                    "reference": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  }
                }
              ]
            }
          }
        },
        {
          "node": {
            "name": "Lisa",
            "skills": {
              "edges": [
                {
                  "node": {
                    "name": "Top lane matchups",
                    "description": "good at analyzing toplane matchups",
                    "reference": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}

export class Skills extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: "open"})
    shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
      article {
        border: 1px solid black;
        padding: 16px;
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
    `
    shadowRoot.append(STYLE)

    
    // <article>
    //   <h3>name</h3>
    //   <p>Description</p>
    //   <a>reference</a>
    // </article>
    
    for(var i = 0; i < data.data.allStaff.edges[0].node.skills.edges.length; i++){
      const ARTIClE = document.createElement("article");
      const H3_name = document.createElement("h3");
      H3_name.innerText = data.data.allStaff.edges[0].node.skills.edges[i].node.name;
      ARTIClE.append(H3_name);
      const P_description = document.createElement("p");
      P_description.innerText = data.data.allStaff.edges[0].node.skills.edges[i].node.description;
      ARTIClE.append(P_description);
      const A_reference = document.createElement("a");
      A_reference.setAttribute("href", data.data.allStaff.edges[0].node.skills.edges[i].node.reference);
      A_reference.setAttribute("target", "_blank");
      A_reference.innerText = "Reference";
      ARTIClE.append(A_reference);
      shadowRoot.append(ARTIClE);
    }
    
  }
  
  connectedCallback() {

  }

  disconnectedCallback() {

  }
}