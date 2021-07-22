const baseTemplate = document.createElement("template");
baseTemplate.innerHTML = `
  <style> 
    @import url("/stylesheet/normalize.css");
  </style>
`
const logged_in = (root) => {
  return (
      root.getAttribute("username") &&
      root.getAttribute("username") === root.getAttribute("logged_in_as")
    )
}
const confirmPopup = (root, text, callback) => {
  const DIV_container = document.createElement("div");
  DIV_container.style = `
    position: fixed;
    width: 100%;
    height: 100vh;
    top:0;
    background-color: rgba(92, 92, 92, 0.75);
    display:flex;
  `
  const DIV_choices = document.createElement("div");
  DIV_choices.style = `
    margin: auto;
    padding: 48px 64px;
    // padding-top: 32px;
    background-color: white;
    border: 2px solid gray;
  `
  const P_question = document.createElement("p");
  P_question.innerText = text;
  P_question.style = `
    font-size: 1.4em;
    margin: 8px 0;
  `
  const P_buttons = document.createElement("p");
  P_buttons.style = `
    display:flex;
    justify-content: space-evenly;
    margin-top: 16px;
  `
  const BUTTON_yes = document.createElement("button");
  BUTTON_yes.innerText = "Yes";
  BUTTON_yes.style = `
    font-size: 1.1em;
    padding: 8px;
    background-color: #fcc4c4;
    border: 1px solid gray;
    outline-color: gray;
    cursor:pointer;
  `
  const BUTTON_no = document.createElement("button");
  BUTTON_no.innerText = "No";
  BUTTON_no.style = `
    font-size: 1.1em;
    cursor:pointer;
    padding: 8px;
  `

  const no_event = (e) => {
    if((!e.path.includes(DIV_choices) | e.path.includes(BUTTON_no) )){
      callback(false)
      DIV_container.remove(); 
    }
  }
  DIV_container.addEventListener("click", no_event);
  BUTTON_no.addEventListener("click", no_event);
  
  const yes_event = () => {
    callback(true)
    DIV_container.remove()
  }

  BUTTON_yes.addEventListener("click", yes_event);
  P_buttons.append(BUTTON_yes, BUTTON_no)
  DIV_choices.append(P_question, P_buttons);

  DIV_container.append(DIV_choices)
  root.append(DIV_container);
}



export {baseTemplate, confirmPopup, logged_in};