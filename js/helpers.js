/* HELPER FUNCTIONS */

// convert to upper plural
function pUC(noun) {
  if (noun.toLowerCase() === "property") return "Properties";
  else {
    return noun.charAt(0).toUpperCase() + noun.slice(1) + "s";
  }
}

function isLetter(str) {
  return str.length === 1 && str.toLowerCase().match(/[a-z]/i);
}

// pluralize and lower case
function pLC(noun, value) {
  if (value <= 1) return noun.toLowerCase();

  if (noun.toLowerCase() === "property") return "properties";
  else return noun.toLowerCase() + "s";
}

function pastAction(action) {
  if (action === "new") return "new";
  else if (action === "edit") return "edited";
  else if (action === "delete") return "deleted";
}

function removeAllElementsFrom(el) {
  while (el.childNodes.length > 0) {
    el.removeChild(el.lastChild);
  }
}

function populateUserNav(response) {
  let userNav = document.querySelector(".user-nav");

  if (response["user"]) {
    let name = document.createElement("a");
    name.href = "user?id=" + response["user_id"];
    name.innerHTML = response["user"];

    userNav.append(name);

    let signOut = document.createElement("a");
    signOut.classList.add("button");
    signOut.href = "sign_out";
    signOut.innerHTML = "Sign out";

    userNav.append(signOut);
  } else {
    let signIn = document.createElement("a");
    signIn.classList.add("button");
    signIn.href = "sign_in";
    signIn.innerHTML = "Sign in";

    userNav.append(signIn);
  }
}