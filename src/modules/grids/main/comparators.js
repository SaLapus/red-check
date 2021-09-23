function DateComparator(firstDate, secondDate) {
  const dateFix = (dateStr) => {
    return dateStr.replace(/(\d{2}).(\d{2}).(\d{4})/, (_, p1, p2, p3) => {
      return `${p2}/${p1}/${p3}`;
    });
  };
  return new Date(dateFix(firstDate)).getTime() - new Date(dateFix(secondDate)).getTime();
}

export { DateComparator };
