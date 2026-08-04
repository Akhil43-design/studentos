import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GroupChatPage() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState('math-study');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Prof. Davis',
      avatar: 'D',
      time: '10:15 AM',
      text: 'Good morning everyone! Please review Chapter 4 calculus integration proofs before tomorrow\'s active exam.',
      role: 'teacher',
      isMe: false,
    },
    {
      id: 2,
      sender: 'Sarah Connor',
      avatar: 'S',
      time: '10:18 AM',
      text: 'Thanks Professor! Does anyone have the handwritten formula notebook from yesterday\'s lecture?',
      role: 'student',
      isMe: false,
    },
    {
      id: 3,
      sender: 'You',
      avatar: 'Y',
      time: '10:22 AM',
      text: 'Here are my notes on Integration by Parts! Check out the shared notebook below.',
      attachment: 'Calculus_Integration_Notes_Ch4.note',
      role: user?.role || 'student',
      isMe: true,
    }
  ]);

  const channels = [
    { id: 'math-study', name: '# Calculus & Linear Algebra', unread: 2, icon: 'functions' },
    { id: 'physics-lab', name: '# Quantum Mechanics Lab', unread: 0, icon: 'science' },
    { id: 'computer-sci', name: '# Data Structures & Algo', unread: 5, icon: 'code' },
    { id: 'announcements', name: '# Class Announcements', unread: 0, icon: 'campaign' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: user?.name || 'You',
        avatar: (user?.name || 'Y').charAt(0),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: inputText,
        role: user?.role || 'student',
        isMe: true,
      }
    ]);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-4 bg-[#f6fafe] dark:bg-[#091426] font-sans">
      {/* Sidebar Channels List */}
      <div className="w-full md:w-64 bg-white dark:bg-[#1e293b] rounded-2xl border border-[#dfe3e7] dark:border-slate-700 p-4 flex flex-col shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#dfe3e7] dark:border-slate-700 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#835500] dark:text-[#feae2c]">groups</span>
            <h2 className="font-display font-bold text-base text-[#091426] dark:text-white">Study Rooms</h2>
          </div>
          <button className="w-7 h-7 rounded-lg bg-[#f0f4f8] dark:bg-slate-800 flex items-center justify-center text-[#091426] dark:text-white hover:bg-[#feae2c] transition-colors">
            <span className="material-symbols-outlined text-base">add</span>
          </button>
        </div>

        <div className="space-y-1 overflow-y-auto flex-1">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeChannel === ch.id
                  ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] shadow-sm'
                  : 'text-[#45474c] dark:text-slate-300 hover:bg-[#f0f4f8] dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-base">{ch.icon}</span>
                <span className="truncate">{ch.name}</span>
              </div>
              {ch.unread > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#feae2c] text-[#091426]">
                  {ch.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Online Classmates Stats */}
        <div className="mt-4 pt-3 border-t border-[#dfe3e7] dark:border-slate-700 text-xs text-[#75777d] dark:text-slate-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>14 Students & 2 TAs online</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-2xl border border-[#dfe3e7] dark:border-slate-700 flex flex-col shadow-sm overflow-hidden">
        {/* Chat Top Bar */}
        <div className="px-6 py-4 border-b border-[#dfe3e7] dark:border-slate-700 flex items-center justify-between bg-[#f8fafc] dark:bg-slate-800/40">
          <div>
            <h3 className="font-display font-bold text-lg text-[#091426] dark:text-white">
              {channels.find(c => c.id === activeChannel)?.name}
            </h3>
            <p className="text-xs text-[#45474c] dark:text-slate-400">Classroom discussion & handwritten note exchanges</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined">description</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-xl ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                msg.isMe
                  ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426]'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-[#835500] dark:text-[#feae2c]'
              }`}>
                {msg.avatar}
              </div>

              <div>
                <div className={`flex items-center gap-2 mb-1 ${msg.isMe ? 'justify-end' : ''}`}>
                  <span className="text-xs font-bold text-[#091426] dark:text-white">{msg.sender}</span>
                  <span className="text-[10px] text-[#75777d] dark:text-slate-400">{msg.time}</span>
                </div>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.isMe
                    ? 'bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] rounded-tr-none'
                    : 'bg-[#f0f4f8] dark:bg-slate-800 text-[#171c1f] dark:text-slate-200 rounded-tl-none border border-[#dfe3e7] dark:border-slate-700'
                }`}>
                  {msg.text}

                  {msg.attachment && (
                    <div className="mt-3 p-2.5 rounded-xl bg-white/10 dark:bg-black/10 border border-white/20 flex items-center gap-3">
                      <span className="material-symbols-outlined">description</span>
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-xs truncate">{msg.attachment}</p>
                        <p className="text-[10px] opacity-80">SmartSlate Digital Notebook</p>
                      </div>
                      <button className="px-2.5 py-1 rounded-md bg-white text-[#091426] text-[10px] font-bold">Open</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-[#dfe3e7] dark:border-slate-700 bg-white dark:bg-[#1e293b]">
          <div className="flex items-center gap-2 bg-[#f0f4f8] dark:bg-slate-800/80 rounded-2xl p-2 border border-[#dfe3e7] dark:border-slate-700">
            <button type="button" className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <input
              type="text"
              placeholder="Type your discussion or share a notebook note..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[#091426] dark:text-white placeholder-[#75777d] dark:placeholder-slate-400 focus:outline-none px-2"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#091426] text-white dark:bg-[#feae2c] dark:text-[#091426] rounded-xl hover:opacity-90 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
