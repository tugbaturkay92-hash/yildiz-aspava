'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Trash2, Star, X } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  isPopular: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

type FormMode = 'add' | 'edit';

interface ItemForm {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  isAvailable: boolean;
  isPopular: boolean;
}

const emptyForm: ItemForm = { name: '', description: '', price: '', categoryId: '', isAvailable: true, isPopular: false };

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [addingCat, setAddingCat] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch('/api/menu/categories');
    const data = await res.json();
    setCategories(data);
    if (data.length > 0 && !activeCat) setActiveCat(data[0].id);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []); // eslint-disable-line

  const currentCat = categories.find((c) => c.id === activeCat);

  const handleAddItem = () => {
    setForm({ ...emptyForm, categoryId: activeCat });
    setFormMode('add');
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
      isPopular: item.isPopular,
    });
    setFormMode('edit');
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/menu/items/${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, price: parseFloat(form.price), categoryId: form.categoryId || activeCat };

    if (formMode === 'add') {
      await fetch('/api/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else if (editingId) {
      await fetch(`/api/menu/items/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    setShowForm(false);
    fetchCategories();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = await fetch('/api/menu/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName }),
    });
    const cat = await res.json();
    setNewCatName('');
    setAddingCat(false);
    await fetchCategories();
    setActiveCat(cat.id);
  };

  return (
    <div className="p-8">
      <h1 className="text-white text-2xl font-bold mb-6">Menü Yönetimi</h1>

      <div className="flex gap-6">
        {/* Categories sidebar */}
        <div className="w-56 shrink-0">
          <div className="bg-[#1e293b] rounded-lg border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategoriler</div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-white/5 ${
                  activeCat === cat.id ? 'bg-[#ad3114] text-white' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div>{cat.name}</div>
                <div className={`text-xs ${activeCat === cat.id ? 'text-white/70' : 'text-gray-500'}`}>{cat.items.length} ürün</div>
              </button>
            ))}
            {addingCat ? (
              <form onSubmit={handleAddCategory} className="p-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Kategori adı"
                  autoFocus
                  className="w-full bg-[#0f172a] border border-white/10 text-white px-2 py-1.5 rounded text-xs mb-2 focus:outline-none focus:border-[#ad3114]"
                />
                <div className="flex gap-1">
                  <button type="submit" className="flex-1 bg-[#ad3114] text-white text-xs py-1.5 rounded font-bold">Ekle</button>
                  <button type="button" onClick={() => setAddingCat(false)} className="flex-1 bg-[#0f172a] text-gray-400 text-xs py-1.5 rounded">İptal</button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setAddingCat(true)}
                className="w-full px-4 py-3 text-xs text-[#ad3114] hover:bg-white/5 flex items-center gap-1 font-semibold"
              >
                <Plus size={13} /> Kategori Ekle
              </button>
            )}
          </div>
        </div>

        {/* Items list */}
        <div className="flex-1">
          <div className="bg-[#1e293b] rounded-lg border border-white/5">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-white font-semibold">{currentCat?.name || 'Kategori Seçin'}</h2>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-[#ad3114] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#8a2710] transition-colors"
              >
                <Plus size={14} /> Ürün Ekle
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-[#ad3114] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !currentCat || currentCat.items.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">Bu kategoride ürün yok.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {currentCat.items.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{item.name}</span>
                        {item.isPopular && <Star size={11} className="text-[#ad3114] fill-[#ad3114]" />}
                        {!item.isAvailable && <span className="text-xs text-gray-500">(Mevcut değil)</span>}
                      </div>
                      {item.description && <p className="text-gray-500 text-xs mt-0.5 truncate">{item.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#ad3114] font-bold text-sm">{formatPrice(item.price)}</span>
                      <button onClick={() => handleEditItem(item)} className="text-gray-400 hover:text-white">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-red-400">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Item form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] rounded-lg p-8 max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold">{formMode === 'add' ? 'Ürün Ekle' : 'Ürünü Düzenle'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmitItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ad *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Açıklama</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fiyat (₺) *</label>
                <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="accent-[#ad3114]" />
                  Mevcut
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="accent-[#ad3114]" />
                  Popüler
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[#ad3114] text-white py-2.5 rounded text-sm font-bold hover:bg-[#8a2710] transition-colors">
                  {formMode === 'add' ? 'Ekle' : 'Kaydet'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#0f172a] text-gray-400 py-2.5 rounded text-sm font-bold hover:text-white transition-colors">
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
