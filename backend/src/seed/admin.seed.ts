import { User } from '../models/user.model';
import { hashPassword } from '../utils/password.util';

export async function seedAdmin(): Promise<void> {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const hashedPassword = await hashPassword('admin123');

      await User.create({
        email: 'admin@skyroute.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        status: 'active',
        mustChangePassword: false,
      });

      console.log('✅ Admin account created: admin@skyroute.com / admin123');
    } else {
      console.log('ℹ️  Admin account already exists');
    }
  } catch (error) {
    console.error('❌ Failed to seed admin:', error);
    throw error;
  }
}
