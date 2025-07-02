// ✅ Full Working Setup with Contact Request Fetch in Sidebar

import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './SidebarSkeleton';
import { Search, UserPlus, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { axiosInstance } from '../Database/axios';

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    isUsersLoading,
    setSelectedUser,
    userLastActivityMap,
    searchUsers,
    sendContactRequest,
    getContactRequests,
    getAcceptedUsers,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getUsers();
    fetchRequests();
    getAcceptedUsers();
  }, []);

  const fetchRequests = async () => {
    const data = await getContactRequests();
    setRequests(data);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = await searchUsers(searchQuery);
    setSearchResults(results);
  };

  const acceptRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/contacts/accept-request/${requestId}`);
      toast.success('Request accepted');
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  const sortedUsers = [...users].sort((a, b) => {
    const timeA = userLastActivityMap[a._id] || 0;
    const timeB = userLastActivityMap[b._id] || 0;
    return timeB - timeA;
  });

  return (
    <aside className="h-full w-full sm:w-72 lg:w-auto border-r flex flex-col transition-all duration-200 bg-base-100">
      <div className="border-b w-full p-4">
        <div className="flex gap-9 items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Users className="size-6 text-primary" />
            <span className="font-medium text-base lg:text-lg text-gray-800">Contacts</span>
          </div>

          <button className="flex items-center gap-1 text-sm lg:text-base font-medium text-primary hover:text-primary/80 transition">
            <UserPlus className="size-5" />
            <span className="hidden sm:inline">Create Group</span>
          </button>
        </div>
      </div>

      {requests.length > 0 && (
        <div className="px-4 pt-2 pb-3">
          <div className="text-sm font-medium text-zinc-500 mb-2">Contact Requests</div>
          {requests.map((req) => (
            <div
              key={req._id}
              className="flex items-center justify-between mb-1 p-2 rounded bg-base-200"
            >
              <div className="flex items-center gap-2">
                <img
                  src={req.senderId.profilePic || '/avatar.png'}
                  alt={req.senderId.fullName}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{req.senderId.fullName}</span>
              </div>
              <button
                onClick={() => acceptRequest(req._id)}
                className="btn btn-xs btn-primary"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative px-4 pb-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by name or email..."
          className="input input-sm input-bordered w-full pr-10"
        />
        <Search
          className="w-4 h-4 absolute right-6 top-1/2 -translate-y-1/2 text-base-content/60 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {searchResults.length > 0 && (
        <div className="px-4 pb-2">
          <div className="text-xs text-zinc-400 mb-1">Search Results:</div>
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between gap-2 mb-1 bg-base-200 p-2 rounded"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.profilePic || '/avatar.png'}
                  alt={user.fullName}
                  className="size-8 rounded-full object-cover border"
                />
                <span className="text-sm truncate">{user.fullName}</span>
              </div>
              <button
                onClick={() => sendContactRequest(user._id)}
                className="btn btn-xs btn-primary"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-y-auto flex-1 py-2 pr-1">
        {sortedUsers.map((user) => {
          const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user._id);
          const isActive = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full px-4 py-3 flex items-center justify-between gap-3 transition-colors duration-200 ${isActive ? 'bg-base-300' : 'hover:bg-base-100'
                }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <img
                    src={user.profilePic || '/avatar.png'}
                    alt={user.fullName}
                    onError={(e) => (e.target.src = '/avatar.png')}
                    className="size-12 object-cover rounded-full border border-base-200"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </div>

                <div className="text-left min-w-0">
                  <div className="font-medium truncate text-sm lg:text-base">
                    {user.fullName}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>

              <div className="text-xs text-right text-zinc-400 whitespace-nowrap">
                {userLastActivityMap[user._id] ? 'Active' : 'New'}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
