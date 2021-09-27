import { DateComparator } from "./comparators";

const defaultColDef = {
  sortable: true,
  resizable: true,
};

const columnDefs = [
  {
    headerName: "Проект",
    field: "project_name",
    checkboxSelection: true,
    filter: "agTextColumnFilter",
    flex: 3,
  },
  {
    headerName: "Редакторы",
    field: "editors",
    filter: "agTextColumnFilter",
    flex: 2,
  },
  {
    headerName: "Переводчики",
    field: "translators",
    filter: "agTextColumnFilter",
    flex: 2,
  },
  {
    headerName: "Время последнего обновления",
    field: "lastUpdate",
    filter: "dateFilter",
    sort: "desc",
    comparator: DateComparator,
    flex: 2,
  },
  {
    headerName: "Комментарий",
    field: "comment",
    filter: false,
    sort: false,
    flex: 4,
  },
];

export { defaultColDef, columnDefs };
