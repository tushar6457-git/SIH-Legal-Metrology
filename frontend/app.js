// Legal Metrology Inspector Portal (DoCA, Govt. of India)
// Frontend Application Logic — FSSAI-inspired UI · 2026 Updated Rules Engine

import { LEGAL_METROLOGY_RULES_2026 } from './rules2026.js';
import { SAMPLE_PRODUCTS }            from './sampleData.js';

class LegalMetrologyPortalApp {
  constructor() {
    this.currentStep    = 1;
    this.iterationCount = 1;
    this.sessionCount   = 0;
    this.currentPage    = 'inspection';
    this.uploadedFiles  = [];
    this.productData    = { name:'', category:'', batchId:'', qty:'', notes:'' };
    this.activeChecks   = null;
    this.evaluation     = null;

    this._bindElements();
    this._bindEvents();
  }

  /* ── Element refs ─────────────────────────────────────────── */
  _bindElements() {
    // Views
    this.viewLogin     = document.getElementById('view-login');
    this.viewWorkspace = document.getElementById('view-workspace');

    // Header
    this.officerChip   = document.getElementById('header-officer-chip');
    this.navBadge      = document.getElementById('nav-iteration-badge');
    this.navAttemptNum = document.getElementById('nav-attempt-num');
    this.statAttemptHero = document.getElementById('stat-attempt-hero');
    this.bcCurrentStep = document.getElementById('bc-current-step');

    // Login
    this.btnDemoLogin  = document.getElementById('btn-demo-login');
    this.loginForm     = document.getElementById('login-form');
    this.btnLogout     = document.getElementById('btn-logout');

    // Stepper
    this.stepNav   = [1,2,3].map(i => document.getElementById(`step-nav-${i}`));

    // Step containers
    this.step1 = document.getElementById('step-1-container');
    this.step2 = document.getElementById('step-2-container');
    this.step3 = document.getElementById('step-3-container');

    // Step 1
    this.dropzone      = document.getElementById('dropzone');
    this.fileInput     = document.getElementById('file-input');
    this.uploadAlert   = document.getElementById('upload-alert');
    this.uploadAlertTx = document.getElementById('upload-alert-text');
    this.filesWrap     = document.getElementById('selected-files-wrap');
    this.fileList      = document.getElementById('file-list');
    this.btnContinue   = document.getElementById('btn-continue-step1');

    // Step 2
    this.productForm = document.getElementById('product-form');
    this.pName       = document.getElementById('p-name');
    this.pCat        = document.getElementById('p-category');
    this.pBatch      = document.getElementById('p-batch');
    this.pQty        = document.getElementById('p-qty');
    this.pNotes      = document.getElementById('p-notes');
    this.btnBackS1   = document.getElementById('btn-back-s1');

    // Step 3
    this.resultBanner  = document.getElementById('result-banner');
    this.resultIcon    = document.getElementById('result-icon');
    this.resultHeading = document.getElementById('result-heading');
    this.resultDesc    = document.getElementById('result-desc');
    this.btnDlPass     = document.getElementById('btn-download-pass');
    this.failActionBar = document.getElementById('fail-action-bar');
    this.btnComplaint  = document.getElementById('btn-send-complaint');
    this.btnIgnore     = document.getElementById('btn-ignore');
    this.btnPrintFail  = document.getElementById('btn-print-fail');
    this.inlineToast   = document.getElementById('inline-toast');
    this.btnReverify   = document.getElementById('btn-reverify');
    this.violationsWrap= document.getElementById('violations-wrap');
    this.violationsList= document.getElementById('violations-list');
    this.passedList    = document.getElementById('passed-list');
    this.resultColumns = document.getElementById('result-columns');

    // Report fields
    this.repCaseNum     = document.getElementById('rep-case-num');
    this.repDate        = document.getElementById('rep-date');
    this.repName        = document.getElementById('rep-name');
    this.repCategory    = document.getElementById('rep-category');
    this.repBatch       = document.getElementById('rep-batch');
    this.repQty         = document.getElementById('rep-qty');
    this.repScore       = document.getElementById('rep-score');
    this.repAttempt     = document.getElementById('rep-attempt');
    this.repNotes       = document.getElementById('rep-notes');
    this.repStatus      = document.getElementById('rep-status');
    this.repVerdict     = document.getElementById('rep-verdict-banner');
    this.repEvidenceImg = document.getElementById('rep-evidence-img');
    this.repEvidenceName= document.getElementById('rep-evidence-filename');

    // Gazette modal
    this.modalGazette   = document.getElementById('modal-gazette');
    this.btnOpenGazette = document.getElementById('btn-open-gazette');
    this.btnCloseGazette= document.getElementById('btn-close-gazette');

    // Sidebar & Drawer
    this.sidebarSessionCount = document.getElementById('sidebar-session-count');
    this.subVerification     = document.getElementById('sub-verification');
    this.navItemVerify       = document.getElementById('nav-item-verification');

    this.fssaiDrawer   = document.getElementById('fssai-sidebar-drawer');
    this.fssaiOverlay  = document.getElementById('fssai-sidebar-overlay');
    this.btnToggleSb   = document.getElementById('btn-toggle-sidebar');
    this.btnCloseSb    = document.getElementById('btn-close-sidebar');

    // Modals
    this.modalAbout      = document.getElementById('modal-about-us');
    this.btnCloseAbout   = document.getElementById('btn-close-about-us');
    this.modalContact    = document.getElementById('modal-contact-us');
    this.btnCloseContact = document.getElementById('btn-close-contact-us');
  }

  /* ── Event bindings ───────────────────────────────────────── */
  _bindEvents() {
    // Drawer open / close
    const openDrawer = () => {
      this.fssaiDrawer?.classList.add('open');
      this.fssaiOverlay?.classList.add('open');
    };
    const closeDrawer = () => {
      this.fssaiDrawer?.classList.remove('open');
      this.fssaiOverlay?.classList.remove('open');
    };
    this.btnToggleSb?.addEventListener('click', openDrawer);
    this.btnCloseSb?.addEventListener('click', closeDrawer);
    this.fssaiOverlay?.addEventListener('click', closeDrawer);

    // About Us modal
    const openAbout = () => {
      closeDrawer();
      if (this.modalAbout) this.modalAbout.style.display = 'flex';
    };
    const closeAbout = () => {
      if (this.modalAbout) this.modalAbout.style.display = 'none';
    };
    document.getElementById('nav-link-about')?.addEventListener('click', openAbout);
    document.getElementById('drawer-link-about')?.addEventListener('click', openAbout);
    document.getElementById('drawer-btn-read-about')?.addEventListener('click', openAbout);
    this.btnCloseAbout?.addEventListener('click', closeAbout);
    this.modalAbout?.addEventListener('click', e => { if (e.target === this.modalAbout) closeAbout(); });

    // Contact Us modal
    const openContact = () => {
      closeDrawer();
      if (this.modalContact) this.modalContact.style.display = 'flex';
    };
    const closeContact = () => {
      if (this.modalContact) this.modalContact.style.display = 'none';
    };
    document.getElementById('nav-link-contact')?.addEventListener('click', openContact);
    document.getElementById('drawer-link-contact')?.addEventListener('click', openContact);
    document.getElementById('drawer-btn-open-contact')?.addEventListener('click', openContact);
    this.btnCloseContact?.addEventListener('click', closeContact);
    this.modalContact?.addEventListener('click', e => { if (e.target === this.modalContact) closeContact(); });

    // Rules / Gazette
    document.getElementById('nav-link-rules')?.addEventListener('click', () => {
      this.modalGazette.style.display = 'flex';
    });
    document.getElementById('drawer-link-gazette')?.addEventListener('click', () => {
      closeDrawer();
      this.modalGazette.style.display = 'flex';
    });

    // Home links
    const goHome = () => {
      closeDrawer();
      this.viewLogin.style.display = 'block';
      this.viewWorkspace.style.display = 'none';
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.getElementById('nav-link-home')?.classList.add('active');
    };
    document.getElementById('nav-link-home')?.addEventListener('click', goHome);
    document.getElementById('drawer-link-home')?.addEventListener('click', goHome);

    // Inspection Desk links
    const goInspection = () => {
      closeDrawer();
      this._login('Sh. Rajesh Sharma', 'Senior Inspector · Delhi Central');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.getElementById('nav-link-inspection')?.classList.add('active');
    };
    document.getElementById('nav-link-inspection')?.addEventListener('click', goInspection);
    document.getElementById('drawer-link-inspection')?.addEventListener('click', goInspection);

    // Cases links
    const goCases = () => {
      closeDrawer();
      this._login('Sh. Rajesh Sharma', 'Senior Inspector · Delhi Central');
      this.showPage('repository');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.getElementById('nav-link-cases')?.classList.add('active');
    };
    document.getElementById('nav-link-cases')?.addEventListener('click', goCases);
    document.getElementById('drawer-link-cases')?.addEventListener('click', goCases);

    // Auth
    this.btnDemoLogin?.addEventListener('click', () => this._login('Sh. Rajesh Sharma', 'Senior Inspector · Delhi Central'));
    this.loginForm?.addEventListener('submit', e => { e.preventDefault(); this._login('Sh. Rajesh Sharma', 'Senior Inspector · Delhi Central'); });
    this.btnLogout?.addEventListener('click', () => this._logout());

    // Accessibility bar
    document.getElementById('btn-font-dec')?.addEventListener('click', () => { document.documentElement.style.fontSize = '13px'; });
    document.getElementById('btn-font-norm')?.addEventListener('click', () => { document.documentElement.style.fontSize = '15px'; });
    document.getElementById('btn-font-inc')?.addEventListener('click', () => { document.documentElement.style.fontSize = '17px'; });
    document.getElementById('btn-contrast')?.addEventListener('click', () => { document.body.classList.toggle('high-contrast'); });

    // Gazette modal — header button + sidebar button
    this.btnOpenGazette?.addEventListener('click', () => { this.modalGazette.style.display = 'flex'; });
    this.btnCloseGazette?.addEventListener('click', () => { this.modalGazette.style.display = 'none'; });
    this.modalGazette?.addEventListener('click', e => { if(e.target === this.modalGazette) this.modalGazette.style.display = 'none'; });
    const sbGazette = document.getElementById('btn-open-gazette-sb');
    if (sbGazette) sbGazette.addEventListener('click', () => { this.modalGazette.style.display = 'flex'; });

    // Sidebar sub-nav collapse toggle (Upload & Verify parent)
    if (this.navItemVerify) {
      this.navItemVerify.querySelector('.sidebar-nav-link')?.addEventListener('click', () => {
        this.navItemVerify.classList.toggle('open');
        const sub = this.subVerification;
        sub?.classList.toggle('open');
        this.showPage('inspection');
      });
    }

    // Upload
    this.dropzone.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', e => this._handleFiles(e.target.files));
    ['dragenter','dragover'].forEach(ev => this.dropzone.addEventListener(ev, e => { e.preventDefault(); this.dropzone.classList.add('drag-over'); }));
    ['dragleave','drop']    .forEach(ev => this.dropzone.addEventListener(ev, e => { e.preventDefault(); this.dropzone.classList.remove('drag-over'); }));
    this.dropzone.addEventListener('drop', e => { if(e.dataTransfer?.files) this._handleFiles(e.dataTransfer.files); });

    this.btnContinue.addEventListener('click', () => this.goToStep(2));
    this.btnBackS1  .addEventListener('click', () => this.goToStep(1));
    this.productForm.addEventListener('submit', e => { e.preventDefault(); this._saveProduct(); this._runVerification(); });

    // Result actions — Pure PDF Generation
    this.btnDlPass   .addEventListener('click', () => this.downloadReportPDF());
    this.btnPrintFail.addEventListener('click', () => this.downloadReportPDF());
    this.btnComplaint.addEventListener('click', () => {
      const ref = `DoCA/LM/2026/${Math.floor(10000+Math.random()*90000)}`;
      this._showToast('complaint', `Complaint registered successfully. Official Show-Cause Notice forwarded to Central Enforcement Cell (DoCA). Reference ID: <strong>${ref}</strong>`);
      this.btnComplaint.disabled = true;
    });
    this.btnIgnore.addEventListener('click', () => {
      this._showToast('ignored', 'Case archived as "Ignored / No Further Action" on officer record. Case closed.');
      this.btnIgnore.disabled = true;
    });
    this.btnReverify.addEventListener('click', () => this._reverify());

    // Contact form send
    const btnSendContact = document.getElementById('btn-send-contact');
    if (btnSendContact) {
      btnSendContact.addEventListener('click', () => {
        const toast = document.getElementById('contact-success-toast');
        if (toast) { toast.style.display = 'flex'; }
      });
    }

    // Nav links (top horizontal)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  /* ── Auth ─────────────────────────────────────────────────── */
  _login(name, role) {
    this.viewLogin.style.display     = 'none';
    this.viewWorkspace.style.display = 'block';

    // Show officer chip in header
    this.officerChip.style.display = 'flex';
    document.getElementById('officer-display-name').textContent = name;
    document.getElementById('officer-display-role').textContent = role;
    document.getElementById('officer-avatar-initials').textContent =
      name.split(' ').filter(p => /^[A-Z]/.test(p)).slice(0,2).map(p=>p[0]).join('');

    this.navBadge.style.display = 'inline-flex';
    this.goToStep(1);
  }

  _logout() {
    this.viewLogin.style.display     = 'block';
    this.viewWorkspace.style.display = 'none';
    this.officerChip.style.display   = 'none';
    this.navBadge.style.display      = 'none';
    this.iterationCount = 1;
    this.uploadedFiles  = [];
    this.activeChecks   = null;
  }

  /* ── File Handling ────────────────────────────────────────── */
  _handleFiles(fileList) {
    this.uploadAlert.style.display = 'none';
    const allowed = ['.pdf','.jpg','.jpeg','.png'];
    const rejected = [];

    Array.from(fileList).forEach(f => {
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      if (!allowed.includes(ext)) { rejected.push(f.name); return; }
      if (!this.uploadedFiles.some(u => u.name === f.name)) {
        const fileObj = { name: f.name, size: this._fmtSize(f.size), ext: ext.replace('.','').toUpperCase() };
        if (['.jpg','.jpeg','.png'].includes(ext)) {
          const reader = new FileReader();
          reader.onload = e => {
            this.uploadedImagePreview = e.target.result;
            this._updateDropzonePreview();
          };
          reader.readAsDataURL(f);
        } else if (ext === '.pdf') {
          this.uploadedImagePreview = null;
        }
        this.uploadedFiles.push(fileObj);
      }
    });

    // If custom files uploaded, clear previous sample checks
    if (this.uploadedFiles.length && !this.productData.name) {
      this.activeChecks = null;
    }

    if (rejected.length) {
      this._showAlert('error', `Rejected ${rejected.length} file(s): <strong>${rejected.join(', ')}</strong> — Accept ONLY: PDF, JPG, PNG.`);
    }
    this._renderFileList();
    this._updateDropzonePreview();
  }

  /* ── Update In-Box Dropzone Photo / Document Preview ───────── */
  _updateDropzonePreview() {
    const defaultBox = document.getElementById('dropzone-default');
    const previewBox = document.getElementById('dropzone-preview');
    const imgElem    = document.getElementById('dropzone-img-elem');
    const pdfBadge   = document.getElementById('dropzone-pdf-badge');
    const nameElem   = document.getElementById('dropzone-preview-name');
    const sizeElem   = document.getElementById('dropzone-preview-size');

    if (!defaultBox || !previewBox) return;

    if (this.uploadedFiles && this.uploadedFiles.length > 0) {
      const file = this.uploadedFiles[0];
      defaultBox.style.display = 'none';
      previewBox.style.display = 'block';

      if (nameElem) nameElem.textContent = file.name;
      if (sizeElem) sizeElem.textContent = file.size || '1.4 MB';

      if (file.ext === 'PDF') {
        if (imgElem) imgElem.style.display = 'none';
        if (pdfBadge) pdfBadge.style.display = 'flex';
      } else {
        if (pdfBadge) pdfBadge.style.display = 'none';
        if (imgElem) {
          imgElem.src = this.uploadedImagePreview || '';
          imgElem.style.display = 'block';
        }
      }
    } else {
      defaultBox.style.display = 'block';
      previewBox.style.display = 'none';
    }
  }

  _fmtSize(bytes) {
    if (!bytes) return '—';
    const k=1024, units=['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes)/Math.log(k));
    return +(bytes/Math.pow(k,i)).toFixed(1)+' '+units[i];
  }

  _renderFileList() {
    this.fileList.innerHTML = '';
    if (!this.uploadedFiles.length) {
      this.filesWrap.style.display  = 'none';
      this.btnContinue.disabled     = true;
      return;
    }
    this.filesWrap.style.display = 'block';
    this.btnContinue.disabled    = false;

    this.uploadedFiles.forEach((f, idx) => {
      const li = document.createElement('li');
      li.className = 'file-list-item';
      li.innerHTML = `
        <span class="file-type-pill ${f.ext === 'PDF' ? 'pdf' : 'image'}">${f.ext}</span>
        <span class="file-name" title="${f.name}">${f.name}</span>
        <span class="file-size">${f.size}</span>
        <button type="button" class="btn-remove" data-idx="${idx}" title="Remove file">&times;</button>`;
      li.querySelector('.btn-remove').addEventListener('click', e => {
        this.uploadedFiles.splice(+e.currentTarget.dataset.idx, 1);
        if (!this.uploadedFiles.length) {
          this.uploadedImagePreview = null;
        }
        this._renderFileList();
        this._updateDropzonePreview();
      });
      this.fileList.appendChild(li);
    });
  }

  _showAlert(type, html) {
    this.uploadAlert.className = `alert-box ${type}`;
    const iconSvg = type === 'error'
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
      : type === 'info'
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    this.uploadAlert.innerHTML = `<span class="alert-box-icon">${iconSvg}</span><span>${html}</span>`;
    this.uploadAlert.style.display = 'flex';
  }

  /* ── Sample Loader ────────────────────────────────────────── */
  loadSample(id) {
    const s = SAMPLE_PRODUCTS.find(x => x.id === id);
    if (!s) return;
    this.uploadedFiles = [{ name: s.mockFileName, size: s.fileSize, ext: s.fileType.includes('pdf') ? 'PDF' : 'IMAGE' }];
    this.uploadedImagePreview = s.mockImage || null;
    this.productData   = { name: s.name, category: s.category, batchId: s.batchId, qty: s.ruleChecks.rule_6_1_c?.detectedText||'', notes: s.description };
    this.activeChecks  = s.ruleChecks;
    this._populateForm();
    this._renderFileList();
    this._updateDropzonePreview();
    this.uploadAlert.style.display = 'none';
    this.goToStep(1);
  }

  _populateForm() {
    this.pName.value  = this.productData.name     || '';
    this.pCat.value   = this.productData.category  || '';
    this.pBatch.value = this.productData.batchId   || '';
    this.pQty.value   = this.productData.qty       || '';
    this.pNotes.value = this.productData.notes     || '';
  }

  _saveProduct() {
    const name = (this.pName?.value?.trim()) || (this.productData?.name) || 'Packaged Commodity';
    const category = (this.pCat?.value) || (this.productData?.category) || 'FMCG / Packaged Goods';
    const batchId = (this.pBatch?.value?.trim()) || (this.productData?.batchId) || 'BATCH-2026-REG';
    const qty = (this.pQty?.value?.trim()) || (this.productData?.qty) || '200 g';
    const notes = (this.pNotes?.value?.trim()) || (this.productData?.notes) || 'Routine market surveillance inspection sample.';

    this.productData = { name, category, batchId, qty, notes };
  }

  /* ── Step Navigation ──────────────────────────────────────── */
  goToStep(n) {
    // Ensure inspection page is shown (but only switch if needed)
    if (this.currentPage !== 'inspection') this.showPage('inspection');
    this.currentStep = n;
    [this.step1, this.step2, this.step3].forEach((el, i) => {
      el.style.display = (i+1 === n) ? 'block' : 'none';
    });
    this.stepNav.forEach((el, i) => {
      el.classList.remove('active','done');
      if (i+1 === n)      el.classList.add('active');
      else if (i+1 < n)   el.classList.add('done');
    });

    // Update sidebar sub-nav active state
    ['sub-step1','sub-step2','sub-step3'].forEach((id,i) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('active', i+1 === n);
    });
    // Open sub-nav
    if (this.subVerification) this.subVerification.classList.add('open');
    if (this.navItemVerify)   this.navItemVerify.classList.add('open');

    const labels = ['Upload Product Files', 'Enter Product Details', 'Verification Result'];
    if (this.bcCurrentStep) this.bcCurrentStep.textContent = labels[n-1] || '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Page Navigation (sidebar) ────────────────────────────── */
  showPage(page) {
    this.currentPage = page;
    const pages = { inspection:'page-inspection', about:'page-about', contact:'page-contact' };
    Object.entries(pages).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.style.display = (key === page) ? 'block' : 'none';
    });

    // Hero banner only on inspection
    const hero = document.getElementById('hero-banner-inspection');
    if (hero) hero.style.display = (page === 'inspection') ? 'block' : 'none';

    // Sidebar active states
    ['nav-inspection','nav-about','nav-contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    const activeNavId = page === 'inspection' ? 'nav-inspection' : page === 'about' ? 'nav-about' : 'nav-contact';
    const activeEl = document.getElementById(activeNavId);
    if (activeEl) activeEl.classList.add('active');

    // Update breadcrumb section
    const bcSection = document.getElementById('bc-section');
    const bcCurrent = document.getElementById('bc-current-step');
    if (bcSection && bcCurrent) {
      if (page === 'inspection') { bcSection.textContent = 'Inspection Desk'; }
      else if (page === 'about') { bcSection.textContent = 'Portal Information'; bcCurrent.textContent = 'About Us'; }
      else if (page === 'contact') { bcSection.textContent = 'Portal Information'; bcCurrent.textContent = 'Contact Us'; }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Verification ─────────────────────────────────────────── */
  _runVerification() {
    if (!this.activeChecks) this.activeChecks = this._defaultChecks();
    this.evaluation = LEGAL_METROLOGY_RULES_2026.evaluateProductCompliance(this.productData, this.activeChecks);
    this._renderResult(this.evaluation);
    this.goToStep(3);
    // Update session counter
    this.sessionCount++;
    if (this.sidebarSessionCount) this.sidebarSessionCount.textContent = `${this.sessionCount} check${this.sessionCount!==1?'s':''}`;
  }

  _defaultChecks() {
    const failName = this.productData.name.toLowerCase().includes('fail');
    return {
      rule_6_1_a: { status:'pass', detectedText:'Registered Mfg: Industrial Area, Phase II, New Delhi - 110020' },
      rule_6_1_b: { status:'pass', detectedText: this.productData.name || 'Packaged Commodity' },
      rule_6_1_c: { status:'pass', detectedText: this.productData.qty || 'Net Qty: 250 g' },
      rule_6_1_d: { status:'pass', detectedText:'Mfg Date: 03/2026' },
      rule_6_1_e: { status: failName ? 'fail' : 'pass', detectedText:'MRP ₹199.00 (Incl. of all taxes) | USP: ₹0.80 / g', reason:'Unit Sale Price missing.' },
      rule_6_1_f: { status:'pass', detectedText:'Helpline: 1800-11-4000 | Email: care@consumerconnect.gov.in' },
      rule_6_1_g: { status:'pass', detectedText:'Country of Origin: India' },
      rule_9_font: { status:'pass', measuredHeightMm:2.5, requiredHeightMm:2.0 }
    };
  }

  /* ── Result Rendering ─────────────────────────────────────── */
  _renderResult(ev) {
    // Reset actions
    this.inlineToast.style.display = 'none';
    this.btnComplaint.disabled = false;
    this.btnIgnore.disabled    = false;

    if (ev.isPass) {
      this.resultBanner.className   = 'result-banner pass';
      this.resultIcon.textContent   = '✓';
      this.resultHeading.textContent= 'Verification Successful (सत्यापन सफल)';
      this.resultDesc.textContent   = `All ${ev.passedDeclarations.length} mandatory declarations comply with Legal Metrology Rules 2011 (Amended 2026). Compliance Score: ${ev.score}%`;
      this.btnDlPass.style.display  = 'inline-flex';
      this.failActionBar.style.display = 'none';
      this.violationsWrap.style.display= 'none';
      if (this.resultColumns) {
        this.resultColumns.classList.remove('has-violations');
        this.resultColumns.style.gridTemplateColumns = '';
      }
    } else {
      this.resultBanner.className      = 'result-banner fail';
      this.resultIcon.textContent      = '✕';
      this.resultHeading.textContent   = 'Verification Unsuccessful (सत्यापन असफल)';
      this.resultDesc.textContent      = `${ev.violations.length} legal violation(s) identified under Section 36, Legal Metrology Act 2009 & PCR Rules 2011/2026.`;
      this.btnDlPass.style.display     = 'none';
      this.failActionBar.style.display = 'block';
      this.violationsWrap.style.display= 'block';
      if (this.resultColumns) {
        this.resultColumns.classList.add('has-violations');
        this.resultColumns.style.gridTemplateColumns = '';
      }

      this.violationsList.innerHTML = ev.violations.map(v => `
        <div class="violation-card">
          <div class="v-card-top">
            <span class="v-rule-tag">${v.ruleNo}</span>
            <span class="v-penalty-tag">${v.penaltySection}</span>
          </div>
          <div class="v-title">${v.title}</div>
          <div class="v-detected-box">
            <span class="v-detected-label">Detected on Package:</span>
            <span class="v-detected-val">${v.detectedText}</span>
          </div>
          <div class="v-legal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>${v.reason}</span>
          </div>
        </div>`).join('');
    }

    // Passed declarations
    this.passedList.innerHTML = ev.passedDeclarations.map(p => `
      <div class="pass-check-item">
        <div class="check-tick">✓</div>
        <div>
          <div class="check-item-title">${p.ruleNo}: ${p.title}</div>
          <div class="check-item-val">${p.detectedText}</div>
        </div>
      </div>`).join('');

    // Synchronize all official report fields
    this._syncReportFields(ev);
  }

  /* ── Synchronize Report Fields ────────────────────────────── */
  _syncReportFields(ev) {
    if (!ev) return;
    this._saveProduct();

    const caseRef = (this.repCaseNum && this.repCaseNum.textContent && this.repCaseNum.textContent.includes('LM-'))
      ? this.repCaseNum.textContent
      : `CASE-REF: LM-2026-${Math.floor(10000+Math.random()*90000)}`;

    if (this.repCaseNum)  this.repCaseNum.textContent  = caseRef;
    if (this.repDate)     this.repDate.textContent     = `Date: ${new Date().toLocaleDateString('en-GB')}`;
    if (this.repName)     this.repName.textContent     = this.productData.name     || 'Packaged Commodity';
    if (this.repCategory) this.repCategory.textContent = this.productData.category  || 'FMCG / Packaged Goods';
    if (this.repBatch)    this.repBatch.textContent    = this.productData.batchId   || 'BATCH-2026-REG';
    if (this.repQty)      this.repQty.textContent      = this.productData.qty       || '200 g';
    if (this.repScore)    this.repScore.textContent    = `${ev.score}% (${ev.passedDeclarations.length}/${ev.passedDeclarations.length + ev.violations.length} Checks Passed)`;
    if (this.repAttempt)  this.repAttempt.textContent  = `Attempt #${this.iterationCount}`;
    if (this.repNotes)    this.repNotes.textContent    = this.productData.notes     || 'Routine market surveillance inspection sample.';
    if (this.repStatus) {
      this.repStatus.textContent = ev.isPass ? 'PASS (COMPLIANT)' : 'FAIL (NON-COMPLIANT)';
      this.repStatus.style.color = ev.isPass ? '#166534' : '#991B1B';
      this.repStatus.style.whiteSpace = 'nowrap';
    }

    // 1. Verdict Banner inside PDF
    if (this.repVerdict) {
      if (ev.isPass) {
        this.repVerdict.innerHTML = `
          <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 6px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 13px; font-weight: 800; color: #166534; letter-spacing: .4px;">
                CERTIFICATE OF STATUTORY COMPLIANCE
              </div>
              <div style="font-size: 10.5px; color: #15803D; margin-top: 2px;">
                Commodity complies with all declarations under Legal Metrology (PCR) Rules, 2011 (Amended 2026).
              </div>
            </div>
            <div style="background: #166534; color: #FFF; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 800; flex-shrink: 0;">
              PASS · 100%
            </div>
          </div>`;
      } else {
        this.repVerdict.innerHTML = `
          <div style="background: #FEF2F2; border: 1.5px solid #FCA5A5; border-radius: 6px; padding: 9px 14px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-size: 13px; font-weight: 800; color: #991B1B; letter-spacing: .4px;">
                OFFICIAL NOTICE OF NON-COMPLIANCE &amp; SEIZURE MEMO
              </div>
              <div style="font-size: 10.5px; color: #B91C1C; margin-top: 2px;">
                Action initiated under Section 36, Legal Metrology Act, 2009 for statutory declaration omissions.
              </div>
            </div>
            <div style="background: #991B1B; color: #FFF; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 800; flex-shrink: 0;">
              FAIL · ${ev.score}%
            </div>
          </div>`;
      }
    }

    // 2. Official Government Emblem in PDF (uses inlined base64 to avoid canvas tainting)
    const repEmblem = document.getElementById('rep-govt-emblem');
    if (repEmblem && window.EMBLEM_DATA_URI) {
      repEmblem.src = window.EMBLEM_DATA_URI;
    }

    // 3. Evidence Label Image in PDF
    if (this.repEvidenceImg) {
      if (this.uploadedImagePreview) {
        this.repEvidenceImg.src = this.uploadedImagePreview;
        this.repEvidenceImg.style.display = 'block';
      } else {
        const fallbackSvg = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="130" viewBox="0 0 200 130"><rect width="100%" height="100%" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" rx="4"/><text x="100" y="60" font-family="sans-serif" font-size="11" font-weight="bold" fill="#64748B" text-anchor="middle">PRODUCT LABEL</text><text x="100" y="80" font-family="sans-serif" font-size="9" fill="#94A3B8" text-anchor="middle">EVIDENCE PHOTO</text></svg>`);
        this.repEvidenceImg.src = fallbackSvg;
        this.repEvidenceImg.style.display = 'block';
      }
    }
    if (this.repEvidenceName) {
      this.repEvidenceName.textContent = this.uploadedFiles[0]?.name || (this.productData.name ? `${this.productData.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 16)}_label.jpg` : 'label_evidence.jpg');
    }

    // 3. Full Rule-by-Rule Audit Matrix
    const findingsWrap = document.getElementById('rep-findings-wrap');
    if (findingsWrap) {
      const allAuditRows = [
        ...ev.passedDeclarations.map(p => ({
          rule: p.ruleNo,
          title: p.title,
          detected: p.detectedText,
          status: 'COMPLIANT',
          isPass: true
        })),
        ...ev.violations.map(v => ({
          rule: v.ruleNo,
          title: v.title,
          detected: `${v.detectedText} — ${v.reason}`,
          status: `NON-COMPLIANT (${v.penaltySection})`,
          isPass: false
        }))
      ];

      findingsWrap.innerHTML = `
        <div style="margin-top: 8px; margin-bottom: 4px; font-size: 11.5px; font-weight: 700; color: #0B2545; border-bottom: 1.5px solid #0B2545; padding-bottom: 3px;">
          STATUTORY COMPLIANCE AUDIT RECORD — Rule 6 &amp; Rule 9 Verification Matrix
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; margin-top: 4px; margin-bottom: 8px; table-layout: fixed;">
          <thead>
            <tr style="background: #F1F5F9; text-align: left;">
              <th style="padding: 5px 8px; border: 1px solid #CBD5E1; width: 25%; font-size: 10px;">Rule No. &amp; Mandate</th>
              <th style="padding: 5px 8px; border: 1px solid #CBD5E1; width: 51%; font-size: 10px;">Detected Label Text / Observation</th>
              <th style="padding: 5px 8px; border: 1px solid #CBD5E1; width: 24%; text-align: center; font-size: 10px;">Audit Result</th>
            </tr>
          </thead>
          <tbody>
            ${allAuditRows.map(row => `
              <tr>
                <td style="padding: 4px 7px; border: 1px solid #E2E8F0; font-weight: 600; color: #1E293B; word-break: break-word;">
                  ${row.rule}<br><span style="font-size: 9.5px; font-weight: normal; color: #64748B;">${row.title}</span>
                </td>
                <td style="padding: 4px 7px; border: 1px solid #E2E8F0; color: #334155; word-break: break-word; font-size: 10px;">
                  ${row.detected}
                </td>
                <td style="padding: 4px 7px; border: 1px solid #E2E8F0; text-align: center; font-weight: 700; color: ${row.isPass ? '#166534' : '#991B1B'}; background: ${row.isPass ? '#F0FDF4' : '#FEF2F2'}; word-break: break-word; font-size: 10px;">
                  ${row.status}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${!ev.isPass ? `
          <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 4px; padding: 6px 10px; font-size: 10px; color: #991B1B; margin-bottom: 6px; line-height: 1.35;">
            <strong>STATUTORY SHOW-CAUSE NOTICE:</strong> The above non-compliant declarations violate mandatory provisions under Legal Metrology (Packaged Commodities) Rules, 2011 (Amended 2026). Offence punishable under Section 36(1) of the Legal Metrology Act, 2009 with statutory penalty.
          </div>
        ` : `
          <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 4px; padding: 6px 10px; font-size: 10px; color: #166534; margin-bottom: 6px; line-height: 1.35;">
            <strong>CERTIFICATE OF COMPLIANCE:</strong> The inspected packaged commodity complies with all mandatory statutory declarations and minimum numeral font height requirements under Legal Metrology Rules, 2011 (Amended 2026).
          </div>
        `}
      `;
    }
  }

  /* ── Pure PDF Generation ──────────────────────────────────── */
  downloadReportPDF() {
    this._saveProduct();
    if (!this.evaluation) {
      if (!this.activeChecks) this.activeChecks = this._defaultChecks();
      this.evaluation = LEGAL_METROLOGY_RULES_2026.evaluateProductCompliance(this.productData, this.activeChecks);
    }
    this._syncReportFields(this.evaluation);

    const reportElem = document.getElementById('official-report');
    if (!reportElem) return;

    const caseRef = this.repCaseNum ? this.repCaseNum.textContent.replace('CASE-REF:', '').trim() : 'REPORT';
    const prodName = (this.productData && this.productData.name) ? this.productData.name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 18) : 'Product';
    const filename = `Inspection_Report_${prodName}_${caseRef}.pdf`;

    const activeBtn = (this.evaluation && this.evaluation.isPass) ? this.btnDlPass : this.btnPrintFail;
    const origHtml = activeBtn ? activeBtn.innerHTML : '';
    if (activeBtn) {
      activeBtn.disabled = true;
      activeBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"/>
        </svg> Generating PDF...`;
    }

    reportElem.classList.add('pdf-copy-active');
    setTimeout(() => reportElem.classList.remove('pdf-copy-active'), 2000);

    // Apply PDF export styling to optimize document proportions for A4
    reportElem.classList.add('exporting-pdf');

    const finishExport = () => {
      reportElem.classList.remove('exporting-pdf');
      if (activeBtn) {
        activeBtn.disabled = false;
        activeBtn.innerHTML = origHtml;
      }
    };

    if (window.html2pdf) {
      const opt = {
        margin:       [8, 8, 8, 8],
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      window.html2pdf().set(opt).from(reportElem).save().then(() => {
        finishExport();
        this._showToast('complaint', `Official PDF downloaded successfully: <strong>${filename}</strong>`);
      }).catch(err => {
        console.error('PDF error:', err);
        finishExport();
        window.print();
      });
    } else {
      finishExport();
      window.print();
    }
  }

  /* ── Re-verification Loop ─────────────────────────────────── */
  _reverify() {
    this.iterationCount++;
    this.navAttemptNum.textContent  = this.iterationCount;
    if (this.statAttemptHero) this.statAttemptHero.textContent = this.iterationCount;
    this.navBadge.style.display     = 'inline-flex';

    // Keep product data pre-filled, clear only uploaded files
    this.uploadedFiles = [];
    this.uploadedImagePreview = null;
    this._renderFileList();
    this._updateDropzonePreview();
    this._populateForm();

    // Show info alert on upload step
    this.uploadAlert.style.display = 'none';
    this.goToStep(1);

    setTimeout(() => {
      this._showAlert('warn', `<strong>Re-verification Mode (Attempt #${this.iterationCount}):</strong> Product details are pre-filled from the previous inspection. Upload new / clearer label images and resubmit.`);
    }, 100);
  }

  /* ── Toast ────────────────────────────────────────────────── */
  _showToast(type, html) {
    this.inlineToast.className = `inline-toast ${type}`;
    this.inlineToast.innerHTML = html;
    this.inlineToast.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.portalApp = new LegalMetrologyPortalApp();
});
