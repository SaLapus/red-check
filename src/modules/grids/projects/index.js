import "./projects.css";

import { defaultColDef, columnDefs } from "./columns";
import { rowData } from "./rows";
import { DateFilter } from "./filters";

// function showPerson(state) {
//   return (event) => {
//     const red = event.data.nickname;
//     state.changeView("person", { nickname: red });
//   };
// }

export default (state) => {
  const gridOptions = {
    defaultColDef,
    columnDefs,

    rowData: rowData(state.data.projects, state.comments.projects),
    rowSelection: "multiple",
    getRowStyle: (params) => {
      const date = new Date(
        params.node.data.lastUpdate.replace(
          /(\d{2}).(\d{2}).(\d{4})/,
          (_, p1, p2, p3) => {
            return `${p2}/${p1}/${p3}`;
          }
        )
      );

      const range = new Date();
      range.setMonth(range.getMonth() - 6);

      if (date < range) {
        return { "background-color": "lightcoral" };
      }
    },

    context: state.context,

    components: {
      dateFilter: DateFilter,
    },

    // onRowDoubleClicked: showPerson(state),
    onRowClicked: (event) => {
      const project = event.data.project_name;
      const text = state.comments.projects.get(project);

      const input = document.getElementById(state.currentView.id + "Comment");
      input.value = text ?? "";
      input.setAttribute("style", "visibility: visible;");
      input.setAttribute("data-key", project);
      input.focus();
    },
    onGridReady: () => {
      gridOptions.api.setFilterModel({
        lastUpdate: { option: state.context.filters.date.option },
      });
    },
  };

  // Слушатель не убирается при переходе к другому виду, что может стать проблемой
  // Но из-за того, что комментирование используется только на этом виде,
  // то слушатель перезапишется при следующем создании таблицы.
  // Оставляю как есть.

  state.comments.projects.setOnChange("main", (data) => {
    gridOptions.api.getModel().forEachNode((node) => {
      const red = node.data.project_name;
      const text = data.get(red);
      node.setData(Object.assign(node.data, { comment: text }));
    });
  });

  state.context.filters.date.onChange.set("projects", (option) => {
    gridOptions.api.setFilterModel({
      lastUpdate: { option },
    });
  });

  return gridOptions;
};
