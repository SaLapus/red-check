/**
 * @typedef ProjectData
 * @type {object}
 * @property {string} status - project status.
 * @property {LastUpdate} lastUpdate - last update information.
 * @property {Volume[]} volumes - volumes info.
 */

/**
 * @typedef LastUpdate
 * @type {object}
 * @property {Date} date - date of last update.
 * @property {string} name - similar to "project_title".
 * @property {string} activityType - member activity.
 */

/**
 * @typedef Volume
 * @type {object}
 *
 * @property {number} projectID - project ID.
 * @property {number} volumeID - volume ID.
 *
 * @property {string} volumeName - volume title.
 *
 * @property {string} url - volume full URL.
 *
 * @property {Member[]} translators - translators of activity information.
 * @property {Member[]} editors - translators of activity information.
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
 * @typedef Member
 * @type {object}
 * @property {string} nickname - member nickname.
 * @property {string} activityType - member activity.
 */

class ProjectsData {
  /** @type {Map<string, ProjectData>} */
  _data = new Map();

  /**
   * @param {string} nickname - member nickname.
   * @param {{status: string, volume: Volume}} project_info - data object with volume info.
   */
  set(name, { status, volume }) {
    let red = this._data.get(name);

    /** @type {LastUpdate} */
    const lastActivity = volume.chapters
      .map((ch) => {
        return {
          name: volume.volumeName,
          date: ch.date,
          editors: volume.editors.map((e) => e.nickname).join(", "),
          translators: volume.translators.map((e) => e.nickname).join(", "),
        };
      })
      .reduce((prev, cur) => {
        return prev.date > cur.date ? prev : cur;
      });

    if (red) {
      if (lastActivity.date > red.lastUpdate.date) red.lastUpdate = lastActivity;
      red.volumes.push(volume);
    } else {
      this._data.set(name, { lastUpdate: lastActivity, status, volumes: [volume] });
    }
  }

  /**
   * @param {string} nickname - member nickname.
   * @returns {RedData} - data object with volume info.
   */
  get(project) {
    return this._data.get(project);
  }

  keys() {
    return this._data.keys();
  }

  values() {
    return this._data.values();
  }

  entries() {
    return this._data.entries();
  }
}

/**
 * @param {object} res - server responce, containing project data.
 */
export default function parseProjectsToReds(res) {
  const reds = new ProjectsData();

  const { data } = res;

  const projects = data.projects.content;

  for (const project of projects) {
    if (["completed"].some((s) => s === project.translationStatus)) continue;
    //freezed ??
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

      const editors = members.filter(
        (m) => m.activityName === "Редактура" || m.activityName === "Вычитка"
      );

      reds.set(project.title, {
        status: project.translationStatus,
        volume: {
          /** @type {number} */
          projectID: project.id,

          /** @type {number} */
          volumeID: volume.id,

          /** @type {string} */
          volumeName: volume.title,

          /** @type {string} */
          url: volume.fullUrl,

          /** @type {Member[]} */
          translators: translator,

          /** @type {Member[]} */
          editors: editors,

          /** @type {Chapter[]} */
          chapters: chapters,
        },
      });
    }
  }

  return reds;
}
