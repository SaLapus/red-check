class DateFilter {
  init(params) {
    this.currentFilterOption = params.context.filters.date.option;
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
      params.context.filters.date.option = parseInt(event.target.value, 10);
    }

    this.input = this.gui.querySelector("#personDateFilterInput");
    this.label = this.gui.querySelector("#personDateFilterLabel");

    this.input.addEventListener("input", listener.bind(this));

    this.filterChangedCallback = params.filterChangedCallback;
  }

  getGui() {
    return this.gui;
  }

  isFilterActive() {
    return true;
  }
  doesFilterPass(params) {
    if (this.filterOptions.length - 1 === parseInt(this.currentFilterOption, 10))
      return true;

    const range = this.filterOptions[this.currentFilterOption].timeRange(new Date());
    const rowDate = new Date(
      params.data.update_date.replace(/(\d{2}).(\d{2}).(\d{4})/, (_, p1, p2, p3) => {
        return `${p2}/${p1}/${p3}`;
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
    this.input.value = "" + option;

    this.currentFilterOption = option;
    this.label.innerText = this.filterOptions[option].name;

    this.filterChangedCallback;
  }
}

export { DateFilter };
