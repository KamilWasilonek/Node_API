module.exports = {
  internalServerError: (res, error) => {
    return res.status(500).json({
      error: error
    });
  },

  authFailed: (res, message = 'Auth failed') => {
    res.status(401).json({
      message: message
    });
  },

  correctRequest: (res, message) => {
    res.status(200).json({
      message: message
    });
  }
};
