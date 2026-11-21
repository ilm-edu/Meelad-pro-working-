import React, { useState, useMemo } from 'react';
import { useFest } from '../context/FestContext';
import { 
  Calendar, Clock, MapPin, Plus, Edit2, 
  Trash2, CheckCircle2, Play, Sparkles, Filter, Printer, X
} from 'lucide-react';
import { Stage, Program } from '../types';

export const ScheduleView: React.FC = () => {
  const { 
    stages, addStage, updateStage, deleteStage, 
    programs, updateProgram, categories, genderFilter 
  } = useFest();

  const [selectedStageId, setSelectedStageId] = useState<string>('All');
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [stageForm, setStageForm] = useState({
    name: '',
    description: '',
    location: ''
  });

  // Assign Schedule Modal
  const [schedulingProgram, setSchedulingProgram] = useState<Program | null>(null);
  const [schedForm, setSchedForm] = useState({
    stageId: stages[0]?.id || '',
    scheduledTime: '09:00 AM',
    durationMinutes: 20
  });

  const scheduledPrograms = useMemo(() => {
    return programs
      .filter(p => p.location === 'Stage' || p.scheduledTime)
      .filter(p => selectedStageId === 'All' || p.stageId === selectedStageId);
  }, [programs, selectedStageId]);

  const handleOpenStageModal = (st?: Stage) => {
    if (st) {
      setEditingStage(st);
      setStageForm({
        name: st.name,
        description: st.description || '',
        location: st.location || ''
      });
    } else {
      setEditingStage(null);
      setStageForm({
        name: '',
        description: '',
        location: ''
      });
    }
    setIsStageModalOpen(true);
  };

  const handleSaveStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageForm.name.trim()) return;

    if (editingStage) {
      updateStage({
        ...editingStage,
        name: stageForm.name,
        description: stageForm.description,
        location: stageForm.location
      });
    } else {
      addStage({
        name: stageForm.name,
        description: stageForm.description,
        location: stageForm.location
      });
    }
    setIsStageModalOpen(false);
  };

  const handleOpenScheduleModal = (prog: Program) => {
    setSchedulingProgram(prog);
    setSchedForm({
      stageId: prog.stageId || stages[0]?.id || '',
      scheduledTime: prog.scheduledTime || '09:30 AM',
      durationMinutes: prog.durationMinutes || 20
    });
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingProgram) return;

    updateProgram({
      ...schedulingProgram,
      stageId: schedForm.stageId,
      scheduledTime: schedForm.scheduledTime,
      durationMinutes: Number(schedForm.durationMinutes) || 20
    });
    setSchedulingProgram(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Stage Schedule & Venues</h2>
            <p className="text-xs text-slate-600">
              Manage multi-stage timelines, allocate event time slots, and track ongoing stage programs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => handleOpenStageModal()}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Stage / Hall</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Schedule</span>
            </button>
          </div>
        </div>

        {/* Stage Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 text-xs">
          <button
            onClick={() => setSelectedStageId('All')}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedStageId === 'All'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Venues ({stages.length})
          </button>
          {stages.map(st => (
            <div key={st.id} className="flex items-center gap-1">
              <button
                onClick={() => setSelectedStageId(st.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedStageId === st.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🎭 {st.name}
              </button>
              <button
                onClick={() => handleOpenStageModal(st)}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Edit Stage"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Timeline & Program List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduledPrograms.map((prog, index) => {
          const category = categories.find(c => c.id === prog.categoryId);
          const stage = stages.find(s => s.id === prog.stageId);

          return (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {prog.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      {stage?.name || 'Main Stage'}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    prog.status === 'Published' ? 'bg-emerald-100 text-emerald-800' :
                    prog.status === 'Evaluated' ? 'bg-amber-100 text-amber-800' :
                    prog.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {prog.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {prog.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {category?.name} • {prog.participants.length} Registered Contestants
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{prog.scheduledTime || 'Time Unset'}</span>
                  </div>
                  <span className="text-slate-600 text-[11px]">
                    ⏱️ {prog.durationMinutes || 20} mins
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenScheduleModal(prog)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Reschedule</span>
                </button>

                <button
                  onClick={() => {
                    const newStatus = prog.status === 'In Progress' ? 'Evaluated' : 'In Progress';
                    updateProgram({ ...prog, status: newStatus });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>{prog.status === 'In Progress' ? 'Mark Completed' : 'Start On Stage'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: ADD / EDIT STAGE */}
      {isStageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStage ? 'Edit Venue / Stage' : '+ Add Venue / Stage'}
              </h3>
              <button 
                onClick={() => setIsStageModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStage} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">STAGE / VENUE NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage 1 (Main Auditorium)"
                  value={stageForm.name}
                  onChange={e => setStageForm({ ...stageForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PHYSICAL LOCATION</label>
                <input
                  type="text"
                  placeholder="e.g. Ground Floor Main Hall"
                  value={stageForm.location}
                  onChange={e => setStageForm({ ...stageForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  placeholder="e.g. For Qiraath, Oratory, Madhu Songs..."
                  value={stageForm.description}
                  onChange={e => setStageForm({ ...stageForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE PROGRAM */}
      {schedulingProgram && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Schedule Program</h3>
                <p className="text-xs text-slate-600">{schedulingProgram.name}</p>
              </div>
              <button 
                onClick={() => setSchedulingProgram(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SELECT VENUE / STAGE *</label>
                <select
                  value={schedForm.stageId}
                  onChange={e => setSchedForm({ ...schedForm, stageId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                >
                  {stages.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SCHEDULED TIME (e.g. 10:30 AM / 02:00 PM) *</label>
                <input
                  type="text"
                  required
                  value={schedForm.scheduledTime}
                  onChange={e => setSchedForm({ ...schedForm, scheduledTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ALLOCATED DURATION (MINUTES)</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={schedForm.durationMinutes}
                  onChange={e => setSchedForm({ ...schedForm, durationMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSchedulingProgram(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
