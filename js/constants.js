/* DEFINE CONSTANT ELEMENTS TO BE APPENDED */
const API = "http://vasans.hosting.nyu.edu/experimental/api/";
const ADDITIONAL_PARAMS = "frontend=true&";

const NO_RECENT_ACTIVITY = () => {
  let el = document.createElement("h3");
  el.appendChild(document.createTextNode("No recent activity to be displayed."));
  return el;
}

const NO_GROUPS = () => {
  let el = document.createElement("h3");
  el.appendChild(document.createTextNode("No groups to be displayed."));
  return el;
}

const RESEARCH_GROUP = () => {
  let el = document.createElement("p");
  el.innerHTML = "Are you working with a research group? <a href=\"#\">Register your collaborators</a> now in order to be added to our citation database.";
  return el;
}

const PAST_DAY = () => {
  let el = document.createElement("h2");
  el.appendChild(document.createTextNode("In the last 24 hours"));
  return el;
}

const PAST_WEEK = () => {
  let el = document.createElement("h2");
  el.appendChild(document.createTextNode("In the last week"));
  return el;
}

const FURTHER = () => {
  let el = document.createElement("h2");
  el.appendChild(document.createTextNode("Further back"));
  return el;
}

const ADD_SYMBOL = () => {
  let el = document.createElement("span");
  el.classList.add("activity-symbol");
  let img = document.createElement("img");
  img.src = "https://img.icons8.com/flat_round/50/000000/plus.png";
  el.appendChild(img);
  return el;
}

const EDIT_SYMBOL = () => {
  let el = document.createElement("span");
  el.classList.add("activity-symbol");
  let img = document.createElement("img");
  img.src = "https://img.icons8.com/flat_round/64/000000/available-updates--v1.png";
  el.appendChild(img);
  return el;
}

const DELETE_SYMBOL = () => {
  let el = document.createElement("span");
  el.classList.add("activity-symbol");
  let img = document.createElement("img");
  img.src = "https://img.icons8.com/flat_round/64/000000/delete-sign.png";
  el.appendChild(img);
  return el;
}

const ADD = "added";
const ADD_PROP = "authored";
const EDIT = "edited";
const DELETE = "deleted";

// GROUP CONSTANTS

const NO_MAINTAINERS = () => {
  let el = document.createElement("h3");
  el.appendChild(document.createTextNode("No active maintainers found."));
  return el;
}

const NO_FILTER_LINGS = () => {
  let el = document.createElement("h3");
  el.appendChild(document.createTextNode("No lings matched your filters."));
  return el;
}

const H1 = (inner) => {
  let el = document.createElement("h1");
  el.appendChild(document.createTextNode(inner));
  return el;
}

const H2 = (inner) => {
  let el = document.createElement("h2");
  el.appendChild(document.createTextNode(inner));
  return el;
}

const SPAN = (inner, className) => {
  let el = document.createElement("span");
  el.appendChild(document.createTextNode(inner));
  el.classList.add(className);
  return el;
}

const H_DIVIDER = () => {
  let el = document.createElement("span");
  el.classList.add("h-divider");
  return el;
}

const DESCRIPTION = () => {
  return H2("Description");
}

const MAINTAINERS = () => {
  return H2("Maintainers");
}

const OVERVIEW = () => {
  return H2("Overview");
}

const TABDIV = (inner) => {
  let el = document.createElement("div");
  el.classList.add("tab");
  el.appendChild(inner);
  return el;
}