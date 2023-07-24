const bcrypt = require("bcryptjs");
const db = require("../data/database");

async function registerAdmin() {
  const hashedPassword = await bcrypt.hash("zazzys73!", 12);
  const adminname = "Christian";

const registration = await db.getDb().collection("admins").insertOne({
    adminname: adminname,
    password: hashedPassword,
});
    
    console.log(registration);
}

module.exports = { registerAdmin: registerAdmin };
