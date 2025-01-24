export function makeSkillChart(skills) {
  const labels = Object.keys(skills);
  const data = Object.values(skills);
  let skillchart = document.createElement("canvas");
  skillchart.id = "myChart";

  const ctx = skillchart.getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Skill Amounts",
          data: data,
          backgroundColor: [
            "rgb(31, 126, 126)",
            "rgba(255, 99, 133, 0.38)",
            "rgba(1, 250, 42, 0.32)",
            "rgba(247, 177, 0, 0.29)",
            "rgba(195, 0, 255, 0.3)",
          ],
          borderColor: [
            "rgb(31, 126, 126)",
            "rgba(255, 99, 133, 0.38)",
            "rgba(1, 250, 42, 0.32)",
            "rgba(247, 177, 0, 0.29)",
            "rgba(195, 0, 255, 0.3)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "white",
          },
        },
        y: {
          ticks: {
            color: "white",
          },
          beginAtZero: true,
        },
      },
    },
  });
  document.body.appendChild(skillchart);
}
export function makeGradeChart(grade) {
  const labels = Object.keys(grade);
  const data = Object.values(grade);
  let skillchart = document.createElement("canvas");
  skillchart.id = "myGradeChart";

  const ctx = skillchart.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Project Grades",
          data: data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "white",
          },
        },
        y: {
          ticks: {
            color: "white",
          },
          beginAtZero: true,
        },
      },
    },
  });
  document.body.appendChild(skillchart);
}
export function makeAttChart(attempts) {
  const labels = Object.keys(attempts);
  const data = Object.values(attempts);
  let skillchart = document.createElement("canvas");
  skillchart.id = "myattChart";

  const ctx = skillchart.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Most attempts on a Quistion",
          data: data,
          backgroundColor: [
            "rgb(31, 126, 126)",
            "rgba(255, 99, 133, 0.38)",
            "rgba(1, 250, 42, 0.32)",
            "rgba(247, 177, 0, 0.29)",
            "rgba(195, 0, 255, 0.3)",
          ],
          borderColor: [
            "rgb(31, 126, 126)",
            "rgba(255, 99, 133, 0.38)",
            "rgba(1, 250, 42, 0.32)",
            "rgba(247, 177, 0, 0.29)",
            "rgba(195, 0, 255, 0.3)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,

          labels: {
            color: "white",
            
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "white",
          },
        },
        y: {
          ticks: {
            color: "white",
          },
          beginAtZero: true,
        },
      },
    },
  });
  document.body.appendChild(skillchart);
}