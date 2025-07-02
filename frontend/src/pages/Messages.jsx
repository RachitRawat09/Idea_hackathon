import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { getAllUsers, getMessages, sendMessage } from '../api/messages.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Messages = () => {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all users for chat selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (err) {
        toast.error('Failed to load users.');
      }
    };
    if (token) fetchUsers();
  }, [token]);

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      setLoading(true);
      try {
        const data = await getMessages(selectedUser._id, null, token);
        setMessages(data);
      } catch (err) {
        toast.error('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };
    if (selectedUser && token) fetchMessages();
  }, [selectedUser, token]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const sent = await sendMessage({ receiver: selectedUser._id, content: newMessage }, token);
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
      toast.success('Message sent!');
    } catch (err) {
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="flex gap-6">
        {/* User List */}
        <aside className="w-64 bg-white rounded-lg shadow p-4 h-[32rem] overflow-y-auto">
          <h2 className="font-semibold mb-4">Users</h2>
          {users.length === 0 ? (
            <div className="text-gray-500">No users found.</div>
          ) : (
            <ul>
              {users.map((u) => (
                <li
                  key={u._id}
                  className={`p-2 rounded cursor-pointer mb-1 ${selectedUser && selectedUser._id === u._id ? 'bg-indigo-100 font-bold' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedUser(u)}
                >
                  {u.name} <span className="text-xs text-gray-400">({u.email})</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
        {/* Chat Area */}
        <main className="flex-1 bg-white rounded-lg shadow p-6 flex flex-col h-[32rem]">
          {!selectedUser ? (
            <div className="text-gray-500 flex-1 flex items-center justify-center">Select a user to start chatting.</div>
          ) : (
            <>
              <div className="font-semibold mb-2">Chat with {selectedUser.name}</div>
              <div className="flex-1 overflow-y-auto mb-4 border rounded p-2 bg-gray-50">
                {loading ? (
                  <div>Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="text-gray-400">No messages yet.</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-2 flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender === user.id ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {msg.content}
                        <div className="text-xs text-gray-400 mt-1 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded px-3 py-2"
                  disabled={!selectedUser}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!selectedUser || !newMessage.trim()}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;