import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { axiosInstance } from '../Database/axios';
import toast from 'react-hot-toast';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const { getContactRequests } = useChatStore();

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await getContactRequests();
      setRequests(data);
    };
    fetchRequests();
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/contacts/accept-request/${requestId}`);
      toast.success("Request accepted");
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      toast.error("Failed to accept request");
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Pending Contact Requests</h3>
      {requests.length === 0 ? (
        <p className="text-sm text-zinc-500">No pending requests</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="flex items-center justify-between mb-2 p-2 bg-base-200 rounded">
            <div className="flex items-center gap-2">
              <img
                src={req.senderId.profilePic || "/avatar.png"}
                alt={req.senderId.fullName}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm">{req.senderId.fullName}</span>
            </div>
            <button className="btn btn-xs btn-primary" onClick={() => acceptRequest(req._id)}>
              Accept
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingRequests;
