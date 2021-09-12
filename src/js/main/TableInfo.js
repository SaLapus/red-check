const columnDefs = [
  {
    headerName: "Никнейм",
    field: "nickname",
    checkboxSelection: true,
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Роль",
    field: "activityType",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Последнее обновление",
    field: "lastActivity",
    filter: "agTextColumnFilter",
    width: 400,
  },
  {
    headerName: "Время последнего обновления",
    field: "lastUpdate",
    filter: "agDateColumnFilter",
    sort: "desc",
    comparator: DateComparator,
    width: 400,
  },
];

function DateComparator(firstDate, secondDate) {
  const dateFix = (dateStr) => {
    return dateStr.replace(/(\d{2}).(\d{2}).(\d{4})/, (_, p1, p2, p3) => {
      return `${p2}.${p1}.${p3}`;
    });
  };
  return new Date(dateFix(firstDate)).getTime() - new Date(dateFix(secondDate)).getTime();
}

/**
 * @description
 * set the grid properties of the worksheet
 *
 * @param {Map<string, RedData>} RedsData - map with all editors.
 */
function parseReds(RedsData) {
  const rows = [];
  
  for (const [nickname, data] of RedsData.entries()) {
    rows.push({
      nickname,
      activityType: data.lastUpdate.activityType,
      lastUpdate: data.lastUpdate.date.toLocaleString(),
      lastActivity: data.lastUpdate.name,
    });
  }

  return rows;
}

function showPerson(state) {
  return (event) => {
    const red = event.data.nickname;
    state.toPersonView(red);
  };
}

export default (state) => {
  return {
    columnDefs,
    defaultColDef: {
      sortable: true,
      resizable: true,
    },

    rowData: parseReds(state.data),
    rowSelection: "multiple",

    onRowDoubleClicked: showPerson(state),
  };
};
