import { baseTemplate } from "./template.js";

// GraphQL Query
// {
//   allStaff {
//     edges {
//       node {
//         name
//         contactInfo
//       }
//     }
//   }
// }
const data = {
  "data": {
    "allStaff": {
      "edges": [
        {
          "node": {
            "name": "Pelle",
            "contactInfo": "pelle#1234"
          }
        },
        {
          "node": {
            "name": "Lisa",
            "contactInfo": "lisa.s@gmail.com"
          }
        }
      ]
    }
  }
}

export class User extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"})
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
      h3 {
        padding-top: 8px;
        font-size: 1.4em;
      }
      p {
        font-size: 1.2em;

      }
     
    `
    const userid = this.getAttribute("userid");
    console.log(userid);
    this.shadowRoot.append(STYLE);
  }
  
  displayUserData (userData) {
    const H3_name = document.createElement("h3");
    H3_name.innerText = userData.name;
    this.shadowRoot.append(H3_name);
  
    const P_contactInfo = document.createElement("p");
    P_contactInfo.innerText = userData.contactInfo;
    this.shadowRoot.append(P_contactInfo);
    
  }

  connectedCallback() {
    this.displayUserData(data.data.allStaff.edges[0].node)
  }

  disconnectedCallback() {

  }
}