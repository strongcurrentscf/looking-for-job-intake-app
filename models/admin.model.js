const bcrypt = require("bcryptjs");

const mongodb = require("mongodb");

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
    const candidates = await db.getDb().collection("users").find().toArray();

    return candidates;
  }

  static async deleteCandidate(id) { 
       const candidateId = new mongodb.ObjectId(id);
       return db.getDb().collection("users").deleteOne({ _id: candidateId });
  }
}

module.exports = Administrator;
