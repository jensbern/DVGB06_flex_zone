import { baseTemplate, confirmPopup, logged_in } from "./template.js";

export class Interest extends HTMLElement {
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
    
      h2{
       font-size: 1.4em;
      }
      p{
        padding: 8px 0;
        font-size: 1.2em;
      }

      p a{
        color: inherit;
        cursor:pointer;
      }

      p + span {
        font-size: 1em;
      }
      
      button {
        padding: 8px;
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 1.3em;

      }

      .interests {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 16px;
      }

      @media (max-width:1010px) {
        .interests {
          grid-template-columns: 1fr;
        }
      }

      .delete {
        cursor:pointer;
        position:absolute;
        margin-left: 16px;
        background-color: lightgray;
        border: 1px solid black;
        border-radius: 8px;
        padding: 0 8px;
      }

      .show_interest {
        display:block;
        margin-top: 8px;
        margin-bottom: 8px;
        background-color: rgb(252, 252, 252);
      }

      
      .show_interest span {
        font-size:0.8em;
        padding: 4px;
        border: 1px solid lightgrey;
        cursor:pointer;
        user-select: auto;
      }
      
      .show_interest span:hover{
        border: 1px solid black;
      }
      
      .hidden {
        display:none;
      }
      
      .no_response, .interested {
        cursor:pointer;
        margin-left: 8px;
      }

      .interested {
        font-weight: bolder;
      }

      p:hover .show_interest {
        opacity:1;
      }
      
      .selected {
        background-color: gray !important;
        cursor: default !important;
      }
      .selected:hover {
        border: 1px solid lightgrey !important;
      }

      .interestee_not_interested a, .interestee_not_interested > span{
        color: gray;
      }
      .interestee_interested a, .interestee_interested > span{
        font-weight: bolder;
      }
    `;
    this.shadowRoot.append(STYLE);
  }

  getInterestData = (username, callback) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query staff($username: String) {
          staff(username: $username) {
            interests {
              edges {
                node {
                  uuid
                  isInterested
                  to {
                    name
                    username
                  }
                }
              }
            }
            interestees {
              edges {
                node {
                  uuid
                  isInterested
                  owner {
                    name
                    username
                    contactInfo
                    contactType
                  }
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
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // sort on: 1. null, 2. true, 3. false
        const compare = (a, b) => {
          if (a.node.isInterested === b.node.isInterested) {
            return 0;
          }
          if (a.node.isInterested === null) {
            return -1;
          }
          if (a.node.isInterested === true && b.node.isInterested !== null) {
            return -1;
          }
          if (a.node.isInterested === false) {
            return 1;
          }
        };

        const interests = data.data.staff[0].interests.edges.sort(compare);
        const interestees = data.data.staff[0].interestees.edges.sort(compare);

        callback(interests, interestees);
      });
  };

  deleteInterest = (interest_id) => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
        mutation delete_interest($interest_id:ID!) {
          deleteInterest(interestUuid: $interest_id) {
            ok
          }
        }
        `,
        variables: {
          interest_id: interest_id,
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  showInterest = () => {
    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: `
        mutation create_interest($from:String!, $to:String!) {
          createInterest(owner: $from, to: $to) {
            ok
          }
        }
        `,
        variables: {
          from: this.getAttribute("logged_in_as"),
          to: this.getAttribute("username"),
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  updateInterest = (interest_id, is_interested) => {
    if (is_interested != null) {
      var query_string = `
        mutation update_interest($interest_id:ID!) {
          updateInterest(interestUuid: $interest_id, isInterested: ${is_interested}) {
            ok
            interest {
              isInterested
            }
          }
        }
      `;
    } else {
      var query_string = `
        mutation update_interest($interest_id:ID!) {
          updateInterest(interestUuid: $interest_id) {
            ok
            interest {
              isInterested
            }
          }
        }
      `;
    }

    fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        query: query_string,
        variables: {
          interest_id: interest_id,
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          console.log(data);
        }
      });
  };

  displayInterests = (interests, root) => {
    const ARTICLE = document.createElement("article");
    const H2 = document.createElement("h2");
    H2.innerText = "Interests";
    ARTICLE.append(H2);
    if (!interests.length) {
      const P_text = document.createElement("p");
      P_text.innerText = "You have not selected someone of interest.";
      const P_link = document.createElement("p");
      const A = document.createElement("a");
      A.innerText = "Search for users on the start-page";
      A.href = "/";
      P_link.append(A);
      ARTICLE.append(P_text, P_link);
      root.append(ARTICLE);
      return;
    }
    for (let i = 0; i < interests.length; i++) {
      var P = document.createElement("p");
      var A = document.createElement("a");
      A.href = "/user/" + interests[i].node.to.username;
      A.target = "_blank";
      A.innerText = `${interests[i].node.to.name} [${interests[i].node.to.username}]`;
      P.append(A);

      const SPAN_delete = document.createElement("span");
      SPAN_delete.innerText = "Delete";
      SPAN_delete.classList.add("delete");
      SPAN_delete.classList.add("hidden");
      SPAN_delete.addEventListener("click", (e) => {
        confirmPopup(document.body, "Delete interest?", (choice) => {
          if (choice) {
            this.deleteInterest(interests[i].node.uuid);
            P.remove();
          }
        });
      });
      
      const SPAN_interested = document.createElement("span");
      SPAN_interested.setAttribute("title", "Click to manage")
      switch (interests[i].node.isInterested) {
        case true:
          SPAN_interested.innerText = "Interested";
          SPAN_interested.classList.add("interested");
          P.append(SPAN_interested);
          break;

        case false:
          SPAN_interested.innerText = "Not interested";
          SPAN_interested.classList.add("interested");
          P.append(SPAN_interested);
          break;
        default:
          SPAN_interested.innerText = "No response yet";
          SPAN_interested.classList.add("no_response");
          P.append(SPAN_interested);
      }
      const click_event_hide = (e) => {
        if (!e.composedPath().includes(SPAN_delete)) {
          console.log(SPAN_interested, SPAN_delete);
          SPAN_delete.classList.add("hidden");
          window.removeEventListener("mousedown", click_event_hide);
        }
      };
      const click_event_show = (e) => {
        console.log(SPAN_interested, SPAN_delete);
        window.addEventListener("mousedown", click_event_hide);
        SPAN_delete.classList.remove("hidden");
      };
      SPAN_interested.addEventListener("mouseup", click_event_show);
      P.append(SPAN_delete);
      ARTICLE.append(P);
    }
    root.append(ARTICLE);
  };

  showInterestBUTTON = (interested_people) => {
    const BUTTON = document.createElement("button");
    BUTTON.innerText = "Show interest";
    BUTTON.addEventListener("click", (e) => {
      this.showInterest();
      BUTTON.remove();
      this.isInterested(interested_people + 1);
    });
    this.shadowRoot.append(BUTTON);
  };

  displayInterestees = (interestees, root) => {
    if (!interestees.length) return;
    const ARTICLE = document.createElement("article");
    const H2 = document.createElement("h2");
    H2.innerText = "Interestees";
    ARTICLE.append(H2);
    for (let i = 0; i < interestees.length; i++) {
      var P_name = document.createElement("p");
      var A = document.createElement("a");
      A.href = "/user/" + interestees[i].node.owner.username;
      A.target = "_blank";
      A.innerText = `${interestees[i].node.owner.name} [${interestees[i].node.owner.username}]`;

      var SPAN_contact = document.createElement("span");
      SPAN_contact.innerText = ` ${interestees[i].node.owner.contactInfo} [${interestees[i].node.owner.contactType}]`;

      var SECTION_show_interest = this.createShowInterestBUTTONS(
        P_name,
        interestees[i].node
      );

      P_name.append(A, SPAN_contact, SECTION_show_interest);
      ARTICLE.append(P_name);
    }
    root.append(ARTICLE);
  };

  createShowInterestBUTTONS = (parent, interestee) => {
    const SECTION = document.createElement("section");
    SECTION.classList.add("show_interest");
    const SPAN_is_interested = document.createElement("span");
    SPAN_is_interested.innerText = "Interested";

    const SPAN_not_interested = document.createElement("span");
    SPAN_not_interested.innerText = "Not interested";

    const SPAN_indifferent = document.createElement("span");
    SPAN_indifferent.innerText = "Indifferent";

    SPAN_is_interested.addEventListener("click", (e) => {
      if (!e.target.classList.contains("selected")) {
        parent.className = "interestee_interested";
        this.updateInterest(interestee.uuid, true);
        SECTION.querySelector(".selected").classList.remove("selected");
        SPAN_is_interested.classList.add("selected");
      }
    });
    SPAN_not_interested.addEventListener("click", (e) => {
      if (!e.target.classList.contains("selected")) {
        parent.className = "interestee_not_interested";
        this.updateInterest(interestee.uuid, false);
        SECTION.querySelector(".selected").classList.remove("selected");
        SPAN_not_interested.classList.add("selected");
      }
    });
    SPAN_indifferent.addEventListener("click", (e) => {
      if (!e.target.classList.contains("selected")) {
        parent.className = "";
        this.updateInterest(interestee.uuid, null);
        SECTION.querySelector(".selected").classList.remove("selected");
        SPAN_indifferent.classList.add("selected");
      }
    });
    switch (interestee.isInterested) {
      case true:
        SPAN_is_interested.classList.add("selected");
        parent.className = "interestee_interested";
        break;
      case false:
        SPAN_not_interested.classList.add("selected");
        parent.className = "interestee_not_interested";
        break;
      case null:
        SPAN_indifferent.classList.add("selected");
        break;
    }
    SECTION.append(SPAN_is_interested, SPAN_not_interested, SPAN_indifferent);
    return SECTION;
  };

  isInterested = (interested_people) => {
    const P = document.createElement("p");
    P.innerText = '"Is interesting" - ' + this.getAttribute("logged_in_as");
    if (interested_people > 1) {
      P.innerText += ` and ${interested_people - 1} more!`;
    }
    this.shadowRoot.append(P);
  };

  connectedCallback() {
    const SECTION = document.createElement("section");
    SECTION.classList.add("interests");
    if (this.getAttribute("logged_in_as")) {
      this.getInterestData(
        this.getAttribute("username"),
        (interests, interestees) => {
          if (logged_in(this)) {
            this.displayInterests(interests, SECTION);
            this.displayInterestees(interestees, SECTION);
            this.shadowRoot.append(SECTION);
          } else {
            var is_already_interested = interestees.filter((e) => {
              return (
                e.node.owner.username === this.getAttribute("logged_in_as")
              );
            }).length;
            if (!is_already_interested) {
              this.showInterestBUTTON(interestees.length);
            } else {
              this.isInterested(interestees.length);
            }
          }
        }
      );
    }
  }

  disconnectedCallback() {}
}
