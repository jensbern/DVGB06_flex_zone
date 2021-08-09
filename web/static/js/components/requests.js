import { baseTemplate, logged_in } from "./template.js";

export class Requests extends HTMLElement {
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
      position:relative;
    }
    article p{
      font-size: 1.2em;
      margin-top: 8px;
    }
    h3, legend{
      font-size: 1.4em;
    }

    legend {
      margin-top: 16px;
      margin-bottom: 8px;
    }

    label{
      margin-right: 16px;
      margin-left: 8px;
      font-size: 1.2em;
    }

    `;
    this.shadowRoot.append(STYLE);
  } 

  

  getReferenceData = (callback) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + window.sessionStorage.getItem("accessToken")
      },
      body: JSON.stringify({
        query: `
        query reference($refType: String, $username: String) {
          references(refType: $refType, link: $username) {
            uuid
            consent
            link
            toSkill {
              edges {
                node {
                  name
                  description
                  staff {
                    username
                    name
                  }
                }
              }
            }
            toExperience {
              edges {
                node {
                  type
                  description
                  staff {
                    name
                    username
                  }
                }
              }
            }
          }
        }
        `,
        variables: {
          username: this.getAttribute("logged_in_as"),
          refType: "user"
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

  updateConsent = (FORM, reference_uuid) => {
    const formData = new FormData(FORM)
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + window.sessionStorage.getItem("accessToken")
      },
      body: JSON.stringify({
        query: `
          mutation update_reference($uuid: ID!, $consent: Boolean) {
            updateReference(uuid: $uuid, consent: $consent) {
              ok
            }
          }
        `,
        variables: {
          uuid: reference_uuid,
          consent: formData.get("consent") === "yes" ? true : false
        },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          console.log(data);
        }
      });
  }

  createConsentBUTTONS = (root, consent, reference_uuid) => {
    const FORM = document.createElement("form");
    const LEGEND = document.createElement("legend")
    LEGEND.innerText = "Can you be a reference for this?"
    const LABEL_yes = document.createElement("label")
    LABEL_yes.innerText = "yes";
    const INPUT_yes = document.createElement("input")
    INPUT_yes.type="radio"
    INPUT_yes.value="yes"
    INPUT_yes.name = "consent"
    if(consent === true){
      INPUT_yes.checked = true;
    }
    const LABEL_no = document.createElement("label")
    LABEL_no.innerText = "no"
    const INPUT_no = document.createElement("input")
    INPUT_no.type="radio"
    INPUT_no.value="no"
    INPUT_no.name = "consent"
    if(consent === false){
      INPUT_no.checked = true;
    }
    LABEL_yes.append(INPUT_yes)
    LABEL_no.append(INPUT_no)

    // LABEL_yes.addEventListener("click", e => {
    //   this.updateConsent(FORM)
    // })
    // LABEL_no.addEventListener("click", e => {
    //   this.updateConsent(FORM)
    // })
    FORM.append(LEGEND, LABEL_yes, LABEL_no)
    FORM.addEventListener("change", e => {
      this.updateConsent(FORM, reference_uuid)
    })
    root.append(FORM)
  }

  createReferenceRequestSECTION = (root, reference) => {
    const ARTICLE = document.createElement("article")
    const H3_type = document.createElement("h3")
    const P_type = document.createElement("p")
    const P_description = document.createElement("p");
    const P_from = document.createElement("p")
    const A_from = document.createElement("a")
    P_from.append(A_from)
    
    const experience = reference.toExperience.edges;
    const skill = reference.toSkill.edges;
    if(experience.length){
      P_type.innerText = experience[0].node.type
      P_description.innerText = experience[0].node.description
      A_from.href = "/user/"+experience[0].node.staff.username
      A_from.innerText = experience[0].node.staff.name
      H3_type.append("Reference: Experience for ", A_from)
    } else if(skill.length) {
      P_type.innerText = skill[0].node.name
      P_description.innerText = skill[0].node.description
      A_from.href = "/user/"+skill[0].node.staff.username
      A_from.innerText = skill[0].node.staff.name
      H3_type.append("Reference: Skill for ", A_from)
    }
    ARTICLE.append(H3_type, P_type, P_description)
    this.createConsentBUTTONS(ARTICLE, reference.consent, reference.uuid)
    root.append(ARTICLE)
  }


  displayRequests = () => {
    this.getReferenceData(data => {

      // order: null, true, false
      const sort_func = (a, b) => {
        if(b.consent === null) return 1;
        return b.consent - a.consent
      }
      const references = data.data.references.sort(sort_func);
      for(let i = 0; i < references.length; i++){
        this.createReferenceRequestSECTION(this.shadowRoot, references[i])
      } 

    })
  }

  connectedCallback() {
    if(logged_in(this)){
      this.displayRequests()
    }
  }

  disconnectedCallback() {}
}
