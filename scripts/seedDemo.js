const { assertRequiredEnvironment } = require('../src/config/env');
const { connectDatabase, disconnectDatabase } = require('../src/config/database');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Todo = require('../src/models/Todo');
const recordTodoActivity = require('../src/utils/recordTodoActivity');

const demoCategories = [
  {
    name: 'kuliah',
    description: 'Tugas dan target perkuliahan.',
    color: '#3366FF',
    todos: [
      'Menyelesaikan rangkuman materi basis data',
      'Mengumpulkan tugas pemrograman backend',
      'Membaca materi untuk kelas minggu depan',
    ],
  },
  {
    name: 'pekerjaan',
    description: 'Daftar pekerjaan dan proyek.',
    color: '#20A464',
    todos: [
      'Memperbarui dokumentasi endpoint API',
      'Meninjau daftar bug yang belum selesai',
      'Menyiapkan demo fitur untuk mentor',
    ],
  },
  {
    name: 'pribadi',
    description: 'Rutinitas dan keperluan pribadi.',
    color: '#F09B24',
    todos: [
      'Merapikan jadwal kegiatan mingguan',
      'Membeli perlengkapan belajar',
      'Mencadangkan file penting ke cloud',
    ],
  },
];

async function seedDemo() {
  const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error('Isi SEED_USER_EMAIL dengan email akun yang sudah terdaftar.');

  assertRequiredEnvironment();
  await connectDatabase();

  try {
    const user = await User.findOne({ email, archived: false });
    if (!user) throw new Error('Akun SEED_USER_EMAIL tidak ditemukan; daftarkan akun melalui API terlebih dahulu.');

    let categoriesCreated = 0;
    let todosCreated = 0;

    for (const categoryData of demoCategories) {
      let category = await Category.findOne({
        user: user._id,
        name: categoryData.name,
        archived: false,
      });

      if (!category) {
        category = await Category.create({
          name: categoryData.name,
          description: categoryData.description,
          color: categoryData.color,
          user: user._id,
          created_by: user._id,
          updated_by: user._id,
        });
        categoriesCreated += 1;
      }

      for (const title of categoryData.todos) {
        const existingTodo = await Todo.exists({
          user: user._id,
          category: category._id,
          title,
          archived: false,
        });
        if (existingTodo) continue;

        const todo = await Todo.create({
          title,
          description: '',
          completed: false,
          priority: 'medium',
          user: user._id,
          category: category._id,
          created_by: user._id,
          updated_by: user._id,
        });
        await recordTodoActivity({
          actorId: user._id,
          todoId: todo._id,
          action: 'TODO_CREATED',
          changedFields: ['title', 'description', 'completed', 'priority', 'category'],
        });
        todosCreated += 1;
      }
    }

    console.log(`Demo data siap untuk ${user.email}: ${categoriesCreated} kategori baru, ${todosCreated} todo baru.`);
  } finally {
    await disconnectDatabase();
  }
}

seedDemo().catch((error) => {
  console.error(`Seed demo gagal: ${error.message}`);
  process.exitCode = 1;
});
