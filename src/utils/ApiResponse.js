/**
 * @description Common response class to send serialized response from anywhere.
 */
class ApiResponse {
  /**
   *
   * @param {number} statusCode
   * @param {any} data
   * @param {string} message
   */
  constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
