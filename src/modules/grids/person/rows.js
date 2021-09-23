const rowData = (redInfo) => {
  return redInfo.activities.map((activity) => {
    return {
      volume_name: activity.volumeName,
      update_id: activity.volumeID,
      activity_type: activity.activityType,
      translators: activity.translators.map((tr) => tr.nickname).join(", "),
      update_date: activity.chapters
        .map((ch) => ch.date)
        .reduce((acc, cur) => (acc > cur ? acc : cur))
        .toLocaleString(),
    };
  });
};

export { rowData };
