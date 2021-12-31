exports.getCurrency = (silver) => {
  if (silver === 0) {
    return '0';
  } else {
    return String(silver).replace(/(.)(?=(\d{3})+$)/g,'$1,');
  }
}