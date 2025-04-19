import User from '@/models/User';
import connectToDatabase from '@/lib/mongoose';
import { hash } from 'bcryptjs';

/**
 * Seeds the database with initial users of different roles if they don't exist
 */
export async function seedUsers() {
  try {
    await connectToDatabase();
    
    // Check if admin users exist
    const adminEmails = [
      'tharak.nagaveti@gmail.com',
      'adityasaisontena@gmail.com',
      'dhanushyangal@gmail.com',
      'tejeshvarma07@gmail.com'
    ];
    
    console.log('Checking for admin users...');
    
    for (const email of adminEmails) {
      const existingAdmin = await User.findOne({ email: email.toLowerCase() });
      
      if (!existingAdmin) {
        console.log(`Creating admin user: ${email}`);
        
        // Create admin user
        const hashedPassword = await hash('admin123', 10); // Default password, should be changed
        
        const newAdmin = new User({
          name: email.split('@')[0],
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
          roadmapProgress: 100,
          roadmapLevel: 'Expert',
          blogEnabled: true
        });
        
        await newAdmin.save();
        console.log(`Admin user created: ${email}`);
      } else {
        // Update existing user to make sure they have admin role
        if (existingAdmin.role !== 'admin') {
          existingAdmin.role = 'admin';
          await existingAdmin.save();
          console.log(`Updated user to admin role: ${email}`);
        }
      }
    }
    
    // Create a verified researcher if none exists
    const researcherCount = await User.countDocuments({ 
      role: 'verified_researcher',
      isVerified: true
    });
    
    if (researcherCount === 0) {
      console.log('Creating sample verified researcher');
      
      const hashedPassword = await hash('researcher123', 10); // Default password, should be changed
      
      const newResearcher = new User({
        name: 'Dr. Sarah Chen',
        email: 'researcher@example.com',
        password: hashedPassword,
        role: 'verified_researcher',
        isVerified: true,
        verificationDate: new Date(),
        roadmapProgress: 85,
        roadmapLevel: 'Advanced',
        institution: 'Stanford University',
        position: 'Associate Professor',
        field: 'Computer Vision',
        blogEnabled: true,
        blogPosts: [],
        datasets: []
      });
      
      await newResearcher.save();
      console.log('Sample verified researcher created');
    }
    
    // Create a regular user if none exists
    const regularUserCount = await User.countDocuments({ role: 'user' });
    
    if (regularUserCount === 0) {
      console.log('Creating sample regular user');
      
      const hashedPassword = await hash('user123', 10); // Default password, should be changed
      
      const newUser = new User({
        name: 'John Smith',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: false,
        roadmapProgress: 25,
        blogEnabled: false
      });
      
      await newUser.save();
      console.log('Sample regular user created');
    }
    
    console.log('User seeding complete');
    
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

export default seedUsers; 