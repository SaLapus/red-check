import "./person.css";

import { defaultColDef, columnDefs } from "./columns";
import { rowData } from "./rows";
import { DateFilter } from "./filters";

import Components from "../components/index";

export default (nickname, redInfo, state) => {
  const gridOptions = {
    defaultColDef,
    columnDefs: columnDefs(nickname),

    rowData: rowData(redInfo),
    rowSelection: "multiple",

    components: {
      dateFilter: DateFilter,
    },

    context: state.context,

    onRowClicked: (event) => {
      const personDiv = document.getElementById(state.currentView.id);
      let updatesGrid = document.getElementById("updatesGrid");

      if (updatesGrid) updatesGrid.innerHTML = "";
      else {
        updatesGrid = document.createElement("div");
        updatesGrid.setAttribute("id", "updatesGrid");
        updatesGrid.setAttribute("class", "ag-theme-alpine");
        personDiv.append(updatesGrid);
      }

      const volumeId = event.data.update_id;

      const activity = redInfo.activities.find((act) => act.volumeID === volumeId);
      const gridOptions = Components.Updates(
        activity.volumeName,
        activity.chapters,
        state.context
      );

      // eslint-disable-next-line no-undef
      new agGrid.Grid(updatesGrid, gridOptions);
    },
    onRowDoubleClicked: (event) => {
      const update_id = event.data.update_id;

      let url = "";

      for (const activity of redInfo.activities) {
        for (const chapter of activity.chapters) {
          if (chapter.volumeID === update_id) {
            url = activity.url;
          }
        }
      }

      window.open(`https://${url}`, "_blank").focus();
    },

    onGridReady: () =>
      gridOptions.api.setFilterModel({
        update_date: { option: state.context.filters.date.option },
      }),
  };

  state.context.filters.date.onChange.set("person", (option) => {
    gridOptions.api.setFilterModel({
      update_date: { option },
    });
  });

  return gridOptions;
};
