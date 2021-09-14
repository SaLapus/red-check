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
    filter: "dateFilter",
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
    state.toPersonView(red, event.context);
  };
}

export default (state) => {
  const gridOptions = {
    columnDefs,
    defaultColDef: {
      sortable: true,
      resizable: true,
    },

    rowData: parseReds(state.data),
    rowSelection: "multiple",

    components: {
      dateFilter: DateFilter,
    },

    context: {
      dateFilter: {
        _option: 5,
        get option() {
          return this._option;
        },
        set option(o) {
          this._option = `${o}`;
          gridOptions.api.setFilterModel({ lastUpdate: { option: `${o}` } });
        },
      },
    },

    onRowDoubleClicked: showPerson(state),
    onGridReady: () =>
      gridOptions.api.setFilterModel({
        lastUpdate: { option: gridOptions.context.dateFilter.option },
      }),
  };

  return gridOptions;
};

class DateFilter {
  // Mandatory methods

  // The init(params) method is called on the filter once. See below for details on the
  // parameters.
  init(params) {
    this.currentFilterOption = params.context.dateFilter.option;
    this.filterOptions = [
      {
        name: "Неделя",
        timeRange: (curDate) => {
          const range = new Date(0);
          range.setHours(24 * 7);

          return new Date(curDate - range);
        },
      },
      {
        name: "Две недели",
        timeRange: (curDate) => {
          const range = new Date(0);
          range.setHours(24 * 7 * 2);

          return new Date(curDate - range);
        },
      },
      {
        name: "Месяц",
        timeRange: (curDate) => {
          const range = new Date(curDate);
          range.setMonth(range.getMonth() - 1);

          return range;
        },
      },
      {
        name: "Два месяца",
        timeRange: (curDate) => {
          const range = new Date(curDate);
          range.setMonth(range.getMonth() - 2);

          return range;
        },
      },
      {
        name: "Полгода",
        timeRange: (curDate) => {
          const range = new Date(curDate);
          range.setMonth(range.getMonth() - 6);

          return range;
        },
      },
      {
        name: "Год",
        timeRange: (curDate) => {
          const range = new Date(curDate);
          range.setFullYear(range.getFullYear() - 1);

          return range;
        },
      },
      {
        name: "Два года",
        timeRange: (curDate) => {
          const range = new Date(curDate);
          range.setFullYear(range.getFullYear() - 2);

          return range;
        },
      },
      { name: "Все время" },
    ];

    this.gui = document.createElement("div");
    this.gui.innerHTML = `
    <div
      id="mainDateFilterDiv"
      class="dateFilterDiv"
    >
      <input
        type="range"
        id="mainDateFilterInput"
        class="dateFilterInput"
        name="mainDate"
        min="0"
        value="${this.currentFilterOption}"
        max="${this.filterOptions.length - 1}"
        step="1"
      >
      <label
        id="mainDateFilterLabel"
        class="dateFilterLabel"
      >
        ${this.filterOptions[this.currentFilterOption].name}
      </label>
    </div>`;

    function listener(event) {
      params.context.dateFilter.option = event.target.value;
    }

    this.label = this.gui.querySelector("#mainDateFilterLabel");
    this.input = this.gui.querySelector("#mainDateFilterInput");
    this.input.addEventListener("input", listener.bind(this));

    this.filterChangedCallback = params.filterChangedCallback;
    params.filterChangedCallback();
  }

  // Returns the DOM element for this filter
  getGui() {
    return this.gui;
  }

  // Return true if the filter is active. If active then 1) the grid will show the filter icon in the column
  // header and 2) the filter will be included in the filtering of the data.
  isFilterActive() {
    return true;
  }

  // The grid will ask each active filter, in turn, whether each row in the grid passes. If any
  // filter fails, then the row will be excluded from the final set. A params object is supplied
  // containing attributes of node (the rowNode the grid creates that wraps the data) and data (the data
  // object that you provided to the grid for that row).
  doesFilterPass(params) {
    if (this.filterOptions.length - 1 === parseInt(this.currentFilterOption, 10))
      return true;

    const range = this.filterOptions[this.currentFilterOption].timeRange(new Date());
    const rowDate = new Date(
      params.data.lastUpdate.replace(/(\d{2}).(\d{2}).(\d{4})/, (_, p1, p2, p3) => {
        return `${p2}.${p1}.${p3}`;
      })
    );

    return rowDate > range;
  }

  getModel() {
    return {
      option: this.currentFilterOption,
    };
  }

  setModel({ option }) {
    if (option === "default") this.filterChangedCallback;
    else {
      const opt = parseInt(option, 10);
      if (!isNaN(opt)) {
        this.currentFilterOption = this.input.value = option;
        this.label.innerText = this.filterOptions[option].name;
        this.filterChangedCallback;
      }
    }
  }
}
