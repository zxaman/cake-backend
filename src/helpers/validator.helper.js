export const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

export const validateKeyPresence = (filter, key, errorMessage) => {
  if (
    Object.prototype.hasOwnProperty.call(filter, key) &&
    // filter[key] !== true
    typeof filter[key] !== "boolean"
  ) {
    throw new Error(errorMessage);
  }
};

export const validateFilterKeys = (filter) => {
  const knownKeys = ["updated", "startDate", "endDate"];
  for (const key in filter) {
    if (!knownKeys.includes(key)) {
      if (
        !Array.isArray(filter[key]) ||
        !filter[key].every((item) => typeof item === "string")
      ) {
        throw new Error(
          `The "${key}" key must be an array of strings for unknown keys`,
        );
      }
    }
  }
};
