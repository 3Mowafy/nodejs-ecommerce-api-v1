class ApiFeatures {
  constructor(mongoQuery, queryString) {
    this.mongoQuery = mongoQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const exludeFields = ["page", "limit", "sort", "fields", "search"];
    exludeFields.forEach((field) => delete queryObj[field]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.mongoQuery = this.mongoQuery.find(JSON.parse(queryString));
    return this;
  }

  paginate(countDocs) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.page = page;
    pagination.limit = limit;
    pagination.countOfPages = Math.ceil(countDocs / limit);

    if (endIndex < countDocs) pagination.next = page + 1;
    if (skip) pagination.prev = page - 1;

    this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);
    this.pagination = pagination;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.sort(sortBy);
    } else {
      this.mongoQuery = this.mongoQuery.sort("-createdAt");
    }

    return this;
  }

  limitFeilds() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.select(fields);
    } else {
      this.mongoQuery = this.mongoQuery.select("-__v");
    }

    return this;
  }

  search(model) {
    if (this.queryString.search) {
      let query = {};
      if (model === "products") {
        query.$or = [
          { title: { $regex: this.queryString.search, $options: "i" } },
          { description: { $regex: this.queryString.search, $options: "i" } },
        ];
      } else {
        query = {
          name: { $regex: this.queryString.search, $options: "i" },
        };
      }
      this.mongoQuery = this.mongoQuery.find(query);
    }
    return this;
  }
}

module.exports = ApiFeatures;
