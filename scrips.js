import { loginTemp } from "./temps/login.js";
import { main } from "./temps/main.js";
import {
  makeGradeChart,
  makeSkillChart,
  makeAttChart,
} from "./temps/charts.js";
///////////////////////////////////////////
/////// copy this to the terminal/////////
///////// npm install chart.js ///////////
/////// a package for crating charts//////
//////////////////////////////////////////


// https://m-mocha1.github.io/Graphql/
const jwt = "https://adam-jerusalem.nd.edu/api/auth/signin";
const url = "https://adam-jerusalem.nd.edu/api/graphql-engine/v1/graphql";
let tok;
//--------testing------------------
let progressArr = [];
let attempts;

let goProjectNames = [
  "go-reloaded",
  "ascii-art",
  "ascii-art-reverse",
  "ascii-art-color",
  "ascii-art-output",
  "ascii-art-fs",
  "ascii-art-justify",
  "ascii-art-web",
  "ascii-art-web-stylize",
  "ascii-art-web-dockerize",
  "ascii-art-web-exportfile",
  "groupie-tracker",
  "groupie-tracker-searchbar",
  "groupie-tracker-filters",
  "groupie-tracker-gelocalization",
  "groupie-tracker-visualizations",
  "lem-in",
  "forum",
  "forum-image-upload",
  "forum-authentication",
  "forum-moderation",
  "forum-advanced-features",
  "net-cat",
  "wget",
];

let jsProjectNames = [
  "make-your-game",
  "make-your-game-score-handling",
  "make-your-game-history",
  "make-your-game-different-maps",
  "real-time-forum",
  "real-time-forum-typing-in-progress",
  "graphql",
  "social-network",
  "social-network-cross-platform-appimage",
  "mini-framework",
  "bomberman-dom",
];

let allProjectNames = goProjectNames.concat(jsProjectNames);
let lengthOfProjectNames = allProjectNames.length;
//---------------------------------------------

//my token
// let t = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4NjkiLCJpYXQiOjE3MzcwNDgwMTgsImlwIjoiMTcyLjE4LjAuMiIsImV4cCI6MTczNzEzNDQxOCwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtY2FtcHVzZXMiOiJ7fSIsIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiODY5IiwieC1oYXN1cmEtdG9rZW4taWQiOiJhM2FkNWQ4YS05MmE3LTRjNjUtODdjOS1hZmVhN2VjZDVmYjEifX0.z7pNUrG3mb33PBWUNVMZ088SqWY5EeDCKmR-O7AUmE0`;
function login() {
  document.body.innerHTML = loginTemp;
  // fetching the jwt for the user
  document.getElementById("loginB").addEventListener("click", function (press) {
    press.preventDefault();
    // const username = document.getElementById("user").value;
    // const password = document.getElementById("pass").value;

    const username = "mhadmare";
    const password = "Mnd1998.";



    const encodedCredentials = btoa(`${username}:${password}`);
    fetch(jwt, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      if (resp.ok) {
        tok = resp.json();
        tok.then((resolvedToken) => {
          tok = resolvedToken;
          getuserdata(resolvedToken);
        });
      } else {
        console.log("error", resp.status);
      }
    });
  });
}

login();
function getuserdata(token) {
  let res = 0;
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
                user,{
                    id
                    login
                }
                    xp_view {
                    amount
                  }
            }`,
    }),
  })
    .then((resp) => resp.json())
    .then((user) => {
      res = user.data.xp_view.reduce((sum, item) => sum + item.amount, 0);
      mainPage(user.data.user[0].id, user.data.user[0].login, res);
    })
    .catch((err) => console.log(err, "err"));
  getSkills(token);
  getProgressData(token);
  attempts = getAttemptsData(token);
}

function mainPage(id, username, totalXp) {
  ChangeCss("main.css");

  document.body.innerHTML = main;
  let uID = document.createElement("h1");
  uID.innerText = `${id} ${username} XP-${totalXp}`;
  document.getElementById("userinfo").appendChild(uID);
}
function ChangeCss(name) {
  const oldcss = document.getElementById("dc");
  if (oldcss) {
    oldcss.remove();
  }
  let link = document.createElement("link");
  link.id = "dc";
  link.rel = "stylesheet";
  link.href = name;
  document.head.appendChild(link);
}

function getSkills(token) {
  let skills;
  let gradesPro;
  let attemptsMap;
  getProgressData(token);

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
    transaction(
      where: {
        type: { _ilike: "%skill%" }
      }
    ) {
      type
      amount
      objectId
      object {
        name
      }
      createdAt
      path
    }
  }`,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      skills = createAskillsMap(response.data.transaction);
      gradesPro = createAGradeMap(progressArr);
    });

  setTimeout(() => {
    attemptsMap = createAttemptsMap(attempts);
    makeGradeChart(gradesPro);
    makeSkillChart(skills);
    makeAttChart(attemptsMap)
  }, 1000);
}
function createAskillsMap(data) {
  const skillMap = data.reduce((acc, obj) => {
    const { type, amount } = obj;
    acc[type] = (acc[type] || 0) + amount;
    return acc;
  }, {});
  const sortedSkills = Object.entries(skillMap)
    .sort(([, a], [, b]) => b - a) // Sort by value in descending order
    .slice(0, 5); // Get the top 5 entries

  const topSkillsMap = Object.fromEntries(sortedSkills);

  return topSkillsMap;
}
function createAGradeMap(data) {
  console.log("🚀 ~ createAGradeMap ~ data:", data);
  const gradMap = data.reduce((acc, obj) => {
    const { object, grade } = obj;
    const type = object.name;
    acc[type] = (acc[type] || 0) + grade;
    return acc;
  }, {});
  return gradMap;
}
function createAttemptsMap(data) {
  console.log("🚀 ~ createAttemptsMap ~ data:", data);
  // Reduce to calculate the total attempts for each name
  const attempts = data.reduce((acc, obj) => {
    const { object } = obj; // Extract the `object` property
    const name = object.name; // Extract the name
    acc[name] = (acc[name] || 0) + 1; // Increment the count for the name
    return acc;
  }, {});

  // Convert the object to an array of [name, attempts] pairs and sort
  const sortedAttempts = Object.entries(attempts)
    .sort(([, a], [, b]) => b - a) // Sort in descending order of attempts
    .slice(0, 10); // Take the top 10

  // Convert back to an object if needed
  const topAttempts = Object.fromEntries(sortedAttempts);

  console.log("🚀 ~ createAttemptsMap ~ topAttempts:", topAttempts);
  return topAttempts;
}
function getProgressData(token) {
  for (let i = lengthOfProjectNames - 1; i >= 0; i--) {
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer  ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
  progress (
    where: {
      object: { name: { _eq: "${allProjectNames[i]}" } }
    }
  ) {
    object {
      name
    }
    grade
    createdAt
    updatedAt
  }
}`,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response["data"]["progress"].length != 0) {
          progressArr.push(response["data"]["progress"][0]);
        }
      });
  }
  return progressArr;
}
function getAttemptsData(token) {
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer  ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {     
  progress {
    object {
      name
    }
  }
}`,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      attempts = response.data.progress;
    });
}
