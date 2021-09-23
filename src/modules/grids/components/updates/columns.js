import { DateComparator } from "./comparators";

const defaultColDef = {
  sortable: true,
  resizable: true,
};

const columnDefs = (volumeName) => [
  {
    headerName: volumeName,
    children: [
      {
        headerName: "Название",
        field: "chapter_name",
        checkboxSelection: true,
        filter: "agTextColumnFilter",
        flex: 1
      },
      {
        headerName: "Дата релиза",
        field: "chapter_date",
        filter: "dateFilter",
        sort: "desc",
        comparator: DateComparator,
        flex: 1
      },
    ],
  },
];

export { defaultColDef, columnDefs };
