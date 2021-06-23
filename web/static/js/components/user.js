import { baseTemplate } from "./template.js";

export class User extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(baseTemplate.content.cloneNode(true));
    const STYLE = document.createElement("style");
    STYLE.innerText = `
      h3 {
        padding-top: 8px;
        font-size: 1.4em;
      }
      p {
        font-size: 1.2em;
        margin-top: 8px;
        margin-bottom: 16px;
      }
      .contact_type{
        margin-left: 8px;
        font-size: 0.9em;
      }
    `;
    
    this.shadowRoot.append(STYLE);
  }

  displayUserData = (userData) => {
    console.log(userData);
    const H3_name = document.createElement("h3");
    H3_name.innerText = userData.name;
    this.shadowRoot.append(H3_name);

    const P_contactInfo = document.createElement("p");
    P_contactInfo.innerText = userData.contactInfo;
    const SPAN_contactType = document.createElement("span");
    SPAN_contactType.innerText = `[${userData.contactType}]`;
    SPAN_contactType.setAttribute("class", "contact_type");
    P_contactInfo.append(SPAN_contactType);
    this.shadowRoot.append(P_contactInfo);
  }

  getUserData = (userid, callback) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query ($userid:Int)
          {
            staff(id: $userid) {
              name
              contactInfo
              contactType
            }
          }
        `,
        variables: {
          "userid": userid
        }
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        callback(data);
      });
  };

  connectedCallback() {
    const userid = this.getAttribute("userid");
    this.getUserData(userid, data => {
      this.displayUserData(data.data.staff[0])
    });
  }

  disconnectedCallback() {}
}
