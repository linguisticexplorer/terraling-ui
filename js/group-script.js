/* FUNCTIONS */
function activeIfFocus(el, string) {
  if (urlParams.get("focus") && urlParams.get("focus").toLowerCase() === string) {
    focusTab = string;
    el.classList.add("active");
  }
}

function appendTabs(response) {
  let heading = document.createElement("h1");
  heading.appendChild(document.createTextNode(response["group"]));

  sidebar.appendChild(heading);

  let overviewTab = TABDIV(OVERVIEW());
  if (!urlParams.has("focus")) overviewTab.classList.add("active");
  activeIfFocus(overviewTab, "overview");
  overviewTab.dataset.tab = "overview";
  sidebar.appendChild(overviewTab);

  let lingTab = TABDIV(document.createTextNode(response["ling_count"]));
  lingTab.appendChild(H2(pUC(response["ling"])));
  activeIfFocus(lingTab, "ling");
  lingTab.dataset.tab = "ling";
  sidebar.appendChild(lingTab);

  if (depth == 2) {
    let lingletTab = TABDIV(document.createTextNode(response["linglet_count"]));
    lingletTab.appendChild(H2(pUC(response["linglet"])));
    activeIfFocus(lingletTab, "linglet");
    lingletTab.dataset.tab = "linglet";
    sidebar.appendChild(lingletTab);
  }

  let propertyTab = TABDIV(document.createTextNode(response["property_count"]));
  propertyTab.appendChild(H2(pUC("property")));
  activeIfFocus(propertyTab, "property");
  propertyTab.dataset.tab = "property";
  sidebar.appendChild(propertyTab);

  let memberTab = TABDIV(document.createTextNode(response["member_count"]));
  memberTab.appendChild(H2(pUC("member")));
  activeIfFocus(memberTab, "member");
  memberTab.dataset.tab = "member";
  sidebar.appendChild(memberTab);

  let exampleTab = TABDIV(document.createTextNode(response["example_count"]));
  exampleTab.appendChild(H2(pUC("example")));
  activeIfFocus(exampleTab, "example");
  exampleTab.dataset.tab = "example";
  sidebar.appendChild(exampleTab);

  let valueTab = TABDIV(document.createTextNode(response["value_count"]));
  valueTab.appendChild(H2(pUC("value")));
  activeIfFocus(valueTab, "value");
  valueTab.dataset.tab = "value";
  sidebar.appendChild(valueTab);
}

function hashAllBut(focus) {
  if (depth < 2 && focus === "linglet") focus = "ling";

  if (!(focus === "ling")) {
    fetch(API + 'lings/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashLings(data));
  }

  if (!(focus === "linglet")) {
    fetch(API + 'linglets/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashLinglet(data));
  }

  if (!(focus === "property")) {
    fetch(API + 'properties/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashProperties(data))
      .then(propertyHash => loadProperties(propertyHash));
  }

  if (!(focus === "member")) {
    fetch(API + 'members/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashMembers(data))
      .then(memberHash => loadMembers(memberHash));
  }

  if (!(focus === "example")) {
    fetch(API + 'examples/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashExamples(data))
      .then(exampleHash => loadExamples(exampleHash));
  }

  if (!(focus === "value")) {
    fetch(API + 'values/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashValues(data))
      .then(valueHash => loadValues(valueHash));
  }
}

// load the main element first, then deal with the rest later
function loadFocusedElement(response) {
  if (depth < 2 && focusTab === "linglet") focusTab = "ling";

  if (focusTab === "ling") {
    fetch(API + 'lings/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashLings(data))
      .then(lingHash => loadLings(lingHash));

    hashOverview(response);
    hashAllBut(focusTab);
  } else if (focusTab === "linglet") {
    fetch(API + 'linglets/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashLinglet(data))
      .then(lingletHash => loadLinglets(lingletHash));

    hashOverview(response);
    hashAllBut(focusTab);
  } else if (focusTab === "property") {
    fetch(API + 'properties/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashProperties(data))
      .then(propertyHash => loadProperties(propertyHash));

    hashOverview(response);
    hashAllBut(focusTab);
  } else if (focusTab === "member") {
    fetch(API + 'members/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashMembers(data))
      .then(memberHash => loadMembers(memberHash));

    hashOverview(response);
    hashAllBut(focusTab);
  } else if (focusTab === "example") {
    fetch(API + 'examples/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashExamples(data))
      .then(exampleHash => loadExamples(exampleHash));

    hashOverview(response);
    hashAllBut(focusTab);
  } else if (focusTab === "value") {
    fetch(API + 'values/' + urlParams.get("id"))
      .then(response => response.json())
      .then(data => hashValues(data))
      .then(valueHash => loadValues(valueHash));

    hashOverview(response);
    hashAllBut(focusTab);
  } else {
    // default to overview here
    loadOverview(response);
    hashOverview(response);

    hashAllBut(focusTab);
  }
}

function hashOverview(response) {
  overviewHash = {
    "description": response["description"],
    "maintainers": response["maintainers"]
  }

  return overviewHash;
}

function hashLings(response) {
  // split alphabetically
  let lingReduce = {};
  response["lings"].reduce((acc, ling) => {
    let firstLetter = ling["name"].charAt(0).toLocaleUpperCase();

    if (!isLetter(firstLetter)) firstLetter = "*";

    if (!lingReduce[firstLetter]) lingReduce[firstLetter] = [ling];
    else lingReduce[firstLetter].push(ling);
  }, {});

  lingHash = {
    "ling_name": response["ling_name"],
    "lings": lingReduce
  }

  return lingHash;
}

//TODO focus a specific tab
function activateTab(tab) {
  removeAllElementsFrom(container);

  focusTab = tab;
  urlParams.set("focus", tab);
  window.history.pushState("", "", "?" + urlParams.toString());

  document.querySelectorAll(".tab").forEach(tabEl => {
    if (tabEl.dataset.tab === tab) tabEl.classList.add("active");
    else tabEl.classList.remove("active");
  })

  window.scrollTo(0, 0);

  // use tab hash here
  if (tab === "overview") {
    loadOverview(overviewHash);
  } else if (tab === "ling") {
    loadLings(lingHash);
  }
}

// load the required tabs
function loadOverview(response) {
  let heading = H1("Overview");
  container.appendChild(heading);

  container.appendChild(DESCRIPTION());

  let text = document.createElement("p");
  text.appendChild(document.createTextNode(response["description"]));
  container.appendChild(text);

  container.appendChild(MAINTAINERS());


  if (response["maintainers"] && response["maintainers"].length > 0) {
    let card = document.createElement("div");
    card.classList.add("card");

    response["maintainers"].forEach(maintainer => {
      let row = document.createElement("p");

      let link = document.createElement("a");
      link.href = "/user/?id=" + maintainer["user_id"];
      link.innerHTML = maintainer["user"];

      row.appendChild(link);
      row.appendChild(document.createTextNode(" - member of " + maintainer["membership"] + " groups"));

      card.appendChild(row);

      card.appendChild(H_DIVIDER());
    });

    card.removeChild(card.lastChild);

    container.appendChild(card);
  } else {
    container.appendChild(NO_MAINTAINERS());
  }
}

function loadLings(response) {
  let heading = H1(pUC(response["ling_name"]));

  container.appendChild(heading);

  let filter = document.createElement("div");
  filter.classList.add("card", "filter");

  container.appendChild(filter);

  let filterAll = document.createElement("a");
  filterAll.href = "#container";
  filterAll.innerHTML = "ALL";

  filterAll.addEventListener("click", (e) => {
    e.preventDefault();
    filterLings("ALL");
    urlParams.set("filter", "ALL");
    window.history.pushState("", "", "?" + urlParams.toString());
  })

  filter.appendChild(filterAll);

  Object.keys(response["lings"]).forEach(character => {
    let filterLink = document.createElement("a");
    filterLink.href = "#container";
    filterLink.innerHTML = character;

    filterLink.addEventListener("click", (e) => {
      e.preventDefault();
      filterLings(character);
      urlParams.set("filter", character);
      window.history.pushState("", "", "?" + urlParams.toString());
    })

    filter.appendChild(filterLink);

    let lings = response["lings"][character];

    let subheading = H2(character);
    subheading.id = character;

    lingElHash[character] = [subheading]

    let card = document.createElement("div");
    card.classList.add("card");

    lings.forEach(ling => {
      let lingEl = document.createElement("div");
      lingEl.classList.add("ling");

      let name = document.createElement("span");

      let link = document.createElement("a");
      link.href = "#";
      link.innerHTML = ling["name"]

      name.appendChild(link);
      lingEl.appendChild(name);

      lingEl.appendChild(SPAN(ling["completeness"], "completeness"));
      lingEl.appendChild(SPAN(ling["description"], "description"));

      card.appendChild(lingEl);
      card.appendChild(H_DIVIDER());
    });

    card.removeChild(card.lastChild);

    lingElHash[character].push(card);
  });

  filterLings(filterLetter);
}

function filterLings(filterLetter) {
  while (container.childNodes.length > 2) {
    container.removeChild(container.lastChild);
  }

  if (filterLetter && filterLetter.toUpperCase() !== "ALL") {
    let flag = false;

    filterLetter = filterLetter.toUpperCase();
    filterLetter.split(",").forEach(character => {
      if (flag || !lingElHash[character] || lingElHash[character].length < 2) {
        flag = true;
      } else {
        container.appendChild(lingElHash[character][0]);
        container.appendChild(lingElHash[character][1]);
      }
    });

    if (flag) {
      while (container.childNodes.length > 3) {
        container.removeChild(container.lastChild);
      }
      container.appendChild(NO_FILTER_LINGS());
    }
  } else {
    Object.keys(lingElHash).forEach(character => {
      container.appendChild(lingElHash[character][0]);
      container.appendChild(lingElHash[character][1]);
    });
  }
}

function doWork(data) {
  depth = data["depth"];

  appendTabs(data);

  loadFocusedElement(data);

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.tab);
    });
  });

  populateUserNav(data);
}

/* VARIABLES */
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector("#container");


// hashes
var overviewHash = {};
var lingHash = {};
var lingElHash = {};
var lingletHash = {};
var propertyHash = {};
var memberHash = {};
var exampleHash = {};
var valueHash = {};


var urlParams = new URLSearchParams(window.location.search);
var filterLetter = urlParams.get("filter");
let group_id = urlParams.get("id");
var focusTab = "overview";


var depth = 0;

/* RUNTIME LOGIC */
if (group_id) {
  fetch(API + 'group/' + group_id)
    .then(response => response.json())
    .then(data => doWork(data));
}

window.addEventListener("popstate", () => {
  let newParams = new URLSearchParams(location.search);
  filterLetter = newParams.get("filter");
  focus = newParams.get("focus");
  if (focus === "ling") filterLings(filterLetter);
});