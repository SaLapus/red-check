/**
 * @description
 * set the grid properties of the worksheet
 *
 * @param {Map<string, RedData>} RedsData - map with all editors.
 */
function rowData(RedsData, ProjectComments) {
  const rows = [];

  for (const [project, data] of RedsData.entries()) {
    rows.push({
      project_name: project,
      editors: data.lastUpdate.editors,
      translators: data.lastUpdate.translators,
      lastUpdate: data.lastUpdate.date.toLocaleString(),
      comment: ProjectComments?.get(project) ?? "",
    });
  }
  
  return rows;
}

export { rowData };
