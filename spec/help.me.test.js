exports.check_keys = (data, key_arr) => {
  return data.every(datum => {
    return key_arr.every(key => {
      return datum.hasOwnProperty(key);
    });
  });
};
