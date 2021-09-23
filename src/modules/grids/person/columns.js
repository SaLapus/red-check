import { DateComparator } from "./comparators";

const defaultColDef = {
  sortable: true,
  resizable: true,
};

const columnDefs = (nickname) => [
  {
    headerName: `Обновления ${nickname}`,

    children: [
      {
        headerName: "Название тома",
        field: "volume_name",
        checkboxSelection: true,
        filter: "agTextColumnFilter",
        flex: 3,
      },
      {
        headerName: "ID",
        field: "update_id",
        //  width: 100,
        flex: 1,
      },
      {
        headerName: "Роль",
        field: "activity_type",
        // width: 150,
        flex: 2,
      },
      {
        headerName: "Переводчики",
        field: "translators",
        filter: "agTextColumnFilter",
        // width: 150,
        flex: 2
      },
      {
        headerName: "Дата релиза",
        field: "update_date",
        filter: "dateFilter",
        sort: "desc",
        comparator: DateComparator,
        flex: 3
      },
    ],
  },
];

export { defaultColDef, columnDefs };
