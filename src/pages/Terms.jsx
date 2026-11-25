import React from 'react';
import { CONFIG } from '../config.js';

const UPDATED = '26 November 2026';

const SECTIONS = [
  ['use', 'Terms of Use'],
  ['data', 'Data and information disclaimer'],
  ['ai', 'ESynC, our AI assistant'],
  ['liability', 'Limitation of liability'],
  ['links', 'News and third-party links'],
  ['ip', 'Content and intellectual property'],
  ['merch', 'Merch and forms'],
  ['privacy', 'Privacy Notice'],
  ['changes', 'Changes and governing law'],
];

export default function Terms() {
  const mail = <a href={`mailto:${CONFIG.ESC_EMAIL}`}>{CONFIG.ESC_EMAIL}</a>;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Legal</p>
          <h1>Terms of Use and Privacy</h1>
          <p className="lead">Last updated {UPDATED}. By using this website you agree to these terms.</p>
        </div>
      </section>

      <section className="section container legal">
        <nav className="legal-toc" aria-label="On this page">
          <p className="legal-toc-h">On this page</p>
          <ol>{SECTIONS.map(([id, t]) => <li key={id}><a href={`#/terms`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}>{t}</a></li>)}</ol>
        </nav>

        <div className="legal-body">
          <div className="legal-summary">
            <h2>In short</h2>
            <ul>
              <li>Everything here is for <span className="hl">education and general information only</span>. It is not financial, investment, legal or professional advice.</li>
              <li>We work hard to keep data accurate and to link every figure to its official source, but we <span className="hl">cannot guarantee</span> it is complete, current or error-free. Always check the original source before relying on a figure.</li>
              <li>You use the website, its data and ESynC <span className="hl">at your own risk</span>.</li>
              <li>We do not ask you to create an account. Please don’t share personal information with ESynC.</li>
            </ul>
          </div>

          <h2 id="use">1. Terms of Use</h2>
          <p>This website is run by the Economic Students’ Chamber (DPE) Brunei (“ESC”, “we”, “us”), a student-led, non-profit association in Brunei Darussalam. By accessing or using the website you agree to these Terms. If you do not agree, please do not use the website.</p>
          <p>You agree to use the website lawfully and not to misuse it, for example by trying to disrupt it, overload ESynC with automated requests, or present our content as official government statistics.</p>

          <h2 id="data">2. Data and information disclaimer</h2>
          <p>The Brunei Economy dashboard, Economics Lab, publications, news summaries and other content are provided for <strong>educational and general information purposes only</strong>. They do not constitute financial, investment, economic, legal, tax or other professional advice, and should not be the sole basis for any decision.</p>
          <p>Figures are taken from official and reputable sources such as the Department of Economic Planning and Statistics (DEPS), Brunei Darussalam Central Bank (BDCB) and the Ministry of Finance and Economy, and are linked to those sources wherever possible. However:</p>
          <ul>
            <li>official statistics are often revised, and our copy may not reflect the latest revision;</li>
            <li>errors can occur when data is collected, transcribed, calculated, rounded or charted;</li>
            <li>some figures are derived or summarised by ESC (for example totals or growth rates), and are labelled as such where practical.</li>
          </ul>
          <p>All content is provided <strong>“as is” and “as available”</strong>, without any warranty, express or implied, as to accuracy, completeness, timeliness, reliability or fitness for a particular purpose. <strong>The original source prevails</strong> over anything shown on this website. If you spot an error, please tell us at {mail} and we will correct it.</p>

          <h2 id="ai">3. ESynC, our AI assistant</h2>
          <p>ESynC is an automated AI assistant powered by a third-party AI model (Google Gemini). Its answers are generated automatically, may be inaccurate, incomplete or out of date, and are <strong>not reviewed by ESC</strong> before they are shown. ESynC can make mistakes even when it lists sources. Treat its answers as a starting point for learning, check important information against the sources it cites, and do not rely on it for financial, legal, medical or other professional decisions. ESynC’s answers do not represent the views of ESC, DPE or any government body.</p>

          <h2 id="liability">4. Limitation of liability</h2>
          <p>To the fullest extent permitted by the laws of Brunei Darussalam, ESC, its committee members, members and volunteers shall <strong>not be liable</strong> for any loss or damage of any kind, whether direct, indirect, incidental or consequential, including financial loss, loss of profits or loss of data, arising from or in connection with your use of, or reliance on, this website, its data, publications, ESynC, or any linked website. Nothing in these Terms excludes any liability that cannot be excluded by law.</p>

          <h2 id="links">5. News and third-party links</h2>
          <p>The News page shows headlines and short excerpts collected automatically from third-party publishers, with links to the original articles. We do not control and are not responsible for third-party content, websites or services, and a link does not mean we endorse them. Copyright in news content belongs to its publishers.</p>

          <h2 id="ip">6. Content and intellectual property</h2>
          <p>The ESC name, crest, door logo, ESynC character, designs and ESC publications belong to ESC. You may share links to our pages and quote short extracts for non-commercial or educational purposes with credit to “Economic Students’ Chamber (DPE) Brunei”. Please do not copy, alter or republish our content or branding, or use it commercially, without written permission. Statistical data remains the property of its original publishers. Some background photos and videos are free stock media used under their providers’ licences (for example the Pexels License), and remain the property of their creators; credits are shown where they appear.</p>

          <h2 id="merch">7. Merch and forms</h2>
          <p>Merch orders and membership applications are made through Google Forms. Product images are for illustration, and colours, designs and availability may differ. Prices, payment and collection details are confirmed by ESC after you submit an order form.</p>

          <h2 id="privacy">8. Privacy Notice</h2>
          <p>We respect your privacy and aim to handle personal data in line with Brunei’s <strong>Personal Data Protection Order, 2025 (PDPO)</strong>.</p>
          <ul>
            <li><strong>Browsing.</strong> The website has no user accounts and does not use advertising or tracking cookies. Your browser may store small settings, such as the current ESynC conversation, on your own device for the current session only.</li>
            <li><strong>Hosting.</strong> The website is hosted on GitHub Pages, which may log technical information such as IP addresses for security and operation. Publisher logos on the News page are loaded through Google’s favicon service.</li>
            <li><strong>ESynC.</strong> Messages you type are sent through our server (Cloudflare) to Google’s Gemini service to generate an answer. ESC does not keep a record of conversations. Google may process and, under its terms for free services, use these messages to improve its products. <strong>Do not enter personal, sensitive or confidential information into ESynC.</strong></li>
            <li><strong>Forms.</strong> When you join ESC or order merch, the details you enter in Google Forms (such as your name and contact details) are collected by ESC to process your application or order and to contact you about it. We do not sell your personal data, and we share it only where needed to fulfil your request or where required by law.</li>
            <li><strong>Your rights.</strong> You may ask to access or correct your personal data, or withdraw your consent, by emailing {mail}.</li>
          </ul>

          <h2 id="changes">9. Changes and governing law</h2>
          <p>We may update these Terms and this Privacy Notice at any time; the date at the top shows the latest version, and continued use of the website means you accept the changes. These Terms are governed by the laws of Brunei Darussalam. Questions: {mail}.</p>
        </div>
      </section>
    </>
  );
}
