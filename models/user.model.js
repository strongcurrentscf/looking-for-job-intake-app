const db = require("../data/database");

class User {
  constructor(firstname, lastname, phone, email, resume, position, dateTime) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone;
    this.email = email;
    this.resume = resume;
    this.resumeFilePath = `user-data/pdf/${resume}`;
    this.resumeUrl = `/users/pdf/${resume}`;
    this.position = position;
    this.dateTime = dateTime;
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
    await db.getDb().collection("users").insertOne({
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      email: this.email,
      resume: this.resume,
      position: this.position,
      dateTime: this.dateTime,
    });
  }
}

module.exports = User;
