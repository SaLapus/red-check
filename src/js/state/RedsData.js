import metaQuery from "../../querys/projects.meta.txt";
import infoQuery from "../../querys/projects.txt";

/**
 * @description
 * get NTL Projects metadata.
 *
 * @returns {Promise<number>} - number of projects.
 */
async function getProjectsMeta() {
  try {
    const headers = new Headers();
    headers.append("content-type", "text/plain");
    const req = fetch("https://api.novel.tl/api/site/v2/graphql", {
      method: "POST",
      body: JSON.stringify({
        operationName: "Projects",
        variables: { id: 1 },
        query: metaQuery,
      }),
      headers,
    });

    return req.then(async (res) => {
      const { data } = await res.json();
      return data.projects.totalElements;
    });
  } catch (e) {
    console.error(e);
  }
}

/**
 * @description
 * get NTL Projects data.
 *
 * @returns {Promise<number>} - number of projects.
 */
async function getProjects(elements) {
  try {
    const headers = new Headers();
    headers.append("content-type", "text/plain");
    const req = fetch("https://api.novel.tl/api/site/v2/graphql", {
      method: "POST",
      body: JSON.stringify({
        operationName: "Projects",
        variables: { number: 10 },
        query: infoQuery,
      }),
      headers,
    });

    return req.then(async (res) => {
      return res.json();
    });
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param {object} res - server responce, containing project data.
 */
function parseProjectsData(res) {
  const reds = new RedsData();

  const { data } = res;

  const projects = data.projects.content;

  for (const project of projects) {
    const volumes = project.volumes.content;

    for (const volume of volumes) {
      const members = volume.staff;
      const chapters = volume.chapters
        .filter((ch) => ch.publishDate != null)
        .map((ch) => {
          return {
            volumeID: ch.volumeId,
            chapterID: ch.id,
            name: ch.title,
            date: new Date(ch.publishDate),
          };
        });

      if (!(chapters && chapters.length >= 1)) continue;

      const translator = members.filter(
        (m) =>
          m.activityName === "Перевод с английского" ||
          m.activityName === "Перевод с японского" ||
          m.activityName === "Перевод с китайского"
      );

      for (const member of members) {
        if (member.activityName !== "Редактура" && member.activityName !== "Вычитка")
          continue;

        reds.set(member.nickname, {
          /** @type {number} */
          projectID: project.id,

          /** @type {number} */
          volumeID: volume.id,

          /** @type {string} */
          projectName: project.title,

          /** @type {string} */
          volumeName: volume.title,

          /** @type {string} */
          url: volume.fullUrl,

          /** @type {string} */
          activityType: member.activityName,

          /** @type {Translator[]} */
          translators: translator,

          /** @type {Chapter[]} */
          chapters: chapters,
        });
      }
    }
  }

  return reds;
}

/**
 * @typedef RedData
 * @type {object}
 * @property {LastUpdate} lastUpdate - last update information.
 * @property {Activity[]} activities - similar to "project_title + volume_title".
 */

/**
 * @typedef LastUpdate
 * @type {object}
 * @property {Date} date - date of last update.
 * @property {string} name - similar to "project_title + volume_title".
 * @property {string} activityType - member activity.
 */

/**
 * @typedef Activity
 * @type {object}
 *
 * @property {number} projectID - project ID.
 * @property {number} volumeID - volume ID.
 *
 * @property {string} projectName - project title.
 * @property {string} volumeName - volume title.
 * @property {string} url - volume full URL.
 * @property {string} activityType - member activity.
 *
 * @property {Translator[]} translators - translators of activity information.
 *
 * @property {Chapter[]} chapters
 */

/**
 * @typedef Chapter
 * @type {object}
 * @property {number} volumeID - chapter's volume ID.
 * @property {number} chapterID - chapter ID.
 * @property {string} name - chapter name.
 * @property {Date} date - date, chapter updated at.
 */

/**
 * @typedef Translator
 * @type {object}
 * @property {string} nickname - member nickname.
 * @property {string} activityType - member activity.
 */

class RedsData {
  /** @type {Map<string, RedData>} */
  _data = new Map();

  /**
   * @param {string} nickname - member nickname.
   * @param {Activity} activity - data object with activity info.
   */
  set(nickname, activity) {
    let red = this._data.get(nickname);

    /** @type {LastUpdate} */
    const lastActivity = activity.chapters
      .map((ch) => {
        return {
          name: activity.volumeName,
          date: ch.date,
          activityType: activity.activityType,
        };
      })
      .reduce((prev, cur) => {
        return prev.date > cur.date ? prev : cur;
      });

    if (red) {
      if (lastActivity > red.lastUpdate) red.lastUpdate = lastActivity;
      red.activities.push(activity);
    } else red = { lastUpdate: lastActivity, activities: [activity] };

    this._data.set(nickname, red);
  }

  /**
   * @param {string} nickname - member nickname.
   * @returns {RedData} - data object with activity info.
   */
  get(nickname) {
    return this._data.get(nickname);
  }

  entries() {
    return this._data.entries();
  }
}

/**
 * @description
 * return map with reds activities.
 *
 * @returns {Promise<RedsData>} - editors map.
 */
export default async function receiveData() {
  try {
    const number = await getProjectsMeta();
    const projectsData = await getProjects(number);
    return parseProjectsData(projectsData);
  } catch (e) {
    console.log(e);
  }
}
