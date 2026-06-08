require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Priya', 'Ananya', 'Sneha', 'Kavya', 'Rahul', 'Karan', 'Neha', 'Divya', 'Siddharth', 'Arjun', 'Meera', 'Pooja', 'Vikram', 'Raj', 'Sanjay', 'Amit'];
const lastNames = ['Sharma', 'Verma', 'Singh', 'Patel', 'Kumar', 'Gupta', 'Iyer', 'Nair', 'Reddy', 'Rao', 'Das', 'Joshi', 'Chauhan', 'Yadav', 'Mishra'];
const purposes = ['Business expansion', 'Home repair', 'Medical emergency', 'Education fee', 'Agriculture equipment', 'Vehicle purchase', 'Debt consolidation', 'Inventory purchase'];
const languages = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];
const statuses = ['pending', 'approved', 'rejected'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMobile() {
  let num = '9';
  for (let i = 0; i < 9; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

async function seed() {
  try {
    console.log('Starting seeder...');
    
    // Generate 25 entries
    let count = 0;
    for (let i = 0; i < 25; i++) {
      const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
      const mobile = generateMobile();
      const amount = getRandomInt(10, 500) * 1000; // Between 10,000 and 500,000
      const purpose = getRandomElement(purposes);
      const language = getRandomElement(languages);
      // Weighted status distribution: 50% pending, 30% approved, 20% rejected
      const rand = Math.random();
      const status = rand < 0.5 ? 'pending' : (rand < 0.8 ? 'approved' : 'rejected');
      
      // Random past date within the last 30 days
      const daysAgo = getRandomInt(0, 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      await pool.query(
        `INSERT INTO applications (name, mobile, amount, purpose, language, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, mobile, amount, purpose, language, status, date.toISOString()]
      );
      count++;
    }

    console.log(`Successfully seeded ${count} dummy applications!`);
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    pool.end();
  }
}

seed();
