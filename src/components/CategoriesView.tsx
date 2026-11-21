import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Users, Plus, Edit2, Trash2, Shield, 
  Sparkles, Layers, CheckCircle2, ChevronRight, X, BookOpen
} from 'lucide-react';
import { Category } from '../types';

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, students, programs } = useFest();

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<{
    name: string;
    gender: 'Male' | 'Female' | 'Mix';
    classesInput: string;
    chestStart: number;
    chestEnd: number;
  }>({
    name: '',
    gender: 'Male',
    classesInput: '1, 2',
    chestStart: 1000,
    chestEnd: 1049
  });

  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({
        name: cat.name,
        gender: cat.gender,
        classesInput: cat.classes.join(', '),
        chestStart: cat.chestRange.start,
        chestEnd: cat.chestRange.end
      });
    } else {
      setEditingCat(null);
      setCatForm({
        name: '',
        gender: 'Male',
        classesInput: '1',
        chestStart: 1000 + categories.length * 50,
        chestEnd: 1049 + categories.length * 50
      });
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;

    const parsedClasses = catForm.classesInput
      .split(',')
      .map(c => parseInt(c.trim(), 10))
      .filter(c => !isNaN(c));

    const catData = {
      name: catForm.name,
      gender: catForm.gender,
      classes: parsedClasses.length > 0 ? parsedClasses : [1],
      chestRange: {
        start: Number(catForm.chestStart) || 1000,
        end: Number(catForm.chestEnd) || 1049
      }
    };

    if (editingCat) {
      updateCategory({ ...catData, id: editingCat.id });
    } else {
      addCategory(catData);
    }
    setIsCatModalOpen(false);
  };

  const handleDeleteCat = (catId: string) => {
    const studentCount = students.filter(s => s.categoryId === catId).length;
    const progCount = programs.filter(p => p.categoryId === catId).length;
    if (studentCount > 0 || progCount > 0) {
      if (!window.confirm(`This category has ${studentCount} students and ${progCount} programs linked. Delete anyway?`)) {
        return;
      }
    }
    deleteCategory(catId);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>Categories & Classes (മത്സര വിഭാഗങ്ങൾ)</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {categories.length} Categories
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage festival divisions (Kiddies, Sub-Junior, Junior, Senior, General / Mix) and chest number ranges.
          </p>
        </div>

        <button
          onClick={() => handleOpenCatModal()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Info Banner on General / Mix Categories */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1 text-slate-700">
          <p className="font-bold text-slate-900">💡 പൊതു വിഭാഗം / ജനറൽ (Mix / General Category) എങ്ങനെ ഉപയോഗിക്കാം?</p>
          <p className="leading-relaxed">
            പുതിയ കാറ്റഗറി ആഡ് ചെയ്യുമ്പോൾ <strong>Gender</strong> ഓപ്ഷനിൽ <strong>"Mix / General (പൊതു)"</strong> സെലക്ട് ചെയ്യുക. ഇത് വഴി ആൺകുട്ടികൾക്കും പെൺകുട്ടികൾക്കും ഒരുമിച്ച് പങ്കെടുക്കാവുന്ന കോമൺ പ്രോഗ്രാമുകൾക്കും (ഉദാ: ജനറൽ ക്വിസ്, എസ്സേ റൈറ്റിംഗ്) കാറ്റഗറികൾ സജ്ജീകരിക്കാം.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const linkedStudents = students.filter(s => s.categoryId === cat.id);
          const linkedPrograms = programs.filter(p => p.categoryId === cat.id);

          return (
            <div 
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    cat.gender === 'Male' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : (cat.gender === 'Female' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-purple-50 text-purple-700 border border-purple-200')
                  }`}>
                    {cat.gender === 'Male' ? '👦 Boys Only' : (cat.gender === 'Female' ? '👧 Girls Only' : '⚡ Mix / Common (കോമൺ)')}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                    Chest: #{cat.chestRange.start} - #{cat.chestRange.end}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base">{cat.name}</h3>

                <div className="flex flex-wrap gap-1">
                  <span className="text-[11px] text-slate-600 font-semibold mr-1 self-center">Classes:</span>
                  {cat.classes.map(cNum => (
                    <span key={cNum} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                      Class {cNum}
                    </span>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-700">
                  <span className="font-medium">👥 Students: <strong>{linkedStudents.length}</strong></span>
                  <span className="font-medium">📚 Programs: <strong>{linkedPrograms.length}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenCatModal(cat)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCat(cat.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingCat ? 'Edit Category' : 'Add New Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">CATEGORY NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. Sub Junior (Boys), General Quiz"
                  value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GENDER / DIVISION *</label>
                <select
                  value={catForm.gender}
                  onChange={e => setCatForm({ ...catForm, gender: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Male">👦 Boys Only (ആൺകുട്ടികൾ)</option>
                  <option value="Female">👧 Girls Only (പെൺകുട്ടികൾ)</option>
                  <option value="Mix">⚡ Mix / Common (കോമൺ - ആൺകുട്ടികൾക്കും പെൺകുട്ടികൾക്കും)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CLASSES (Comma separated) *</label>
                <input
                  type="text"
                  placeholder="e.g. 1, 2, 3 or 5, 6"
                  value={catForm.classesInput}
                  onChange={e => setCatForm({ ...catForm, classesInput: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CHEST NO START *</label>
                  <input
                    type="number"
                    value={catForm.chestStart}
                    onChange={e => setCatForm({ ...catForm, chestStart: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CHEST NO END *</label>
                  <input
                    type="number"
                    value={catForm.chestEnd}
                    onChange={e => setCatForm({ ...catForm, chestEnd: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
