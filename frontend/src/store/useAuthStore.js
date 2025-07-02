import { create } from 'zustand';
import { axiosInstance } from '../Database/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client'
const BASE_URL = "http://localhost:5005"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLogging: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkinAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res.data })
            get().connectSocket();
        } catch (error) {
            console.error("Auth check failed:", error);
            set({ authUser: null, isCheckingAuth: false });
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfuly");
            get().connectSocket();
        } catch (error) {

            toast.error(errorMsg); toast.error(error.response?.data?.message || "Signup failed");
        }

        finally {
            set({ isSigningUp: false })
        }
    },
    login: async (data) => {
        set({ isLogging: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket()


        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong during Login");
        } finally {
            set({ isLogging: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect();
        set({ socket: socket })
        socket.on("getOnlineUsers", (usersIds) => {
            set({ onlineUsers: usersIds })
        })
    }
    , disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }




}));
