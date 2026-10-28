const { config, assertRequiredEnvironment } = require('../src/config/env');
const { connectDatabase, disconnectDatabase } = require('../src/config/database');
const User = require('../src/models/User');

async function createAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error('Isi ADMIN_NAME, ADMIN_EMAIL, dan ADMIN_PASSWORD di environment sebelum menjalankan seed admin.');
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD minimal 8 karakter.');
  }

  assertRequiredEnvironment();
  await connectDatabase();

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role === 'admin' && !existing.archived) {
        console.log('Akun admin dengan email tersebut sudah tersedia.');
        return;
      }
      throw new Error('Email sudah dipakai akun lain; script tidak mengubah role akun yang ada.');
    }

    const admin = await User.create({ name, email, password, role: 'admin' });
    console.log(`Akun admin berhasil dibuat: ${admin.email}`);
  } finally {
    await disconnectDatabase();
  }
}

createAdmin().catch((error) => {
  console.error(`Seed admin gagal: ${error.message}`);
  process.exitCode = 1;
});
