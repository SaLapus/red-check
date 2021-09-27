import metaQuery from "./querys/projects.meta.txt";
import infoQuery from "./querys/projects.txt";

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
 * @returns {Promise<Object>} - projects data.
 */
export default async function getProjects() {
  try {
    const elements = await getProjectsMeta();

    const headers = new Headers();
    headers.append("content-type", "text/plain");
    const req = fetch("https://api.novel.tl/api/site/v2/graphql", {
      method: "POST",
      body: JSON.stringify({
        operationName: "Projects",
        variables: { number: elements },
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
