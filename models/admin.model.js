const bcrypt = require("bcryptjs");

const db = require("../data/database");

class Administrator {
  constructor(adminname, password) {
    this.adminname = adminname;
    this.password = password;
  }

  getAdminWithSameName() {
    return db
      .getDb()
      .collection("admins")
      .findOne({ adminname: this.adminname });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  static async getAllCandidates() {
    const candidates = await db
      .getDb()
      .collection("users")
      .find()
      .sort({ _id: -1 })
      .toArray();

    return candidates;
  }

  static async getSortedCandidates(position) {
    const candidates = await db
      .getDb()
      .collection("users")
      .find({ position: position })
      .sort({ _id: -1 })
      .toArray();

    return candidates;
  }
}

module.exports = Administrator;
