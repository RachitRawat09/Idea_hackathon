import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { getMessages, sendMessage, getConversations, acceptConversation } from '../api/messages.jsx';
import { markAsSold } from '../api/listings.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaComments } from 'react-icons/fa';

const Messages = () => {
  const { user, token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [markingSold, setMarkingSold] = useState(false);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user || !token) return;
      try {
        const convos = await getConversations(token);
        setConversations(convos);
      } catch (err) {
        console.error('Failed to load conversations:', err);
        toast.error('Failed to load conversations.');
      }
    };
    fetchConversations();
  }, [user, token]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    const fetchMessagesForConversation = async () => {
      if (!selectedConversation) return;
      setLoading(true);
      try {
        // Get the other participant
        const otherParticipant = selectedConversation.participants.find(
          p => p._id !== user?.id && p?._id !== user?._id
        );
        if (!otherParticipant) return;
        
        const msgs = await getMessages(otherParticipant._id, selectedConversation.listing?._id, token);
        setMessages(msgs);
      } catch (err) {
        console.error('Failed to load messages:', err);
        toast.error('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation && token) fetchMessagesForConversation();
  }, [selectedConversation, token, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    setLoading(true);
    try {
      const receiver = selectedConversation.participants.find(
        p => p._id !== user?.id && p?._id !== user?._id
      );
      if (!receiver) {
        toast.error('Invalid conversation');
        return;
      }

      await sendMessage({ 
        receiver: receiver._id || receiver.id,
        content: newMessage,
        conversationId: selectedConversation._id,
        listing: selectedConversation.listing?._id
      }, token);
      
      setNewMessage('');
      toast.success('Message sent!');
      
      // Refresh messages
      const msgs = await getMessages(receiver._id || receiver.id, selectedConversation.listing?._id, token);
      setMessages(msgs);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptConversation = async (conversationId) => {
    try {
      await acceptConversation(conversationId, token);
      toast.success('Conversation accepted!');
      // Refresh conversations
      const convos = await getConversations(token);
      setConversations(convos);
    } catch (err) {
      toast.error('Failed to accept conversation.');
    }
  };

  const handleMarkAsSold = async () => {
    if (!selectedConversation?.listing?._id) return;
    
    setMarkingSold(true);
    try {
      const receiver = selectedConversation.participants.find(
        p => p._id !== user?.id && p?._id !== user?._id
      );
      await markAsSold(selectedConversation.listing._id, receiver?._id || receiver?.id, token);
      toast.success('Item marked as sold!');
      
      // Refresh conversations to update listing status
      const convos = await getConversations(token);
      setConversations(convos);
    } catch (err) {
      toast.error('Failed to mark item as sold.');
    } finally {
      setMarkingSold(false);
    }
  };

  // Helper to get the other participant
  const getOtherParticipant = (conversation) => {
    if (!user || !conversation?.participants) return null;
    return conversation.participants.find(
      p => String(p._id) !== String(user.id) && String(p._id) !== String(user._id)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="flex gap-6">
        {/* Conversations List */}
        <aside className="w-64 bg-white rounded-lg shadow p-4 h-[32rem] overflow-y-auto">
          <h2 className="font-semibold mb-4">Conversations</h2>
          {conversations.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <FaComments className="mx-auto mb-2 text-gray-400" size={32} />
              <p>No conversations yet</p>
              <p className="text-sm">Start by messaging a seller from a product page</p>
            </div>
          ) : (
            <ul>
              {conversations.map((convo) => {
                const otherUser = getOtherParticipant(convo);
                const isPending = convo.status === 'pending';
                const canAccept = isPending && String(convo.initiatedBy) !== String(user?.id) && String(convo.initiatedBy) !== String(user?._id);
                
                return (
                  <li
                    key={convo._id}
                    className={`p-3 rounded cursor-pointer mb-2 border ${
                      selectedConversation?._id === convo._id 
                        ? 'bg-indigo-100 border-indigo-300' 
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => setSelectedConversation(convo)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {otherUser?.name || 'Unknown User'}
                          {isPending && canAccept && (
                            <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                              New Request
                            </span>
                          )}
                          {isPending && !canAccept && (
                            <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                              Waiting
                            </span>
                          )}
                        </p>
                        {convo.listing && (
                          <p className="text-sm text-gray-600">{convo.listing.title}</p>
                        )}
                      </div>
                    </div>
                    {canAccept && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptConversation(convo._id);
                        }}
                        className="mt-2 w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Accept
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
        
        {/* Chat Area */}
        <main className="flex-1 bg-white rounded-lg shadow p-6 flex flex-col h-[32rem]">
          {!selectedConversation ? (
            <div className="text-gray-500 flex-1 flex items-center justify-center">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">
                  {getOtherParticipant(selectedConversation)?.name || 'Unknown User'}
                </div>
                {selectedConversation.status === 'accepted' && 
                 selectedConversation.listing && 
                 String(selectedConversation.listing.seller || selectedConversation.initiatedBy) === String(user?.id || user?._id) && 
                 !selectedConversation.listing.isSold && (
                  <button
                    onClick={handleMarkAsSold}
                    disabled={markingSold}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
                  >
                    <FaCheckCircle />
                    {markingSold ? 'Marking...' : 'Mark as Sold'}
                  </button>
                )}
              </div>
              
              {selectedConversation.listing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">{selectedConversation.listing.title}</h4>
                      <p className="text-sm text-blue-700">
                        ${selectedConversation.listing.price} • {selectedConversation.listing.category}
                      </p>
                    </div>
                    {selectedConversation.listing.isSold && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        SOLD
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto mb-4 border rounded p-2 bg-gray-50">
                {loading ? (
                  <div>Loading...</div>
                ) : messages.length === 0 ? (
                  <div className="text-gray-400">
                    {selectedConversation.status === 'pending' ? 'Waiting for acceptance...' : 'No messages yet'}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-2 flex ${String(msg.sender) === String(user?.id || user?._id) ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`px-3 py-2 rounded-lg max-w-xs ${
                        String(msg.sender) === String(user?.id || user?._id) 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
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
                  placeholder={selectedConversation.status === 'pending' ? 'Waiting for acceptance...' : 'Type your message...'}
                  className="flex-1 border rounded px-3 py-2"
                  disabled={!selectedConversation || selectedConversation.status !== 'accepted'}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!selectedConversation || !newMessage.trim() || selectedConversation.status !== 'accepted'}
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
