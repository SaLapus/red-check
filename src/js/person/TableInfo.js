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
            filter: "dateFilter",
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

export default (nickname, redInfo, context) => {
  const gridOptions = {
    columnDefs: columnDefs(nickname),
    defaultColDef: {
      sortable: true,
      resizable: true,
    },

    rowData: rowData(redInfo),
    rowSelection: "multiple",
    components: {
      dateFilter: DateFilter,
    },

    context,

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
    onGridReady: () =>
      gridOptions.api.setFilterModel({
        chapter_date: { option: gridOptions.context.dateFilter.option },
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
      id="personDateFilterDiv"
      class="dateFilterDiv"
    >
      <input
        type="range"
        id="personDateFilterInput"
        class="dateFilterInput"
        name="personDate"
        min="0"
        value="${this.currentFilterOption}"
        max="${this.filterOptions.length - 1}"
        step="1"
      >
      <label
        id="personDateFilterLabel"
        class="dateFilterLabel"
        for="personDate"
      >
        ${this.filterOptions[this.currentFilterOption].name}
      </label>
    </div>`;

    function listener(event) {
      const label = document.getElementById("personDateFilterLabel");
      label.innerText = this.filterOptions[event.target.value].name;

      this.currentFilterOption = event.target.value;
      params.context.dateFilter.option = event.target.value;

      params.filterChangedCallback();
    }

    this.input = this.gui.querySelector("#personDateFilterInput");
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
      params.data.chapter_date.replace(/(\d{2}).(\d{2}).(\d{4})/, (_, p1, p2, p3) => {
        return `${p2}.${p1}.${p3}`;
      })
    );

    return rowDate > range;
  }

  setModel({ option }) {
    if (option === "default") this.filterChangedCallback;
    else {
      const opt = parseInt(option, 10);
      if (!isNaN(opt)) {
        this.currentFilterOption = option;
        this.filterChangedCallback;
      }
    }
  }
}
