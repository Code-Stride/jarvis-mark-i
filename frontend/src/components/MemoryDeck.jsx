import React, { useState } from 'react';
import { Database, Plus, Search, Trash2, Shield, User, MapPin, Heart, Key } from 'lucide-react';

export default function MemoryDeck({ facts, onAddFact, onDeleteFact, onSearchFacts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [isAdding, setIsAdding] = useState(false);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    onSearchFacts(q);
  };

  const handleSubmitNew = (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    onAddFact(newKey.trim(), newValue.trim(), newCategory);
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat === 'profile') return <User className="w-3.5 h-3.5 text-cyan-400" />;
    if (cat === 'security' || cat === 'directive') return <Shield className="w-3.5 h-3.5 text-amber-400" />;
    if (cat === 'location') return <MapPin className="w-3.5 h-3.5 text-emerald-400" />;
    if (cat === 'preference') return <Heart className="w-3.5 h-3.5 text-rose-400" />;
    return <Key className="w-3.5 h-3.5 text-cyan-300" />;
  };

  return (
    <div className="bg-slate-900/70 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-md">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-cyan-900/50">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-orbitron font-bold text-sm text-cyan-200 tracking-wider uppercase">
              SQLITE LONG-TERM MEMORY BANK
            </h3>
            <p className="text-[11px] font-mono text-cyan-400/70">
              {facts.length} PERSISTENT PROTOCOLS AND USER PREFERENCES STORED
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search memory..."
              className="pl-9 pr-3 py-1.5 bg-slate-950/80 border border-cyan-500/30 rounded-lg text-xs text-cyan-200 placeholder:text-cyan-600/60 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* Add Fact Button */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 hover:border-cyan-400 rounded-lg text-xs font-orbitron text-cyan-300 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'CANCEL' : 'ADD MEMORY'}</span>
          </button>
        </div>
      </div>

      {/* New Fact Form Modal/Box */}
      {isAdding && (
        <form onSubmit={handleSubmitNew} className="p-4 mb-4 bg-slate-950/90 border border-cyan-500/40 rounded-lg space-y-3">
          <div className="text-xs font-orbitron text-cyan-300 font-bold tracking-wider uppercase">
            LOG NEW PERMANENT FACT INTO MEMORY
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Key (e.g. Favorite Beverage)"
              className="bg-slate-900 border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-cyan-200 font-mono"
              required
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value (e.g. Black Coffee)"
              className="bg-slate-900 border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-cyan-200 font-mono"
              required
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-slate-900 border border-cyan-500/30 rounded px-3 py-1.5 text-xs text-cyan-200 font-mono"
            >
              <option value="general">General</option>
              <option value="profile">Profile</option>
              <option value="preference">Preference</option>
              <option value="location">Location</option>
              <option value="directive">Directive</option>
              <option value="security">Security</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron text-xs font-bold uppercase rounded transition-all"
            >
              STORE FACT
            </button>
          </div>
        </form>
      )}

      {/* Facts Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
        {facts.length === 0 ? (
          <div className="col-span-2 p-6 text-center text-cyan-500/60 font-mono text-xs">
            No permanent facts found in memory banks matching "{searchQuery}".
          </div>
        ) : (
          facts.map((fact, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-3.5 bg-slate-950/60 border border-cyan-900/50 hover:border-cyan-500/40 rounded-lg transition-all group"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded bg-cyan-950/80 border border-cyan-500/20 mt-0.5">
                  {getCategoryIcon(fact.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron font-semibold text-xs text-cyan-200 uppercase">
                      {fact.key}
                    </span>
                    <span className="px-1.5 py-0.2 bg-cyan-950/50 border border-cyan-500/20 rounded text-[9px] text-cyan-400 uppercase font-mono">
                      {fact.category}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-100/90 mt-1 leading-relaxed">
                    {fact.value}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteFact(fact.key)}
                title="Delete fact from persistent memory"
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
