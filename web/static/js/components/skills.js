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
    
    
  }
  
  connectedCallback() {

  }

  disconnectedCallback() {

  }
}