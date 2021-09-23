import { DateComparator } from "./comparators";

const defaultColDef = {
  sortable: true,
  resizable: true,
};

const columnDefs = [
  {
    headerName: "Никнейм",
    field: "nickname",
    checkboxSelection: true,
    filter: "agTextColumnFilter",
    flex: 2,
  },
  {
    headerName: "Роль",
    field: "activityType",
    filter: "agTextColumnFilter",
    flex: 1,
  },
  {
    headerName: "Последнее обновление",
    field: "lastActivity",
    filter: "agTextColumnFilter",
    flex: 3,
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
    flex: 2,
  },
];

export { defaultColDef, columnDefs };
