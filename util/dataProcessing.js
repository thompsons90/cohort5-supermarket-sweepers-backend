const calculatePricePerOz = (inputString, totalPrice) => {
  let formattedString = inputString.toLowerCase();

  if (
    formattedString.includes('ct') &&
    formattedString.includes('/') &&
    (formattedString.includes('oz') || formattedString.includes('lb'))
  ) {
    let parts = formattedString.split('/');
    let totalUnitSize = extractNumberFromString(parts[0]);
    if (formattedString.includes('lb')) totalUnitSize * 16;
    return Math.round((totalPrice / totalUnitSize) * 100) / 100;
  } else if (formattedString.includes('lb')) {
    let totalUnitSize = extractNumberFromString(formattedString) * 16;
    return Math.round((totalPrice / totalUnitSize) * 100) / 100;
  } else if (formattedString.includes('oz')) {
    let totalUnitSize = extractNumberFromString(formattedString);
    return Math.round((totalPrice / totalUnitSize) * 100) / 100;
  }
};

const extractNumberFromString = (inputString) => {
  return Number(inputString.trim().match(/[0-9]+/)[0]);
};

exports.calculatePricePerOz = calculatePricePerOz;
