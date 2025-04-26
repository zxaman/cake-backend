import { isValidObjectId } from "../helpers/is-valid-object-id.helper.js";
import { Types } from "mongoose";

/**
 * construct the aggregate filter for multiple selection filter
 *
 * @param {{[key: string]: string| number | boolean | string[] | number[] | boolean[]}} filter
 */

export const constructAggregateFilter = (filter) => {
  const updatedFilter = {};

  const processDateRange = (fieldPrefix) => {
    const dateFilter = {};

    if (filter.startDate && filter.endDate) {
      dateFilter.$gte = new Date(filter.startDate);
      dateFilter.$lte = new Date(
        new Date(filter.endDate).setUTCHours(23, 59, 59, 999),
      );
    } else if (filter.startDate) {
      dateFilter.$gte = new Date(filter.startDate);
    } else if (filter.endDate) {
      dateFilter.$lte = new Date(
        new Date(filter.endDate).setUTCHours(23, 59, 59, 999),
      );
    }

    if (Object.keys(dateFilter).length > 0) {
      updatedFilter[fieldPrefix] = {
        ...(updatedFilter[fieldPrefix] || {}),
        ...dateFilter,
      };
    }
  };

  Object.keys(filter).forEach((key) => {
    const value = filter[key];

    if (Array.isArray(value)) {
      const validObjectIds = value
        .filter((item) => isValidObjectId(item))
        .map((id) => new Types.ObjectId(id));
      const nonObjectIds = value.filter((item) => !isValidObjectId(item));

      // Add valid ObjectId values as separate filters for the same key
      if (validObjectIds.length > 0) {
        validObjectIds.forEach((id) => {
          updatedFilter[key] = id;
        });
      }

      // Handle non-ObjectId values as $in
      if (nonObjectIds.length > 0) {
        updatedFilter[key] = { $in: nonObjectIds };
      }
    } else if (value && isValidObjectId(value)) {
      updatedFilter[key] = new Types.ObjectId(value.toString());
    } else if (key === "updated" && value === true) {
      processDateRange("updatedAt");
    } else if (!filter.updated && (filter.startDate || filter.endDate)) {
      processDateRange("createdAt");
    } else if (!["startDate", "endDate", "updated"].includes(key)) {
      updatedFilter[key] = { $in: [value] };
    }
  });

  console.log("updatedFilter", updatedFilter);
  return updatedFilter;
};

// export const constructAggregateFilter = (filter) => {
//   const updatedFilter = {};

//   // const processDateRange = (fieldPrefix) => {
//   //   // Check if both startDate and endDate are provided and build the range filter
//   //   if (filter.startDate) {
//   //     updatedFilter[fieldPrefix] = {
//   //       $gte: new Date(filter.startDate),
//   //       ...(filter.endDate && {
//   //         $lte: new Date(new Date(filter.endDate).setUTCHours(23, 59, 59, 999)),
//   //       }),
//   //     };
//   //   }
//   // };

//   const processDateRange = (fieldPrefix) => {
//     // Initialize the field filter if it doesn't exist
//     updatedFilter[fieldPrefix] = updatedFilter[fieldPrefix] || {};

//     // Check for startDate and endDate in filter and add conditions accordingly
//     if (filter.startDate && filter.endDate) {
//       // Both startDate and endDate are present
//       updatedFilter[fieldPrefix] = {
//         $gte: new Date(filter.startDate),
//         $lte: new Date(new Date(filter.endDate).setUTCHours(23, 59, 59, 999)),
//       };
//     } else if (filter.startDate) {
//       // Only startDate is present
//       updatedFilter[fieldPrefix] = {
//         $gte: new Date(filter.startDate),
//       };
//     } else if (filter.endDate) {
//       // Only endDate is present
//       updatedFilter[fieldPrefix] = {
//         $lte: new Date(new Date(filter.endDate).setUTCHours(23, 59, 59, 999)),
//       };
//     }
//   };

//   // Iterate over filter keys and build the aggregation filter
//   Object.keys(filter).forEach((key) => {
//     if (key === "updated" && filter[key] === true) {
//       processDateRange("updatedAt");
//     } else {
//       processDateRange("createdAt");
//     }

//     // if (key === "created") {
//     //   processDateRange("createdAt"); // Process the created date range
//     // } else if (key === "updated") {
//     //   processDateRange("updatedAt"); // Process the updated date range
//     } else if (Array.isArray(filter[key])) {
//       updatedFilter[key] = { $in: filter[key] }; // Handle array-based filters
//     } else if (key !== "startDate" && key !== "endDate") {
//       updatedFilter[key] = filter[key]; // Other fields directly assigned to the filter
//     }
//   });

//   console.log("updatedFilter", updatedFilter);
//   return updatedFilter;
// };
