import { ArrowLeft, Mic, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="p-4 border-b border-base-300 bg-base-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className=" text-primary hover:text-primary/80 transition"
            aria-label="Back to contacts"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="text-primary hover:text-primary/80 transition"
            aria-label="Voice call"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            className="text-primary hover:text-primary/80 transition"
            aria-label="Video call"
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
