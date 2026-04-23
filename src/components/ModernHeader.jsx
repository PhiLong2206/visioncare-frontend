import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, ChevronLeft, User, CheckCircle2, Package, Clock3, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getNotifications, getUnreadCount, markAsRead } from '../api/notificationAPI';

const ModernHeader = ({ title, showBackButton = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data || []);
      const countData = await getUnreadCount();
      setUnreadCount(countData.count || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 1 minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'PreOrder': return <Package className="text-blue-500" size={16} />;
      case 'System': return <Clock3 className="text-amber-500" size={16} />;
      case 'Alert': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-7 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-600 transition hover:bg-slate-50 p-2 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <p className="text-[18px] font-semibold text-slate-800 leading-tight">
            {title}
          </p>
          <p className="text-[12px] font-medium text-[#3b82f6] uppercase tracking-wider">
            VisionCare • {user?.role || 'Staff'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 rounded-full"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-[360px] rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <h3 className="font-bold text-slate-800">Thông báo</h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {unreadCount} mới
                </span>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-sm">Không có thông báo nào</p>
                  </div>
                ) : (
                  notifications.map((note) => (
                    <div 
                      key={note.notificationId}
                      className={`flex gap-3 p-4 border-b border-slate-50 transition hover:bg-slate-50 cursor-pointer ${!note.isRead ? 'bg-blue-50/30' : ''}`}
                      onClick={() => !note.isRead && handleMarkAsRead(note.notificationId)}
                    >
                      <div className="mt-0.5 shrink-0">
                        {getNotificationIcon(note.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm leading-tight ${note.isRead ? 'text-slate-600' : 'text-slate-900 font-bold'}`}>
                            {note.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {note.message}
                        </p>
                      </div>
                      {!note.isRead && (
                        <div className="mt-1.5 shrink-0">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              <div className="border-t border-slate-100 p-3 text-center">
                <button className="text-xs font-semibold text-[#3b82f6] hover:underline">
                  Xem tất cả thông báo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none mb-1">
              {user?.fullName}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              ID: #{user?.userId}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-95 shadow-md shadow-slate-200"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
