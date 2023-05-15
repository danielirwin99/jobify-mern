// Creating a sort of const that extends from the built in Error functionality
class CustomAPIError extends Error {
    constructor(message) {
      super(message);
    }
  }

export default CustomAPIError