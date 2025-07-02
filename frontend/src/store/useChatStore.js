// ✅ useChatStore.js (Zustand Store)
import { create } from 'zustand';
import { axiosInstance } from '../Database/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  userLastActivityMap: {}, // ✅ New: Track last message time

  setSelectedUser: (user) => set({ selectedUser: user }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  updateUserLastActivity: (userId) => {
    set((state) => ({
      userLastActivityMap: {
        ...state.userLastActivityMap,
        [userId]: Date.now(),
      },
    }));
  },

  ToMessahes: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      get().updateUserLastActivity(newMessage.senderId);
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  fromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  sendMessages: async (messageData) => {
    const { selectedUser, messages, updateUserLastActivity } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      updateUserLastActivity(selectedUser._id);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
