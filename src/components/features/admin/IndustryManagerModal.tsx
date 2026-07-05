import { Check, Edit2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function IndustryManagerModal({ isOpen, onClose, industries, onSuccess }: { isOpen: boolean, onClose: () => void, industries: any[], onSuccess: () => void }) {
  const [newIndustry, setNewIndustry] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!newIndustry.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/industries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newIndustry.trim() })
      });
      if (!res.ok) throw new Error('Failed to create industry');
      toast.success('Industry added');
      setNewIndustry('');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/industries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName.trim() })
      });
      if (!res.ok) throw new Error('Failed to update industry');
      toast.success('Industry updated');
      setEditingId(null);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This will remove the tag from all associated articles.")) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/industries?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete industry');
      toast.success('Industry removed');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Manage Industry Tags</h3>
            <p className="text-xs text-gray-500 mt-0.5">Add, edit, or remove taxonomy.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Add New Section */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. HealthTech, AI..." 
              value={newIndustry} 
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              disabled={isProcessing}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:border-[#E31E24] focus:outline-none transition-colors disabled:opacity-50"
            />
            <button 
              onClick={handleCreate} 
              disabled={isProcessing || !newIndustry.trim()}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {industries.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 font-medium">No industries found. Add one above.</div>
          ) : (
            industries.map((ind: any) => (
              <div key={ind.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                {editingId === ind.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate(ind.id)}
                      autoFocus
                      className="flex-1 bg-white border border-[#E31E24] rounded-md px-2 py-1 text-sm focus:outline-none"
                    />
                    <button onClick={() => handleUpdate(ind.id)} disabled={isProcessing} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-md">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-bold text-gray-800">{ind.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingId(ind.id); setEditName(ind.name); }} 
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ind.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}