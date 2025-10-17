class Sanitizations {
  static sanitizeUser = function (user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  };
}

module.exports = Sanitizations;
