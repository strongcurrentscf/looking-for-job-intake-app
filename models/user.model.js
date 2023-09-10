const db = require("../data/database");
const cloudinary = require("../middlewares/resume-upload"); 

const mongodb = require("mongodb");
const { cloudinaryUploadImageMiddleware } = require("../middlewares/resume-upload");

class User {
  constructor(userData) {
    this.firstname = userData.firstname;
    this.lastname = userData.lastname;
    this.phone = userData.phone;
    this.email = userData.email;
    this.resume = userData.resume;
    this.resumeImagePath = `lookingforjob/user-data/pdf/${userData.resume}`;
    this.resumeUrl = userData.resumeUrl;
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
      resumeImagePath: this.resumeImagePath,
      position: this.position,
      dateTime: this.dateTime,
    };


    // Get return from cloudinary, drill it for url, and include in userData before inserting to db in next function call.  
    const result = await cloudinary.cloudinaryUploadImageMiddleware(this.resumeImagePath.toString());

    userData.resumeUrl = result.secure_url;

    console.log(userData); // DELETE

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
