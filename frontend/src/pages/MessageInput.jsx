import React, { useRef, useState } from 'react';
import { X, Image, Send } from 'lucide-react'; // make sure to import these
import { useChatStore } from '../store/useChatStore';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const { sendMessages, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    fileInputRef.current.value = null;
  };

  const handleSendMessages = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageFile) return;
    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setText('');
    removeImage();
  };

  return (
    <div className='p-4 pt-2 w-full border-t border-base-300 bg-base-100'>
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessages} className='flex items-center gap-2'>
        <div className='flex-1 flex items-center gap-2'>
          <input
            type="text"
            className='w-full input input-bordered input-sm sm:input-md rounded-lg'
            placeholder='Type a message...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`btn btn-circle btn-sm sm:flex hidden 
              ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            title="Attach Image"
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="btn btn-circle btn-sm bg-primary text-white hover:bg-primary/90"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
