import bcrypt from "bcryptjs";

export class PasswordService {
  static SALT_ROUNDS = 10;

  // Hash password
  static async hash(password) {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Compare password with stored hash
  static async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
