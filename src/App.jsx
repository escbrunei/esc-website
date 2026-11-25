import React from 'react';
import { useRoute } from './lib/router.js';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import FloatingESynC from './components/FloatingESynC.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Lab from './pages/Lab.jsx';
import News from './pages/News.jsx';
import Merch from './pages/Merch.jsx';
import ESynC from './pages/ESynC.jsx';
import Events from './pages/Events.jsx';
import Handshake from './pages/Handshake.jsx';
import About from './pages/About.jsx';
import Join from './pages/Join.jsx';
import Contact from './pages/Contact.jsx';

const PAGES = {
  '/': Home,
  '/dashboard': Dashboard,
  '/news': News,
  '/merch': Merch,
  '/lab': Lab,
  '/esync': ESynC,
  '/events': Events,
  '/invisible-handshake': Handshake,
  '/about': About,
  '/join': Join,
  '/contact': Contact,
};

export default function App() {
  const route = useRoute();
  const Page = PAGES[route.path] || NotFound;
  return (
    <>
      <a className="skip-link" href="#/" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <Nav path={route.path} />
      <main id="main" tabIndex={-1}>
        <Page params={route.params} />
      </main>
      <Footer />
      <FloatingESynC path={route.path} />
    </>
  );
}

function NotFound() {
  return (
    <section className="section container">
      <h1>Page not found</h1>
      <p><a href="#/">Go to the homepage</a></p>
    </section>
  );
}
