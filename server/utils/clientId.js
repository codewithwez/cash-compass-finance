const mongoose = require("mongoose");

const clientIdFilter = (id) => {
  const filters = [{ publicId: id }];

  if (mongoose.Types.ObjectId.isValid(id)) {
    filters.push({ _id: id });
  }

  return filters;
};

module.exports = { clientIdFilter };
