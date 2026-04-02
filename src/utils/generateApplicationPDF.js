import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate a professional PDF of a job application matching the
 * Divine Healthcare Services LLC Application for Employment format.
 */
export function generateApplicationPDF(application, documents = []) {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pw - margin * 2;
  let y = margin;
  const app = application || {};

  // Safe string helper
  const s = (val) => (val != null && val !== '' && val !== 'null') ? String(val) : '';

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  };

  const newPage = () => {
    doc.addPage();
    y = margin;
  };

  const needSpace = (needed) => {
    if (y + needed > ph - 20) newPage();
  };

  const drawLine = () => {
    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pw - margin, y);
  };

  const heading = (text) => {
    needSpace(14);
    y += 3;
    setFont('bold', 11);
    doc.setTextColor(90, 120, 96);
    doc.text(text, pw / 2, y, { align: 'center' });
    y += 2;
    drawLine();
    y += 4;
    doc.setTextColor(50, 50, 50);
  };

  const field = (label, value) => {
    needSpace(7);
    setFont('bold', 9);
    doc.text(label, margin, y);
    setFont('normal', 10);
    const lw = doc.getTextWidth(label) + 2;
    const v = s(value) || '______________________';
    doc.text(v, margin + lw, y);
    y += 5;
  };

  // Wrapping field: for long text values that may need multiple lines
  const fieldWrap = (label, value) => {
    needSpace(7);
    setFont('bold', 9);
    doc.text(label, margin, y);
    const lw = doc.getTextWidth(label) + 2;
    const v = s(value);
    if (!v) {
      setFont('normal', 10);
      doc.text('______________________', margin + lw, y);
      y += 5;
    } else {
      setFont('normal', 10);
      const maxW = contentWidth - lw;
      const lines = doc.splitTextToSize(v, maxW);
      doc.text(lines, margin + lw, y);
      y += lines.length * 4 + 2;
    }
  };

  const field2 = (l1, v1, l2, v2) => {
    needSpace(7);
    const half = contentWidth / 2;
    setFont('bold', 9); doc.text(l1, margin, y);
    setFont('normal', 10); doc.text(s(v1) || '____________', margin + doc.getTextWidth(l1) + 2, y);
    setFont('bold', 9); doc.text(l2, margin + half, y);
    setFont('normal', 10); doc.text(s(v2) || '____________', margin + half + doc.getTextWidth(l2) + 2, y);
    y += 5;
  };

  const field3 = (l1, v1, l2, v2, l3, v3) => {
    needSpace(7);
    const t = contentWidth / 3;
    [[l1, v1, 0], [l2, v2, t], [l3, v3, t * 2]].forEach(([l, v, o]) => {
      setFont('bold', 9); doc.text(l, margin + o, y);
      setFont('normal', 10); doc.text(s(v) || '________', margin + o + doc.getTextWidth(l) + 2, y);
    });
    y += 5;
  };

  const makeTable = (headers, rows) => {
    needSpace(20);
    autoTable(doc, {
      startY: y,
      head: [headers],
      body: rows,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2, textColor: [50, 50, 50] },
      headStyles: { fillColor: [90, 120, 96], textColor: [255, 255, 255], fontStyle: 'bold' },
      theme: 'grid',
    });
    y = doc.lastAutoTable.finalY + 4;
  };

  const footer = () => {
    const n = doc.internal.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      setFont('normal', 8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Divine Healthcare Services LLC — Employment Application — Page ${i} of ${n}`, pw / 2, ph - 8, { align: 'center' });
    }
    doc.setTextColor(50, 50, 50);
  };

  // Helper: check if an employer object has any meaningful data
  const isEmptyEmployer = (emp) => {
    if (!emp || typeof emp !== 'object') return true;
    // Check all common keys for any non-empty value
    const keys = ['name', 'employer', 'mayContact', 'phone', 'city', 'state', 'zip',
      'title', 'supervisor', 'supervisorTitle', 'dateFrom', 'dateTo',
      'workPerformed', 'reasonLeaving',
      // Also check snake_case variants just in case
      'may_contact', 'supervisor_title', 'date_from', 'date_to',
      'work_performed', 'reason_leaving'];
    return !keys.some(k => s(emp[k]));
  };

  // Helper: safely read employer field with camelCase and snake_case fallback
  const empField = (emp, camel, snake) => {
    return s(emp[camel]) || s(emp[snake]) || '';
  };

  // ==============================================================
  // PAGE 1: HEADER + PERSONAL + LICENSES + EMPLOYMENT + EDUCATION
  // ==============================================================

  // Header
  setFont('bold', 22);
  doc.setTextColor(90, 120, 96);
  doc.text('Divine', pw / 2, y, { align: 'center' });
  y += 7;
  setFont('normal', 11);
  doc.text('HealthCare Services LLC', pw / 2, y, { align: 'center' });
  y += 6;
  setFont('bold', 13);
  doc.setTextColor(50, 50, 50);
  doc.text('APPLICATION FOR EMPLOYMENT', pw / 2, y, { align: 'center' });
  y += 4;
  drawLine();
  y += 4;

  // Date
  setFont('normal', 9);
  try { doc.text('Date: ' + new Date(app.created_at).toLocaleDateString(), pw - margin - 50, y); } catch(e) { doc.text('Date: ___________', pw - margin - 50, y); }
  y += 4;

  // PERSONAL
  heading('PERSONAL');
  field('Legal Name:', [s(app.first_name), s(app.middle_name), s(app.last_name)].filter(Boolean).join(' '));
  field2('Preferred Name:', app.preferred_name, 'SSN (last 4):', app.ssn_last4 ? '***-**-' + app.ssn_last4 : '');
  field2('Date of Birth:', app.date_of_birth, 'Gender:', app.gender);
  field('Address:', app.street);
  field3('City:', app.city, 'State:', app.state, 'Zip:', app.zip);
  field2('Home Phone:', app.home_phone, 'Cell Phone:', app.cell_phone);
  field('E-mail:', app.email);
  field2('Are you 18+?', app.is_over_18, 'US Citizen?', app.is_citizen);
  if (app.is_citizen === 'No') field('Legally eligible?', app.is_eligible);
  field('How did you hear about us:', app.hear_about_us);
  if (s(app.former_names)) field('Former Names:', app.former_names);
  if (s(app.drivers_license)) field2("Driver's License:", app.drivers_license, 'DL State:', app.drivers_license_state);

  // LICENSES TABLE
  heading('Nursing License / Certificate Information');
  const lics = Array.isArray(app.licenses) ? app.licenses : [];
  const licRows = lics.length > 0
    ? lics.map(l => [s(l.type), s(l.state), s(l.expirationYear), s(l.number)])
    : [['', '', '', ''], ['', '', '', '']];
  makeTable(['License/Certificate Type', 'State', 'Exp. Year', 'License/Certificate Number'], licRows);

  // EMPLOYMENT DESIRED
  heading('EMPLOYMENT DESIRED');
  field3('Position:', app.position, 'Start Date:', app.start_date, 'Rate:', app.desired_pay);
  const et = Array.isArray(app.employment_type) ? app.employment_type.join(', ') : s(app.employment_type);
  const sh = Array.isArray(app.preferred_shift) ? app.preferred_shift.join(', ') : s(app.preferred_shift);
  field2('Type of Employment:', et, 'Shifts:', sh);
  field2('Previously employed?', app.previously_employed, 'If yes, when?', app.previous_dates);

  // EDUCATION
  heading('EDUCATION BACKGROUND');
  const edu = Array.isArray(app.education) ? app.education : [];
  const eduRows = edu.length > 0
    ? edu.map(e => [s(e.level), s(e.schoolName), s(e.yearsAttended), s(e.state), s(e.degreeNumber)])
    : [['High School','','','',''],['College','','','',''],['University','','','',''],['Nursing','','','',''],['Other','','','','']];
  makeTable(['Education', 'Name & Location', 'Years', 'State', 'Degree/Lic #'], eduRows);

  // ==============================================================
  // PAGE 2: EMPLOYMENT HISTORY (forced page break for major section)
  // ==============================================================
  newPage();
  heading('EMPLOYMENT HISTORY');
  setFont('normal', 8);
  doc.text('List your employment beginning with present or most recent position.', margin, y);
  y += 5;

  const emps = Array.isArray(app.employers) ? app.employers : [];
  // Filter out empty employer objects
  const validEmps = emps.filter(emp => !isEmptyEmployer(emp));

  if (validEmps.length === 0) {
    needSpace(10);
    setFont('italic', 10);
    doc.setTextColor(120, 120, 120);
    doc.text('No employment history provided.', margin, y);
    doc.setTextColor(50, 50, 50);
    y += 6;
  } else {
    validEmps.forEach((emp, idx) => {
      needSpace(45);
      if (idx > 0) { y += 2; drawLine(); y += 4; }
      field('Name of Employer:', empField(emp, 'name', 'employer'));
      field2('May We Contact?', empField(emp, 'mayContact', 'may_contact'), 'Contact #:', empField(emp, 'phone', 'phone'));
      field3('City:', empField(emp, 'city', 'city'), 'State:', empField(emp, 'state', 'state'), 'Zip:', empField(emp, 'zip', 'zip'));
      field3('Your Title:', empField(emp, 'title', 'title'), 'Supervisor:', empField(emp, 'supervisor', 'supervisor'), 'Sup. Title:', empField(emp, 'supervisorTitle', 'supervisor_title'));
      field2('From:', empField(emp, 'dateFrom', 'date_from'), 'To:', empField(emp, 'dateTo', 'date_to'));
      fieldWrap('Work Performed:', empField(emp, 'workPerformed', 'work_performed'));
      fieldWrap('Reason for leaving:', empField(emp, 'reasonLeaving', 'reason_leaving'));
    });
  }

  y += 3; drawLine(); y += 4;

  // Background questions (flow naturally, no forced page break)
  [
    ['Have you ever been convicted, plead guilty or no contest to a crime?', app.convicted, app.convicted_explanation],
    ['Have you ever been excluded from Medicare or Medicaid?', app.excluded_medicaid, app.excluded_explanation],
    ['Have you ever been disciplined by a professional or licensing board?', app.disciplined, app.disciplined_explanation],
  ].forEach(([q, ans, expl]) => {
    needSpace(14);
    setFont('normal', 9);
    const qLines = doc.splitTextToSize(q, contentWidth);
    doc.text(qLines, margin, y);
    y += qLines.length * 4 + 1;
    field('Answer:', ans);
    if (ans === 'Yes' && s(expl)) field('Explanation:', expl);
    y += 1;
  });

  // ==============================================================
  // REFERENCES (flows naturally from employment history)
  // ==============================================================
  heading('REFERENCE INFORMATION');
  const refs = Array.isArray(app.references_data) ? app.references_data : [];
  if (refs.length === 0) {
    needSpace(8);
    setFont('italic', 10);
    doc.setTextColor(120, 120, 120);
    doc.text('No references provided.', margin, y);
    doc.setTextColor(50, 50, 50);
    y += 5;
  } else {
    refs.forEach((ref, idx) => {
      needSpace(18);
      setFont('bold', 10);
      doc.text('Reference ' + (idx + 1), margin, y);
      y += 5;
      field('Name of Reference:', ref.name);
      field2('Telephone #:', ref.phone, 'Best Time:', ref.bestTime);
      y += 2;
    });
  }

  // ==============================================================
  // SKILLS CHECKLIST (flows naturally from references)
  // ==============================================================
  heading('CNA/GNA/CMT Skills Checklist');
  setFont('normal', 8);
  needSpace(8);
  doc.text('A = I can perform well    B = I need to review    C = I have no experience', margin, y);
  y += 5;

  const skillsObj = (typeof app.skills_assessment === 'object' && app.skills_assessment) ? app.skills_assessment : {};
  const skillList = [
    'Communication', 'Observation, reporting and documentation',
    'Temperature, pulse and respiration', 'Universal Precautions',
    'Body functions and changes reporting', 'Clean, safe and healthy environment',
    'Emergency situation recognition', 'Physical and emotional needs, privacy',
    'Personal hygiene and grooming', 'Toileting and elimination',
    'Safe transfer techniques', 'Safe Ambulation',
    'Equipment use (Wheelchair, lift, walker, cane)', 'Proper body alignment positioning',
    'Feeding assistance (Aspiration Precautions)', 'Adequate nutrition and intake',
    'Medication Reminders', 'Infection Control (Handwashing, gloves)',
    'Patient Care Documentation', 'Reportable events to RN',
  ];
  makeTable(['Skills', 'Self Rating'], skillList.map(sk => [sk, s(skillsObj[sk])]));

  // ==============================================================
  // AGREEMENTS (all flow naturally, no forced page breaks)
  // ==============================================================
  const ag = (typeof app.agreements === 'object' && app.agreements) ? app.agreements : {};

  heading('PRE-EMPLOYMENT BACKGROUND CHECK AUTHORIZATION');
  setFont('normal', 9);
  const bgTxt = 'I, ' + s(app.first_name) + ' ' + s(app.last_name) + ', understand that as part of the employment process, Divine Healthcare Services, LLC needs to complete a background check on me regarding: Criminal record, Sex and Violent Offenders Record, Employment Verification, Education Verification, License Verification, Motor Vehicle Records, Personal/Professional Reference Verification, Medical Suitability, Drugs/Alcohol.';
  const bgL = doc.splitTextToSize(bgTxt, contentWidth);
  needSpace(bgL.length * 4 + 10);
  doc.text(bgL, margin, y);
  y += bgL.length * 4 + 3;
  field2('Authorized:', ag.backgroundCheck ? 'YES' : 'NO', 'Signature:', ag.backgroundSignature);

  y += 3;
  heading('EMPLOYMENT CERTIFICATION');
  setFont('normal', 9);
  const certTxt = 'I certify that all the information I have provided is true, complete, and correct. I authorize this company to investigate all statements contained on this application. I understand that any misrepresentation or omission of facts is cause for immediate disqualification and/or dismissal.';
  const cL = doc.splitTextToSize(certTxt, contentWidth);
  needSpace(cL.length * 4 + 10);
  doc.text(cL, margin, y);
  y += cL.length * 4 + 3;
  field2('Certified:', ag.certification ? 'YES' : 'NO', 'Signature:', ag.certificationSignature);

  y += 3;
  heading('CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT');
  setFont('normal', 9);
  const ndaTxt = 'It is the responsibility of all Agency employees to preserve and protect confidential Agency, client and employee medical, personal and business information. I acknowledge my legal and ethical responsibility to protect security, privacy, and confidentiality of all records.';
  const nL = doc.splitTextToSize(ndaTxt, contentWidth);
  needSpace(nL.length * 4 + 10);
  doc.text(nL, margin, y);
  y += nL.length * 4 + 3;
  field2('Agreed:', ag.confidentiality ? 'YES' : 'NO', 'Signature:', ag.confidentialitySignature);

  y += 3;
  heading('SUBSTANCE ABUSE POLICY');
  setFont('normal', 9);
  needSpace(14);
  doc.text('Divine Healthcare Services LLC maintains a drug-free workplace. Pre-employment testing required.', margin, y);
  y += 5;
  field2('Acknowledged:', ag.substanceAbuse ? 'YES' : 'NO', 'Signature:', ag.substanceAbuseSignature);

  y += 3;
  heading('AT-WILL EMPLOYMENT');
  setFont('normal', 9);
  needSpace(14);
  doc.text('I understand that employment with Divine Healthcare Services LLC is at-will.', margin, y);
  y += 5;
  field('Acknowledged:', ag.atWill ? 'YES' : 'NO');

  // ==============================================================
  // DOCUMENT CHECKLIST (flows naturally)
  // ==============================================================
  heading('EMPLOYMENT REQUIREMENTS — CHECKLIST');

  const docList = [
    'Unexpired ID / Driver\'s License',
    'US Passport or Work Authorization',
    'Social Security Card (Original Only)',
    '2 Professional References',
    'Pre-employment Physical (within 1 year)',
    'Void Check for Direct Deposit (MANDATORY)',
    'Background Check',
    'Auto Insurance (Optional)',
    'Clear Head-shot (for company ID)',
    'Copy of Nursing License(s)',
    'CPR and First Aid Certificate',
    'PPD within last year',
  ];
  const hasDoc = documents.length > 0;
  makeTable(['#', 'Document Required', 'Status'], docList.map((d, i) => [i + 1, d, hasDoc ? 'See attached' : 'Pending']));

  if (documents.length > 0) {
    y += 1;
    needSpace(10);
    setFont('bold', 10);
    doc.text('Uploaded Documents:', margin, y);
    y += 5;
    documents.forEach(d => {
      needSpace(6);
      setFont('normal', 9);
      const sz = d.file_size ? ' (' + Math.round((d.file_size || 0) / 1024) + ' KB)' : '';
      doc.text('  •  ' + s(d.doc_type) + ': ' + s(d.file_name) + sz, margin, y);
      y += 4;
    });
  }

  // Add footers to all pages
  footer();

  // Save
  const fname = 'Application_' + s(app.reference_number || 'DHH') + '_' + s(app.last_name) + '_' + s(app.first_name) + '.pdf';
  doc.save(fname);
  return fname;
}
