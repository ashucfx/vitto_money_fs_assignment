/**
 * Apply Page — loan application form.
 *
 * Validates all fields client-side before submitting.
 * On success, shows a confirmation with the application reference number.
 */

import { useState } from 'react';
import { createApplication } from '../api/client';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];

const INITIAL_FORM = {
  name:     '',
  mobile:   '',
  amount:   '',
  purpose:  '',
  language: '',
};

export default function Apply() {
  const [form, setForm]           = useState(INITIAL_FORM);
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(null); // holds successful application

  // ── Client-side validation ─────────────────────────────────────────────────
  function validate(fields) {
    const errs = {};

    if (!fields.name || fields.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }
    if (!fields.mobile || !/^\d{10}$/.test(fields.mobile.trim())) {
      errs.mobile = 'Enter a valid 10-digit mobile number.';
    }
    const amt = parseFloat(fields.amount);
    if (!fields.amount || isNaN(amt) || amt <= 0) {
      errs.amount = 'Enter a valid loan amount greater than 0.';
    }
    if (!fields.purpose || fields.purpose.trim().length < 3) {
      errs.purpose = 'Loan purpose must be at least 3 characters.';
    }
    if (!fields.language) {
      errs.language = 'Please select a preferred language.';
    }

    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await createApplication({
        ...form,
        amount: parseFloat(form.amount),
      });
      setSubmitted(response.data.data);
      setForm(INITIAL_FORM);
      toast.success('Application submitted successfully!');
    } catch (err) {
      if (err.response?.data?.errors) {
        // Backend validation errors
        err.response.data.errors.forEach((e) => toast.error(e.msg || e));
      } else {
        toast.error(err.response?.data?.error || 'Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="page-container" id="apply-success">
        <div className="success-card">
          <div className="success-icon" aria-hidden="true">
            <CheckCircle size={48} />
          </div>
          <h2 className="success-title">Application Submitted!</h2>
          <p className="success-subtitle">
            Your loan application has been received and is under review.
          </p>
          <div className="success-ref">
            <span className="success-ref__label">Reference Number</span>
            <span className="success-ref__value" id="reference-number">
              {submitted.id}
            </span>
          </div>
          <div className="success-details">
            <div className="success-details__row">
              <span>Applicant</span>
              <strong>{submitted.name}</strong>
            </div>
            <div className="success-details__row">
              <span>Loan Amount</span>
              <strong>₹{Number(submitted.amount).toLocaleString('en-IN')}</strong>
            </div>
            <div className="success-details__row">
              <span>Purpose</span>
              <strong>{submitted.purpose}</strong>
            </div>
            <div className="success-details__row">
              <span>Status</span>
              <strong className="badge-pending">Pending Review</strong>
            </div>
          </div>
          <button
            className="btn btn--primary"
            onClick={() => setSubmitted(null)}
            id="apply-again-btn"
          >
            Submit Another Application
          </button>
        </div>
      </main>
    );
  }

  // ── Application form ───────────────────────────────────────────────────────
  return (
    <main className="page-container" id="apply-page">
      <div className="form-card">
        <div className="form-card__header">
          <h1 className="form-card__title">Apply for a Loan</h1>
          <p className="form-card__subtitle">
            All fields are required. We'll process your application within 24 hours.
          </p>
        </div>

        {errors.server && (
          <div className="alert alert--error" role="alert">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate id="loan-application-form">
          {/* Name */}
          <div className={`form-group ${errors.name ? 'form-group--error' : ''}`}>
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={handleChange}
              aria-describedby={errors.name ? 'name-error' : undefined}
              autoComplete="name"
            />
            {errors.name && (
              <span className="form-error" id="name-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Mobile */}
          <div className={`form-group ${errors.mobile ? 'form-group--error' : ''}`}>
            <label htmlFor="mobile" className="form-label">Mobile Number</label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              className="form-input"
              placeholder="10-digit number"
              value={form.mobile}
              onChange={handleChange}
              aria-describedby={errors.mobile ? 'mobile-error' : undefined}
              autoComplete="tel"
              maxLength={10}
            />
            {errors.mobile && (
              <span className="form-error" id="mobile-error" role="alert">
                {errors.mobile}
              </span>
            )}
          </div>

          {/* Amount */}
          <div className={`form-group ${errors.amount ? 'form-group--error' : ''}`}>
            <label htmlFor="amount" className="form-label">Loan Amount (₹)</label>
            <div className="input-prefix-wrapper">
              <span className="input-prefix" aria-hidden="true">₹</span>
              <input
                id="amount"
                name="amount"
                type="number"
                className="form-input form-input--prefixed"
                placeholder="e.g. 50000"
                value={form.amount}
                onChange={handleChange}
                aria-describedby={errors.amount ? 'amount-error' : undefined}
                min="1"
                step="1"
              />
            </div>
            {errors.amount && (
              <span className="form-error" id="amount-error" role="alert">
                {errors.amount}
              </span>
            )}
          </div>

          {/* Purpose */}
          <div className={`form-group ${errors.purpose ? 'form-group--error' : ''}`}>
            <label htmlFor="purpose" className="form-label">Loan Purpose</label>
            <input
              id="purpose"
              name="purpose"
              type="text"
              className="form-input"
              placeholder="e.g. Agricultural equipment, Home repair"
              value={form.purpose}
              onChange={handleChange}
              aria-describedby={errors.purpose ? 'purpose-error' : undefined}
            />
            {errors.purpose && (
              <span className="form-error" id="purpose-error" role="alert">
                {errors.purpose}
              </span>
            )}
          </div>

          {/* Language */}
          <div className={`form-group ${errors.language ? 'form-group--error' : ''}`}>
            <label htmlFor="language" className="form-label">Preferred Language</label>
            <select
              id="language"
              name="language"
              className="form-select"
              value={form.language}
              onChange={handleChange}
              aria-describedby={errors.language ? 'language-error' : undefined}
            >
              <option value="">Select language…</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            {errors.language && (
              <span className="form-error" id="language-error" role="alert">
                {errors.language}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={submitting}
            id="submit-application-btn"
          >
            {submitting ? (
              <span className="btn__loading">
                <span className="spinner" aria-hidden="true" />
                Submitting…
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
