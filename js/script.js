/* VARIABLES */
var hasActivity = false; // we check if there is any recent activity
var activityContainer = document.querySelector("#activity");

var hasGroup = false; // we check if there are any groups
var groupContainer = document.querySelector(".sidebar");

/* FUNCTIONS */
// deal with activity JSON
function appendActivityJson(response) {

  if (response["recent_activity"] && response["recent_activity"]["past_day"])
    populatePastDay(response["recent_activity"]["past_day"]);

  if (response["recent_activity"] && response["recent_activity"]["past_week"])
    populatePastWeek(response["recent_activity"]["past_week"]);

  if (response["recent_activity"] && response["recent_activity"]["further_back"])
    populateFurtherBack(response["recent_activity"]["further_back"]);

  if (!hasActivity) activityContainer.appendChild(NO_RECENT_ACTIVITY());
}

function populatePastDay(response) {
  if (response == null || response.length == 0) return;

  hasActivity = true;

  activityContainer.append(PAST_DAY());
  let card = document.createElement("div");
  card.classList.add("card", "activity-card");
  card.id = "past-day";

  response.forEach((activity, index) => {
    let el = document.createElement("div");
    el.classList.add("activity");
    if (index == response.length - 1) el.classList.add("last");

    // build activity
    buildActivity(el, activity);

    card.appendChild(el);
  });

  activityContainer.appendChild(card);
}

function populatePastWeek(response) {
  if (response == null || response.length == 0) return;

  hasActivity = true;

  activityContainer.append(PAST_WEEK());
  let card = document.createElement("div");
  card.classList.add("card", "activity-card");
  card.id = "past-week";

  response.forEach((activity, index) => {
    let el = document.createElement("div");
    el.classList.add("activity");
    if (index == response.length - 1) el.classList.add("last");

    // build activity
    buildActivity(el, activity);

    card.appendChild(el);
  });

  activityContainer.appendChild(card);
}

function populateFurtherBack(response) {
  if (response == null || response.length == 0) return;

  hasActivity = true;

  activityContainer.append(FURTHER());
  let card = document.createElement("div");
  card.classList.add("card", "activity-card");
  card.id = "further-back";

  response.forEach((activity, index) => {
    let el = document.createElement("div");
    el.classList.add("activity");
    if (index == response.length - 1) el.classList.add("last");

    // build activity
    buildActivity(el, activity);

    card.appendChild(el);
  });

  activityContainer.appendChild(card);
}

function buildActivity(el, activity) {
  appendAction(el, activity["action"]);

  appendHeader(el, activity);

  appendContext(el, activity);
}

// append add/edit/delete symbol
function appendAction(el, action) {
  if (action === "add") el.appendChild(ADD_SYMBOL());
  else if (action === "edit") el.appendChild(EDIT_SYMBOL());
  else if (action === "delete") el.appendChild(DELETE_SYMBOL());
}

// append action header
function appendHeader(el, activity) {
  let header = document.createElement("h4");

  let link = document.createElement("a");
  link.href = "#";
  link.innerHTML = activity["author"];

  header.appendChild(link);

  let text = " ";

  if (activity["action"] === "add") {
    if (activity["target"] === "property") text += ADD_PROP;
    else text += ADD;
  } else if (activity["action"] === "edit") text += EDIT;
  else if (activity["action"] === "delete") text += DELETE;

  text += " " + activity["count"] + " ";
  text += pLC(activity["target"], activity["count"]);

  if (activity["target"] === "value") {
    text += " in " + activity["ling_count"] + " " + pLC(activity["ling_name"], activity["ling_count"]) + " (";
  } else {
    text += " (";
  }

  header.appendChild(document.createTextNode(text));

  appendTargetString(header, activity);

  header.appendChild(document.createTextNode(")"));

  el.appendChild(header);
}

// append action context
function appendContext(el, activity) {
  let context = document.createElement("span");
  context.classList.add("activity-context");
  context.appendChild(document.createTextNode("in "));

  let link = document.createElement("a");
  link.href = "group/?" + ADDITIONAL_PARAMS + "id=" + activity["group_id"];
  link.innerHTML = activity["group"];

  context.appendChild(link);

  el.appendChild(context);
}

function appendTargetString(el, activity) {
  let keyword = "";
  let keyword_singular = "";

  if (activity["target"] === "ling" || activity["target"] === "value") {
    keyword = "lings";
    keyword_singular = "ling";
  } else if (activity["target"] === "property") {
    keyword = "properties";
    keyword_singular = "property";
  }

  let items = activity[keyword];

  let link = document.createElement("a");
  link.href = "#";
  link.innerHTML = items[0][keyword_singular];

  el.appendChild(link);

  if (items.length == 2) {
    el.appendChild(document.createTextNode(" and "));

    let link1 = document.createElement("a");
    link1.href = "#";
    link1.innerHTML = items[1][keyword_singular];

    el.appendChild(link1);
  } else if (items.length > 2) {
    el.appendChild(document.createTextNode(", "));

    let link1 = document.createElement("a");
    link1.href = "#";
    link1.innerHTML = items[1][keyword_singular];

    el.appendChild(link1);

    el.appendChild(document.createTextNode(", and "));

    let link2 = document.createElement("a");
    link2.href = "#";
    link2.innerHTML = (activity["count"] - 2) + " more";

    el.appendChild(link2);
  }
}

function appendGroupJson(response) {
  populateUserNav(response);

  if (response["groups"]) {
    let ul = document.createElement("ul");

    response["groups"].forEach(group => {
      let li = document.createElement("li");

      let card = document.createElement("div");
      card.classList.add("card");

      let heading = document.createElement("h3");

      let groupName = document.createElement("a");
      groupName.href = "group/?" + ADDITIONAL_PARAMS + "id=" + group["group_id"];
      groupName.innerHTML = group["group"];

      heading.appendChild(groupName);
      card.appendChild(heading);

      if (group["activity"]) {
        group["activity"].forEach(activity => {
          let p = document.createElement("p");

          let span = document.createElement("span");
          span.classList.add("new-group-info");
          span.innerHTML = activity["count"] + " " + pastAction(activity["action"]) + " " + (activity["target"] === "ling" ? pLC(activity["ling_name"], activity["count"]) : pLC(activity["target"], activity["count"]));

          p.appendChild(span);

          card.appendChild(p);
        });
      }

      li.appendChild(card);
      ul.appendChild(li);
    });

    groupContainer.appendChild(ul);

    if (!response["research_groups"]) groupContainer.appendChild(RESEARCH_GROUP());
  } else groupContainer.appendChild(NO_GROUPS());
}

/* RUNTIME LOGIC */

let urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("noapi")) {
  fetch(API + 'blank')
    .then(response => response.json())
    .then(data => appendActivityJson(data));

  fetch(API + 'blank')
    .then(response => response.json())
    .then(data => appendGroupJson(data));
} else {
  fetch(API + 'recent-activity')
    .then(response => response.json())
    .then(data => appendActivityJson(data));

  fetch(API + 'user')
    .then(response => response.json())
    .then(data => appendGroupJson(data));
}