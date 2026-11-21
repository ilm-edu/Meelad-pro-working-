import React, { useState } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Users, Plus, Edit2, Trash2, Shield, 
  Sparkles, CheckCircle2, ChevronRight, X, Phone, User
} from 'lucide-react';
import { Team } from '../types';

export const TeamsCategoriesView: React.FC = () => {
  const { 
    teams, setTeams, students, programs, genderFilter, setGenderFilter 
  } = useFest();

  // Modals state
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: '',
    code: '',
    color: '#10b981',
    description: '',
    leaderName: '',
    leaderPhone: ''
  });

  // Open Create / Edit Team
  const handleOpenTeamModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setTeamForm({
        name: team.name,
        code: team.code,
        color: team.color,
        description: team.description || '',
        leaderName: team.leaderName || '',
        leaderPhone: team.leaderPhone || ''
      });
    } else {
      setEditingTeam(null);
      setTeamForm({
        name: `Team ${String.fromCharCode(65 + teams.length)}`,
        code: `T-${String.fromCharCode(65 + teams.length)}`,
        color: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'][teams.length % 5],
        description: '',
        leaderName: '',
        leaderPhone: ''
      });
    }
    setIsTeamModalOpen(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;

    if (editingTeam) {
      setTeams(prev => prev.map(t => t.id === editingTeam.id ? {
        ...t,
        name: teamForm.name,
        code: teamForm.code || t.code,
        color: teamForm.color,
        description: teamForm.description,
        leaderName: teamForm.leaderName,
        leaderPhone: teamForm.leaderPhone
      } : t));
    } else {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamForm.name,
        code: teamForm.code || `T-${teams.length + 1}`,
        color: teamForm.color,
        bgGradient: 'from-indigo-500 to-purple-600',
        description: teamForm.description,
        leaderName: teamForm.leaderName,
        leaderPhone: teamForm.leaderPhone
      };
      setTeams(prev => [...prev, newTeam]);
    }
    setIsTeamModalOpen(false);
  };

  const handleDeleteTeam = (teamId: string) => {
    const assignedCount = students.filter(s => s.teamId === teamId).length;
    if (assignedCount > 0) {
      if (!window.confirm(`This team has ${assignedCount} students assigned. Delete anyway?`)) {
        return;
      }
    }
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Create Team Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <span>House Teams Management (ടീമുകൾ)</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {teams.length} Teams
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage festival competing houses / teams (e.g. Team A, Team B, Team C), colors, and team leaders.
          </p>
        </div>

        <button
          id="create-team-btn"
          onClick={() => handleOpenTeamModal()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teams.map(team => {
          const members = students.filter(s => s.teamId === team.id);
          const boysCount = members.filter(s => s.gender === 'Male').length;
          const girlsCount = members.filter(s => s.gender === 'Female').length;

          let totalSlots = 0;
          let filledSlots = 0;
          programs.forEach(prog => {
            totalSlots += prog.maxParticipantsPerTeam;
            const teamInProg = prog.participants.filter(pt => pt.teamId === team.id).length;
            filledSlots += teamInProg;
          });
          const progressPct = totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0;

          return (
            <div 
              key={team.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-4 h-4 rounded-full shadow-xs" 
                      style={{ backgroundColor: team.color }} 
                    />
                    <h3 className="font-extrabold text-slate-900 text-base">{team.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {progressPct}% Covered
                  </span>
                </div>

                {team.description && (
                  <p className="text-xs text-slate-600">{team.description}</p>
                )}

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${progressPct}%`,
                        backgroundColor: team.color 
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Assigned Slots: {filledSlots}</span>
                    <span>Total Slots: {totalSlots}</span>
                  </div>
                </div>

                {/* Team Members Count */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{members.length} Members</span>
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    👦 {boysCount} Boys • 👧 {girlsCount} Girls
                  </span>
                </div>

                {/* Leader details if any */}
                {team.leaderName && (
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Leader: <strong className="text-slate-800">{team.leaderName}</strong></span>
                    {team.leaderPhone && <span className="text-slate-500">({team.leaderPhone})</span>}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenTeamModal(team)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
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

      {/* CREATE / EDIT TEAM MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingTeam ? 'Edit Team Details' : 'Create New Team'}
                </h3>
              </div>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">TEAM NAME *</label>
                <input
                  type="text"
                  placeholder="e.g. Team A (Emeralds)"
                  value={teamForm.name}
                  onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TEAM CODE</label>
                  <input
                    type="text"
                    placeholder="e.g. T-A"
                    value={teamForm.code}
                    onChange={e => setTeamForm({ ...teamForm, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">THEME COLOR</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={teamForm.color}
                      onChange={e => setTeamForm({ ...teamForm, color: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={teamForm.color}
                      onChange={e => setTeamForm({ ...teamForm, color: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">DESCRIPTION / HOUSE SLOGAN</label>
                <input
                  type="text"
                  placeholder="e.g. Green House Pioneers"
                  value={teamForm.description}
                  onChange={e => setTeamForm({ ...teamForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">TEAM LEADER NAME</label>
                  <input
                    type="text"
                    placeholder="e.g. Zainul Abid"
                    value={teamForm.leaderName}
                    onChange={e => setTeamForm({ ...teamForm, leaderName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">LEADER PHONE</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94001 22334"
                    value={teamForm.leaderPhone}
                    onChange={e => setTeamForm({ ...teamForm, leaderPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
