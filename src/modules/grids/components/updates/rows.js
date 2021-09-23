const rowData = (chapters) => {
  return chapters.map((ch) => {
    return {
      chapter_name: ch.name,
      chapter_date: ch.date.toLocaleString(),
    };
  });
};

export { rowData };
