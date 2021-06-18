import { baseTemplate } from "./template.js";

// GraphQL Query
// {
//   allStaff {
//     edges {
//       node {
//         name
//         experiences {
//           edges {
//             node {
//               type
//               description
//               at
//               reference
//               start
//               end
//             }
//           }
//         }
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
            "experiences": {
              "edges": [
                {
                  "node": {
                    "type": "Analyst",
                    "description": "good at good atmosphere within the team",
                    "at": "Pepega Gaming",
                    "reference": "Pelles telefon",
                    "start": "2021-06-18T16:44:12.972150",
                    "end": null
                  }
                }
              ]
            }
          }
        },
        {
          "node": {
            "name": "Lisa",
            "experiences": {
              "edges": []
            }
          }
        }
      ]
    }
  }
}

export class Experiences extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"})
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
      article {
        border: 1px solid darkgrey;
        padding: 16px;
        background-color: #fff;
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
    this.shadowRoot.append(STYLE)

    
    // <article>
    //   <h3>name</h3>
    //   <p>Description</p>
    //   <a>reference</a>
    // </article>
    
    
    
  }
  
  displayExperiences (experiences) {
    for(var i = 0; i < experiences.length; i++){
      const ARTIClE = document.createElement("article");
      
      const H3_name = document.createElement("h3");
      H3_name.innerText = experiences[i].node.type;
      ARTIClE.append(H3_name);

      const P_at = document.createElement("p");
      P_at.innerText = experiences[i].node.at;
      ARTIClE.append(P_at)
      
      const P_description = document.createElement("p");
      P_description.innerText = experiences[i].node.description;
      ARTIClE.append(P_description);
      
      const P_duration = document.createElement("p");
      P_duration.innerText = `${experiences[i].node.start} - ${experiences[i].node.end ? experiences[i].node.end: "Now"}`
      ARTIClE.append(P_duration);
      
      const A_reference = document.createElement("a");
      A_reference.setAttribute("href", experiences[i].node.reference);
      A_reference.setAttribute("target", "_blank");
      A_reference.innerText = "Reference";
      ARTIClE.append(A_reference);
      this.shadowRoot.append(ARTIClE);
    }
  }

  connectedCallback() {
    this.displayExperiences(data.data.allStaff.edges[0].node.experiences.edges);
  }

  disconnectedCallback() {

  }
}