import React, { useState } from 'react';
import { 
  Camera, Sun, Moon, AlignLeft, AlignJustify, 
  Mail, MessageSquare, ClipboardCheck, XCircle, 
  Check, Sparkles 
} from 'lucide-react';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('default');

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Account & System Settings</h1>
        <p className="text-slate-500">Manage your clinical profile, notification flows, and interface preferences.</p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Profile Settings */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <div className="w-24 h-24 bg-teal-500 rounded-full" />
          </div>
          
          <h2 className="text-xl font-bold mb-1">Profile Settings</h2>
          <p className="text-sm text-slate-400 mb-8">Update your public identity and credentials.</p>

          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Dr. Sarah Chen" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="s.chen@clinicalcurator.md" 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl p-8 bg-slate-50/30">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="w-16 h-16 bg-slate-300 rounded-lg relative top-4 shadow-inner" />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-2 rounded-lg shadow-lg hover:bg-teal-700 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <span className="font-bold text-xs mb-1">Change Avatar</span>
              <span className="text-[10px] text-slate-400 uppercase">JPG or PNG, max 2MB</span>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button className="bg-teal-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-800 transition-all">
              Update Profile <Check size={18} />
            </button>
          </div>
        </section>

        {/* Right: Portal Display */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold mb-6">Portal Display</h2>
            
            {/* Theme Toggle */}
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Theme Mode</label>
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Sun size={16} /> Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Moon size={16} /> Dark
                </button>
              </div>
            </div>

            {/* Density Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Interface Density</label>
              <div className="space-y-2">
                <button 
                  onClick={() => setDensity('default')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${density === 'default' ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <AlignJustify size={18} className={density === 'default' ? 'text-teal-600' : 'text-slate-400'} />
                    <span className="font-bold">Default View</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${density === 'default' ? 'border-teal-500 bg-white' : 'border-slate-200'}`} />
                </button>
                <button 
                  onClick={() => setDensity('compact')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${density === 'compact' ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <AlignLeft size={18} className={density === 'compact' ? 'text-teal-600' : 'text-slate-400'} />
                    <span className="font-bold">Compact View</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-4 flex items-center justify-center ${density === 'compact' ? 'border-teal-500 bg-white' : 'border-slate-200'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Shortcut Card */}
          <div className="bg-teal-800 rounded-2xl p-6 text-white relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Sparkles size={120} />
            </div>
            <Sparkles size={24} className="mb-4 text-teal-300" />
            <h3 className="font-bold mb-2">Quick Shortcut</h3>
            <p className="text-xs text-teal-100 leading-relaxed">
              Press <kbd className="bg-teal-700 px-1 rounded">⌘+D</kbd> anywhere to toggle density on the fly.
            </p>
          </div>
        </div>

        {/* Bottom: Notification Preferences */}
        <section className="col-span-12 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold">Notification Preferences</h2>
              <p className="text-sm text-slate-400">Control how and when you receive portal updates.</p>
            </div>
            <div className="flex gap-4">
              <button className="text-sm font-bold text-slate-400 hover:text-slate-600">Disable All</button>
              <button className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-lg">Select Default</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Email Alerts', desc: 'Daily summary of all vision care orders.', icon: <Mail size={18} />, active: true },
              { title: 'SMS Updates', desc: 'Critical alerts for high-priority claims.', icon: <MessageSquare size={18} />, active: false },
              { title: 'Order Status', desc: 'Real-time tracking of lab shipments.', icon: <ClipboardCheck size={18} />, active: true },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-slate-50/30">
                <div className="flex gap-4 items-center">
                  <div className="bg-teal-50 text-teal-600 p-3 rounded-xl">{pref.icon}</div>
                  <div>
                    <div className="font-bold text-sm">{pref.title}</div>
                    <div className="text-[10px] text-slate-400 max-w-[120px]">{pref.desc}</div>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${pref.active ? 'bg-teal-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pref.active ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <footer className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-center">
        <button className="text-red-600 font-bold text-xs flex items-center gap-2 hover:underline">
          <XCircle size={16} /> Deactivate Admin Account
        </button>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-lg text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-all">
            Discard Changes
          </button>
          <button className="px-8 py-2 rounded-lg text-white font-bold bg-teal-800 hover:bg-teal-900 shadow-lg shadow-teal-900/20 transition-all">
            Save All Settings
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Settings;