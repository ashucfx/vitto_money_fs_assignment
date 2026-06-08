/**
 * Home / Landing page — hero section with CTAs to Apply and Dashboard.
 */

import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="home-page" id="home-page">
      <section className="hero">
        <div className="hero__content">
          <div className="hero__badge">Inclusive FinTech · Intern Assessment</div>
          <h1 className="hero__title">
            Financial Access<br />
            <span className="hero__title--accent">for Everyone</span>
          </h1>
          <p className="hero__description">
            Vitto helps local-language preferred borrowers apply for loans
            without barriers. Submit an application or review existing ones
            from the dashboard.
          </p>
          <div className="hero__actions">
            <Link to="/apply" className="btn btn--primary btn--lg" id="hero-apply-btn">
              Apply for a Loan
            </Link>
            <Link to="/dashboard" className="btn btn--outline btn--lg" id="hero-dashboard-btn">
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card hero__card--1">
            <div className="hero__card-icon">📋</div>
            <div>
              <div className="hero__card-label">Applications</div>
              <div className="hero__card-value">Tracked in real-time</div>
            </div>
          </div>
          <div className="hero__card hero__card--2">
            <div className="hero__card-icon">✅</div>
            <div>
              <div className="hero__card-label">Status Updates</div>
              <div className="hero__card-value">Instant approvals</div>
            </div>
          </div>
          <div className="hero__card hero__card--3">
            <div className="hero__card-icon">🌐</div>
            <div>
              <div className="hero__card-label">Languages</div>
              <div className="hero__card-value">Hindi · Tamil · Telugu · More</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
