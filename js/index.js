document.addEventListener("DOMContentLoaded", function () {
  const discordWebhook =
    "https://discord.com/api/webhooks/797857027279028255/1TaP_pqUiqZDh1OBbFNsqNjSirbl-HcD1LKwqAkaUwOmRX6psZA_ni1J52GMxVkqHtvj";

  const portfolioSection = document.getElementById("portfolio");
  const skillsSection = document.getElementById("skills");
  const skillAside = document.querySelector("#skills aside");
  const messageContent = document.getElementById("messageContent");
  const messageAuthor = document.getElementById("messageAuthor");
  const messageButton = document.getElementById("messageButton");

  let skills = [];
  let projects = [];

  fetchData("projects")
    .then((data) => {
      projects = data;
      printProjects();
    })
    .catch(console.error);

  fetchData("skills")
    .then((data) => {
      skills = data;
      printSkills();
      printSkillDetails("javascript");
    })
    .catch(console.error);

  messageButton.onclick = () => {
    let name = messageAuthor.value.trim();
    const text = messageContent.value.trim();

    if (text.length === 0) {
      return;
    }

    if (name.length === 0) {
      name = "someone";
    }

    sendWebhook(name, text);
    messageContent.value = "Envoyé !";
    setTimeout(() => {
      messageContent.value = "";
    }, 1000);
  };

  // ***** Functions *****

  function sendWebhook(name = "someone", message) {
    fetch(discordWebhook, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `:envelope_with_arrow: Message from **${name}**\n> ${message}`,
      }),
    }).catch(console.error);
  }

  function fetchData(filename) {
    return new Promise((resolve, reject) => {
      fetch(`./data/${filename}.json`, { mode: "cors" })
        .then((data) => data.json().then(resolve).catch(reject))
        .catch(reject);
    });
  }

  function printSkillDetails(id) {
    skillAside.innerHTML = "";
    const skill = findSkill(id);

    skillAside.appendChild(
      elt("img", { src: `assets/logos/${skill.id}.logo.svg`, alt: skill.name + " logo" })
    );

    const article = elt(
      "article",
      {},
      {},
      elt("h4", {}, {}, skill.name),
      elt("p", {}, {}, skill.description)
    );
    let usesElt;
    if (skill.uses) {
      usesElt = elt("p", { class: "usage-links" }, {}, " See ");

      for (let use of Object.getOwnPropertyNames(skill.uses)) {
        usesElt.appendChild(
          elt("a", { class: "inline", href: `https://github.com/${skill.uses[use]}` }, {}, use)
        );
      }

      article.appendChild(usesElt);
    }

    skillAside.appendChild(article);
  }

  function printSkills() {
    for (let category of Object.getOwnPropertyNames(skills)) {
      const article = elt("article", {}, {}, elt("h3", {}, {}, category));
      for (let group of skills[category]) {
        let groupElt = elt("div", { class: "skills-group" });

        for (let skill of group) {
          groupElt.appendChild(
            elt(
              "img",
              {
                src: `assets/logos/${skill.id}.logo.svg` || "",
                title: skill.name,
                alt: "Logo" + skill.name,
              },
              {
                onclick: () => {
                  printSkillDetails(skill.id);
                  if (window.innerWidth <= 700) {
                    skillAside.scrollIntoView();
                  }
                },
              }
            )
          );
        }
        article.appendChild(groupElt);
      }
      skillsSection.appendChild(article);
    }
  }

  function printProjects() {
    for (let project of projects) {
      let projectElt = elt(
        "a",
        { href: `https://github.com/${project.repository}`, class: "project", target: "_blank" },
        {},
        elt("img", { src: project.image || "", alt: "Projet " + project.name }),
        elt(
          "article",
          {},
          {},
          elt("h3", {}, {}, project.name),
          elt("h4", {}, {}, project.subtitle),
          elt("p", {}, {}, project.description)
        )
      );

      if (project.skills.length) {
        const skillsElt = elt("p", { class: "project-skills" });
        for (const skill of project.skills) {
          const skillElt = elt("span", {}, {}, skill);
          skillsElt.appendChild(skillElt);
        }
        projectElt.lastChild.appendChild(skillsElt);
      }

      portfolioSection.appendChild(projectElt);
    }
  }

  function findSkill(id) {
    for (let category of Object.getOwnPropertyNames(skills)) {
      for (let group of skills[category]) {
        let skill = group.find((skill) => skill.id === id);
        if (skill) {
          return skill;
        }
      }
    }
    return null;
  }

  function elt(tag, attributes = {}, properties = {}, ...children) {
    const res = document.createElement(tag);

    for (let attr of Object.getOwnPropertyNames(attributes)) {
      res.setAttribute(attr, attributes[attr]);
    }

    for (let prop of Object.getOwnPropertyNames(properties)) {
      res[prop] = properties[prop];
    }

    for (let child of children) {
      if (!child) {
        continue;
      }
      if (typeof child != "string") {
        res.appendChild(child);
      } else {
        res.appendChild(document.createTextNode(child));
      }
    }
    return res;
  }
});
