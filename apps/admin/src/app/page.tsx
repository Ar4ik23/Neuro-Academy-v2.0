"use client";

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Academy OS
          </h1>
          <p className="text-slate-500 text-sm">Centralized Management System</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
            Support
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-500 transition-colors">
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatsCard title="Total Students" value="1,284" trend="+12%" />
        <StatsCard title="Course Completions" value="856" trend="+5%" />
        <StatsCard title="Revenue (Stars)" value="42.5K" trend="+24%" />
        <StatsCard title="Active AI Assists" value="312" trend="+8%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Course Intake</h2>
            <button className="text-indigo-400 text-sm hover:underline">View All</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 text-sm border-b border-slate-800">
                <th className="pb-4">Student</th>
                <th className="pb-4">Course</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <StudentRow name="Alex Johnson" course="AI Fundamentals" status="Active" progress={85} />
              <StudentRow name="Sarah Chen" course="Growth Hacking" status="Completed" progress={100} />
              <StudentRow name="Michael Ross" course="Web3 Mastery" status="Active" progress={42} />
              <StudentRow name="Emma Wilson" course="AI Fundamentals" status="Dropped" progress={12} />
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
           <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
           <div className="flex flex-col gap-4">
             <ActionBtn label="Create New Course" icon="📚" />
             <ActionBtn label="Export Sales Data" icon="📊" />
             <ActionBtn label="AI Configuration" icon="⚙️" />
             <ActionBtn label="System Logs" icon="📋" />
           </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, trend }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
      <div className="flex justify-between items-end">
        <span className="text-3xl font-black text-white">{value}</span>
        <span className="text-green-400 text-xs font-bold mb-1">{trend}</span>
      </div>
    </div>
  );
}

function StudentRow({ name, course, status, progress }: any) {
  return (
    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
      <td className="py-4 font-medium text-white">{name}</td>
      <td className="py-4 text-slate-400">{course}</td>
      <td className="py-4">
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
          status === 'Completed' ? 'bg-green-500/20 text-green-400' :
          status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {status.toUpperCase()}
        </span>
      </td>
      <td className="py-4 text-right">
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </td>
    </tr>
  );
}

function ActionBtn({ label, icon }: any) {
  return (
    <button className="flex items-center gap-4 w-full p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all hover:translate-x-1">
      <span className="text-xl">{icon}</span>
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}
