exports.getIndexPage = (req, res) => {
  res.render("index");
};

exports.getSignUpPage = (req, res) => {
  res.render("signUp");
};

exports.postSignUp = (req, res) => {
  // lot of things to do
  // express-validator
  // prisma instead of direct postgresql db
};
