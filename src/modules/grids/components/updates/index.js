import "./updates.css";

import { defaultColDef, columnDefs } from "./columns";
import { rowData } from "./rows";
import { DateFilter } from "./filters";

export default (volumeName, chapters, context) => {
  const gridOptions = {
    defaultColDef,
    columnDefs: columnDefs(volumeName, chapters),

    rowData: rowData(chapters),
    rowSelection: "multiple",

    components: {
      dateFilter: DateFilter,
    },

    context,

    onGridReady: () =>
      gridOptions.api.setFilterModel({
        chapter_date: { option: context.filters.date.option },
      }),
  };

  context.filters.date.onChange.set("updates", (option) => {
    gridOptions.api.setFilterModel({
      chapter_date: { option },
    });
  });

  return gridOptions;
};
