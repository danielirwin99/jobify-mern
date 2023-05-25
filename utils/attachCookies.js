// ---------------
// COOKIES
// ---------------

const attachCookies = ({res, token}) => {
  // For our expires below (One Day)
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    // We want it to expire the same time as the JWT token --> Its in milliseconds
    expires: new Date(Date.now() + oneDay),
    // Secure it if we are in production build
    secure: process.env.NODE_ENV === "production",
  });
};

export default attachCookies;
