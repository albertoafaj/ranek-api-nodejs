const getTimestamp = () => {
  const today = new Date();
  const isLessThanTen = (num) => ((num < 10) ? `0${num}` : num);
  const yy = today.getFullYear();
  const mm = isLessThanTen(today.getMonth() + 1);
  const dd = isLessThanTen(today.getDate());
  const hh = isLessThanTen(today.getHours());
  const ms = isLessThanTen(today.getMinutes());
  const ss = isLessThanTen(today.getSeconds());
  const tz = today.getTimezoneOffset() / 60;
  return `${yy}-${mm}-${dd} ${hh}:${ms}:${ss} ${(tz < 0) ? `-${tz}` : `+${tz}`}:00`;
};

module.exports = getTimestamp;
