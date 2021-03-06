import "./main.css";

import { defaultColDef, columnDefs } from "./columns";
import { rowData } from "./rows";
import { DateFilter } from "./filters";

function showPerson(state) {
  return (event) => {
    const red = event.data.nickname;
    state.changeView("person", { nickname: red });
  };
}

export default (state) => {
  const gridOptions = {
    defaultColDef,
    columnDefs,

    rowData: rowData(state.data.reds, state.comments.reds),
    rowSelection: "multiple",

    context: state.context,

    components: {
      dateFilter: DateFilter,
    },

    onRowDoubleClicked: showPerson(state),
    onRowClicked: (event) => {
      const red = event.data.nickname;
      const text = state.comments.reds.get(red);

      const input = document.getElementById(state.currentView.id + "Comment");
      input.value = text ?? "";
      input.setAttribute("style", "visibility: visible;");
      input.setAttribute("data-key", red);
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

  state.comments.reds.setOnChange("main", (data) => {
    gridOptions.api.getModel().forEachNode((node) => {
      const red = node.data.nickname;
      const text = data.get(red);
      node.setData(Object.assign(node.data, { comment: text }));
    });
  });

  state.context.filters.date.onChange.set("main", (option) => {
    gridOptions.api.setFilterModel({
      lastUpdate: { option },
    });
  });

  return gridOptions;
};
