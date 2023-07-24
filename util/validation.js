function isEmpty(value) {
  return !value || value.trim() === "";
}

function userDetailsAreValid(firstname, lastname, phone, email, position) {
  return (
    !isEmpty(firstname) &&
    !isEmpty(lastname) &&
    !isEmpty(phone) &&
    !isEmpty(email) &&
    email.includes("@") &&
    !isEmpty(position)
  );
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
};
