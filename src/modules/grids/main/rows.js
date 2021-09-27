/**
 * @description
 * set the grid properties of the worksheet
 *
 * @param {Map<string, RedData>} RedsData - map with all editors.
 * @param {Map<string, Comment>} RedsComments - map with all editors comments.
 */
function rowData(RedsData, RedsComments) {
  const rows = [];

  for (const [nickname, data] of RedsData.entries()) {
    rows.push({
      nickname,
      activityType: data.lastUpdate.activityType,
      lastUpdate: data.lastUpdate.date.toLocaleString(),
      lastActivity: data.lastUpdate.name,
      comment: RedsComments.get(nickname) ?? "",
    });
  }
  
  return rows;
}

export { rowData };
