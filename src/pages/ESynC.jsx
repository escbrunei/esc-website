import React from 'react';
import { ESynCChat } from '../components/ESynCChat.jsx';

// Full-page version of the chat (the popup is used everywhere else).
export default function ESynC() {
  return (
    <section className="chat-page">
      <div className="container chat-wrap">
        <ESynCChat />
      </div>
    </section>
  );
}
