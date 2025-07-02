import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './MessageSkeleton';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, fromMessages, ToMessahes } = useChatStore();
  const { authUser } = useAuthStore();

  const scrollRef = useRef(null);

  // Fetch messages on user select
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      ToMessahes()
      return () => fromMessages()
    }
  }, [selectedUser?._id, getMessages]);

  // Auto scroll on message change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-200">
        {messages.map((message) => {
          const isSender = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 h-10 rounded-full border border-gray-300 overflow-hidden">
                  <img
                    src={
                      isSender
                        ? authUser.profilePic || '/avatar.png'
                        : selectedUser.profilePic || '/avatar.png'
                    }
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs text-gray-500 ml-2">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>

              <div className="chat-bubble bg-white/80 text-gray-900 backdrop-blur-md shadow-md rounded-xl px-4 py-2 max-w-xs sm:max-w-sm">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="rounded-md mb-2 max-w-full"
                  />
                )}
                {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
              </div>
            </div>
          );
        })}

        {/* 🔽 Auto scroll target */}
        <div ref={scrollRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
