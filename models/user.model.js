const db = require("../data/database");

const mongodb = require("mongodb");

class User {
  constructor(userData) {
    this.firstname = userData.firstname;
    this.lastname = userData.lastname;
    this.phone = userData.phone;
    this.email = userData.email;
    this.resume = userData.resume;
    this.resumeFilePath = `user-data/pdf/${userData.resume}`;
    this.resumeUrl = `/users/pdf/${userData.resume}`;
    this.position = userData.position;
    this.dateTime = userData.dateTime;
    if (userData._id) {
      this.id = userData._id.toString();
    }
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async intakeUser() {
    const userData = {
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      email: this.email,
      resume: this.resume,
      position: this.position,
      dateTime: this.dateTime,
    };

    await db.getDb().collection("users").insertOne(userData);
  }

  static async findUserById(id) {
    let userId;
    try {
      userId = new mongodb.ObjectId(id);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const user = await db.getDb().collection("users").findOne({ _id: userId });

    if (!user) {
      const error = new Error("Could not find user with provided id.");
      error.code = 404;
      throw error;
    }

    return new User(user);
  }

  removeUser() {
    const userId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("users").deleteOne({ _id: userId });
  }
}

module.exports = User;
