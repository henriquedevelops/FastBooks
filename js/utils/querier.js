/*

Class used to query documents by chaining methods

*/

class Querier {
  constructor(responseQuery, requestQuery) {
    this.responseQuery = responseQuery;
    this.requestQuery = requestQuery;
  }

  filter() {
    let { page, sort, limit, fields, ...copyQuery } = this.requestQuery;

    copyQuery = JSON.stringify(copyQuery).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.responseQuery = this.responseQuery.find(JSON.parse(copyQuery));

    return this;
  }

  sort() {
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(',').join(' ');
      this.responseQuery = this.responseQuery.sort(sortBy);
    } else {
      this.responseQuery = this.responseQuery.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.requestQuery.fields) {
      const fields = this.requestQuery.fields.split(',').join(' ');
      this.responseQuery = this.responseQuery.select(fields);
    } else {
      this.responseQuery = this.responseQuery.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.requestQuery.page * 1 || 1;
    const limit = this.requestQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.responseQuery = this.responseQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = Querier;
