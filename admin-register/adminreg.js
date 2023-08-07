const bcrypt = require("bcryptjs");
const db = require("../data/database");

async function registerAdmin(adminname, password) {
  // const adminname = "Christian";
  const adminName = adminname;
  // const hashedPassword = await bcrypt.hash("zazzys73!", 12);
  const hashedPassword = await bcrypt.hash(password, 12);

const registration = await db.getDb().collection("admins").insertOne({
    adminname: adminName,
    password: hashedPassword,
});
    
    console.log(registration);
}

module.exports = { registerAdmin: registerAdmin };
