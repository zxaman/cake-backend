import { body } from "express-validator";

const getAllUsersValidator = () => {
  return [
    body("search").isString().withMessage("Search text must be a string"),
    body("filter")
      .isObject()
      .withMessage("Filter must be an object")
      .custom((filter) => {
        for (const key in filter) {
          if (
            !Array.isArray(filter[key]) ||
            !filter[key].every((item) => typeof item === "string")
          ) {
            throw new Error(
              `All filter values must be arrays of strings. Invalid value found at key: ${key}`,
            );
          }
        }
        return true;
      }),
    body("pagination").isObject().withMessage("Pagination must be an object"),
    body("pagination.page")
      .isInt({ min: 1 })
      .withMessage("Page must be an integer greater than 0"),
    body("pagination.limit")
      .isInt({ min: 1 })
      .withMessage("Limit must be an integer greater than 0"),
    body("sort")
      .optional()
      .isObject()
      .withMessage("Sort must be an object")
      .custom((sort) => {
        // Check that only one field must be present in sort Object.
        const sortKeys = Object.keys(sort);
        if (sortKeys.length !== 1) {
          throw new Error("Sort object must contain exactly one key");
        }
        const sortValue = sort[sortKeys[0]];
        if (![1, -1].includes(sortValue)) {
          throw new Error("Sort value must be either 1 or -1");
        }
        return true;
      }),
  ];
};

export default getAllUsersValidator;
