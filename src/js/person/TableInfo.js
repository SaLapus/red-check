const columnDefs = (nickname) => [
  {
    headerName: `Обновления ${nickname}`,

    children: [
      {
        headerName: "Название тома",
        field: "volume_name",
        checkboxSelection: true,
        filter: "agTextColumnFilter",
      },
      { headerName: "ID", field: "update_id", width: 100 },
      { headerName: "Роль", field: "activity_type", width: 150 },
      {
        headerName: "Переводчики",
        field: "translators",
        filter: "agTextColumnFilter",
        width: 150,
      },
      {
        headerName: "Главы",
        children: [
          { headerName: "Название", field: "chapter_name", filter: "agTextColumnFilter" },
          {
            headerName: "Дата релиза",
            field: "chapter_date",
            filter: "agDateColumnFilter",
            sort: "desc",
            comparator: DateComparator,
          },
        ],
      },
    ],
  },
];

const rowData = (redInfo) => {
  return redInfo.activities.flatMap((activity) => {
    return activity.chapters.map((ch) => {
      return {
        volume_name: activity.volumeName,
        update_id: ch.chapterID,
        activity_type: activity.activityType,
        translators: activity.translators.map((tr) => tr.nickname).join(", "),
        chapter_name: ch.name,
        chapter_date: ch.date.toLocaleString(),
      };
    });
  });
};

function DateComparator(firstDate, secondDate) {
  const dateFix = (dateStr) => {
    return dateStr.replace(/(\d{2}).(\d{2}).(\d{4})/, (_, p1, p2, p3) => {
      return `${p2}.${p1}.${p3}`;
    });
  };
  return new Date(dateFix(firstDate)).getTime() - new Date(dateFix(secondDate)).getTime();
}

export default (nickname, redInfo) => {
  return {
    columnDefs: columnDefs(nickname),
    defaultColDef: {
      sortable: true,
      resizable: true,
    },

    rowData: rowData(redInfo),
    rowSelection: "multiple",

    onRowDoubleClicked: (event) => {
      const update_id = event.data.update_id;

      let url = "";

      for (const activity of redInfo.activities) {
        for (const chapter of activity.chapters) {
          if (chapter.chapterID === update_id) {
            url = activity.url;
          }
        }
      }

      window.open(`https://${url}`, "_blank").focus();
    },
  };
};
