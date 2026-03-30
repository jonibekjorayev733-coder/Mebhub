const AdminQuestions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Savollar
        </h1>
        <p className="text-gray-400">
          Savollarni boshqarish
        </p>
      </div>

      <div className="p-6 rounded-lg border border-gray-800 bg-gray-800/50">
        <h2 className="text-xl font-bold text-white mb-4">
          Yangi savol qo'shish
        </h2>
        <p className="text-gray-400">
          Tez orada bu funktionallik qo'shiladi
        </p>
      </div>
    </div>
  );
};

export default AdminQuestions;
