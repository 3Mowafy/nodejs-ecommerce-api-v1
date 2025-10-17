const asyncHandler = require("express-async-handler");
const ApiError = require("../helpers/apiError.helpers");
const ApiFeatures = require("../helpers/apiFeatures.helpers");
const slugify = require("slugify");

class Docs {
  static #upadteSlug = (title, name, prod, req, next) => {
    if (prod === "product") {
      if (!title)
        return next(new ApiError("The key must be title not another"));
      req.body.slug = slugify(title);
    } else {
      if (!name) return next(new ApiError("The key must be name  not another"));
      req.body.slug = slugify(name);
    }
  };

  static addDoc = (model) =>
    asyncHandler(async (req, res) => {
      let { title, name } = req.body;
      if (title || name) req.body.slug = slugify(title || name);

      req.body.createdBy = { name: req.user.name, role: req.user.role };
      const docData = await model.create(req.body);

      res.status(201).json({
        status: "success",
        data: docData,
      });
    });

  static getDocs = (model, search) =>
    asyncHandler(async (req, res) => {
      const countDocs = await model.countDocuments();
      const apiFeatures = new ApiFeatures(model.find(req.filterObj), req.query)
        .filter()
        .paginate(countDocs)
        .sort()
        .limitFeilds()
        .search(search);

      const { mongoQuery, pagination } = apiFeatures;
      const docsData = await mongoQuery;

      res.status(200).json({
        status: "success",
        results: docsData.length,
        pagination,
        data: docsData,
      });
    });

  static getDoc = (model, populateOption) =>
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const getQuery = model.findById(id);

      if (populateOption) {
        getQuery.populate(populateOption);
      }

      const docData = await getQuery;

      if (!docData)
        return next(new ApiError(`Doc with (${id}) is not found`, 404));
     
     

      res.status(200).json({
        status: "success",
        data: docData,
      });
    });

  static updateDoc = (model, prod) =>
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const { title, name, createdBy, role } = req.body;

      if (name) this.#upadteSlug(title, name, prod, req, next);

      if (createdBy || role)
        return next(new ApiError(`Can't Edit role key`, 403));

      let docData;
      const query =
        req.user.role !== "SuperAdmin"
          ? { _id: id, createdBy: { $ne: "SuperAdmin" } }
          : { _id: id };

      docData = await model.findOneAndUpdate(query, req.body, {
        new: true,
      });

      docData.save();

      if (!docData)
        return next(
          new ApiError(
            `Doc with (${id}) is not found or you can't have permissions to Edit it`,
            404
          )
        );

      res.status(200).json({
        status: "success",
        data: docData,
      });
    });

  static deleteDoc = (model) =>
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;

      let docData;
      const query =
        req.user.role !== "SuperAdmin"
          ? { _id: id, createdBy: { $ne: "SuperAdmin" } }
          : { _id: id };

      docData = await model.findOneAndDelete(query);

      if (model.modelName == "Review")
        await model.avgSumRatings(docData.product);

      if (!docData)
        return next(
          new ApiError(
            `Doc with (${id}) is not found or you can't have permissions to delete it`,
            404
          )
        );

      res.status(200).json({
        status: "success",
        data: `Doc with id (${id}) has been deleted`,
      });
    });
}

module.exports = Docs;
