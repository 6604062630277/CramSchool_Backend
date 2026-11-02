import 'dotenv/config';

const required = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ ไม่พบ ${key} ในไฟล์ .env`);
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
};