import React, { useState } from 'react';
import { Search, Send, ShieldCheck, User } from 'lucide-react';

const ChatView = ({ chats, setChats }) => {
  const [activeThreadId, setActiveThreadId] = useState(chats[0]?.id || null);
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');

  const activeThread = chats.find(c => c.id === activeThreadId);

  const filteredChats = chats.filter(c => 
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      sender: 'admin',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = chats.map(c => {
      if (c.id === activeThreadId) {
        return {
          ...c,
          unread: false,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    setChats(updated);
    setInputText('');
  };

  const handleSelectThread = (id) => {
    setActiveThreadId(id);
    const updated = chats.map(c => {
      if (c.id === id) {
        return { ...c, unread: false };
      }
      return c;
    });
    setChats(updated);
  };

  return (
    <div className="chat-layout">
      {/* Threads List Pane */}
      <div className="chat-threads">
        <div className="chat-threads-header">
          <div className="search-input-wrapper" style={{ maxWidth: '100%' }}>
            <Search size={16} className="search-input-icon" />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search chat users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-threads-list">
          {filteredChats.map(c => {
            const lastMsg = c.messages[c.messages.length - 1];
            return (
              <div 
                key={c.id} 
                className={`thread-item ${c.id === activeThreadId ? 'active' : ''}`}
                onClick={() => handleSelectThread(c.id)}
              >
                <img src={c.userAvatar} className="thread-avatar" alt="" />
                <div className="thread-info">
                  <div className="thread-name-row">
                    <span className="thread-name">{c.userName}</span>
                    <span className="thread-time">{lastMsg ? lastMsg.timestamp : ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="thread-preview">
                      {lastMsg ? `${lastMsg.sender === 'admin' ? 'You: ' : ''}${lastMsg.text}` : 'No messages'}
                    </span>
                    {c.unread && <div className="thread-unread-dot" />}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredChats.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
              No chats found.
            </div>
          )}
        </div>
      </div>

      {/* Main Conversation Window */}
      {activeThread ? (
        <div className="chat-window">
          <div className="chat-window-header">
            <img src={activeThread.userAvatar} className="thread-avatar" style={{ width: '40px', height: '40px' }} alt="" />
            <div>
              <span style={{ fontWeight: 800, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {activeThread.userName}
                <span className="badge-status info" style={{ fontSize: '9px', padding: '2px 6px', textTransform: 'uppercase' }}>
                  {activeThread.userRole}
                </span>
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>InkPen Mobile App support line</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages">
            {activeThread.messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                <p>{msg.text}</p>
                <div className="chat-bubble-time">{msg.timestamp}</div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              className="chat-input" 
              placeholder={`Send message to ${activeThread.userName}...`} 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ width: '48px', height: '48px', padding: 0 }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
          <User size={48} style={{ opacity: 0.3 }} />
          <span>Select a customer thread to begin chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatView;
