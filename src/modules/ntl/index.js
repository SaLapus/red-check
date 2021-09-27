import API from "./api";

import getReds from "./reds";
import getProjects from "./projects";

/**
 * @description
 * return map with reds activities.
 *
 * @returns {Promise<RedsData>} - editors map.
 */
export default async function receiveData() {
  try {
    const data = await API();
    const redsData = getReds(data);
    const projectsData = getProjects(data);

    return { reds: redsData, projects: projectsData };
  } catch (e) {
    console.log(e);
  }
}
