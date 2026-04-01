import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  let y = 0;

  const app = application;

  // -- Helpers --
  const addPage = () => { doc.addPage(); y = margin; addFooter(); };
  const checkSpace = (needed) => { if (y + needed > ph - 25) addPage(); };

  const setFont = (style = 'normal', size = 10) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  };

  const drawLine = (x1, yy, x2) => {
    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(x1, yy, x2, yy);
  };

  const sectionTitle = (text) => {
    checkSpace(14);
    y += 6;
    setFont('bold', 12);
    doc.setTextColor(60, 90, 65);
    doc.text(text, pw / 2, y, { align: 'center' });
    y += 2;
    drawLine(margin, y, pw - margin);
    y += 6;
    doc.setTextColor(50, 50, 50);
  };

  const fieldRow = (label, value, x = margin, width = contentWidth) => {
    checkSpace(10);
    setFont('bold', 9);
    doc.text(label, x, y);
    setFont('normal', 10);
    const labelW = doc.getTextWidth(label) + 2;
    const val = value != null && value !== '' ? String(value) : '______________________';
    doc.text(val, x + labelW, y);
    y += 6;
  };

  const fieldRowDouble = (label1, val1, label2, val2) => {
    checkSpace(10);
    const half = contentWidth / 2;
    setFont('bold', 9);
    doc.text(label1, margin, y);
    setFont('normal', 10);
    doc.text(val1 || '_______________', margin + doc.getTextWidth(label1) + 2, y);
    setFont('bold', 9);
    doc.text(label2, margin + half, y);
    setFont('normal', 10);
    doc.text(val2 || '_______________', margin + half + doc.getTextWidth(label2) + 2, y);
    y += 6;
  };

  const fieldRowTriple = (l1, v1, l2, v2, l3, v3) => {
    checkSpace(10);
    const third = contentWidth / 3;
    [[l1, v1, 0], [l2, v2, third], [l3, v3, third * 2]].forEach(([l, v, offset]) => {
      setFont('bold', 9);
      doc.text(l, margin + offset, y);
      setFont('normal', 10);
      doc.text(v || '________', margin + offset + doc.getTextWidth(l) + 2, y);
    });
    y += 6;
  };

  const addFooter = () => {
    const pageNum = doc.internal.getNumberOfPages();
    setFont('normal', 8);
    doc.setTextColor(150);
    doc.text(`Divine Healthcare Services LLC — Employment Application — Page ${pageNum}`, pw / 2, ph - 10, { align: 'center' });
    doc.setTextColor(50, 50, 50);
  };

  // ============================================================
  // PAGE 1: HEADER + PERSONAL + LICENSES + EMPLOYMENT DESIRED + EDUCATION
  // ============================================================
  y = margin;

  // Header
  setFont('bold', 22);
  doc.setTextColor(90, 120, 96);
  doc.text('Divine', pw / 2, y, { align: 'center' });
  y += 6;
  setFont('normal', 11);
  doc.text('HealthCare Services LLC', pw / 2, y, { align: 'center' });
  y += 6;
  setFont('bold', 13);
  doc.setTextColor(50, 50, 50);
  doc.text('APPLICATION FOR EMPLOYMENT', pw / 2, y, { align: 'center' });
  y += 4;
  drawLine(margin, y, pw - margin);
  y += 4;

  // Date
  setFont('normal', 9);
  doc.text(`Date: ${new Date(app.created_at).toLocaleDateString()}`, pw - margin - 50, y);
  y += 4;

  // -- PERSONAL --
  sectionTitle('PERSONAL');

  fieldRow('Legal Name:', `${app.first_name || ''} ${app.middle_name || ''} ${app.last_name || ''}`.trim());
  fieldRowDouble('Preferred Name:', app.preferred_name, 'Soc Sec # (last 4):', app.ssn_last4 ? `***-**-${app.ssn_last4}` : '');
  fieldRowDouble('Date of Birth:', app.date_of_birth || '', 'Gender:', app.gender || '');
  fieldRow('Address:', app.street || '');
  fieldRowTriple('City:', app.city, 'State:', app.state, 'Zip Code:', app.zip);
  fieldRowDouble('Home Phone:', app.home_phone, 'Cell Phone:', app.cell_phone);
  fieldRow('E-mail:', app.email || '');
  fieldRowDouble('Are you 18+?', app.is_over_18, 'US Citizen?', app.is_citizen);
  if (app.is_citizen === 'No') fieldRow('Legally eligible?', app.is_eligible);
  fieldRow('How did you hear about us:', app.hear_about_us || '');
  if (app.former_names) fieldRow('Former Names:', app.former_names);
  if (app.drivers_license) fieldRowDouble("Driver's License:", app.drivers_license, 'DL State:', app.drivers_license_state);

  // -- NURSING LICENSE TABLE --
  sectionTitle('Nursing License and/or Certificate Information');
  const licenses = app.licenses || [];
  const licData = licenses.length > 0
    ? licenses.map(l => [l.type || '', l.state || '', l.expirationYear || '', l.number || ''])
    : [['', '', '', ''], ['', '', '', '']];
  doc.autoTable({
    startY: y,
    head: [['License/Certificate Type', 'State', 'Exp. Year', 'Lic or Certificate Number']],
    body: licData,
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [90, 120, 96], textColor: 255, fontStyle: 'bold' },
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 6;

  // -- EMPLOYMENT DESIRED --
  sectionTitle('EMPLOYMENT DESIRED');
  fieldRowTriple('Position:', app.position, 'Date you can start:', app.start_date || '', 'Rate:', app.desired_pay);
  const empTypes = (app.employment_type || []).join(', ');
  const shifts = (app.preferred_shift || []).join(', ');
  fieldRowDouble('Type of Employment:', empTypes, 'Shifts:', shifts);
  fieldRowDouble('Previously employed by us?', app.previously_employed, 'If yes, when?', app.previous_dates);

  // -- EDUCATION --
  sectionTitle('EDUCATION BACKGROUND');
  const education = app.education || [];
  const eduData = education.length > 0
    ? education.map(e => [e.level || '', e.schoolName || '', e.yearsAttended || '', e.state || '', e.degreeNumber || ''])
    : [['High School', '', '', '', ''], ['College', '', '', '', ''], ['University', '', '', '', ''], ['Nursing', '', '', '', ''], ['Other', '', '', '', '']];
  doc.autoTable({
    startY: y,
    head: [['Education', 'Name and Location of School', 'Years Attended', 'State', 'Lic Number']],
    body: eduData,
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [90, 120, 96], textColor: 255, fontStyle: 'bold' },
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 6;

  addFooter();

  // ============================================================
  // PAGE 2: EMPLOYMENT HISTORY
  // ============================================================
  addPage();
  sectionTitle('EMPLOYMENT HISTORY');
  setFont('normal', 8);
  doc.text('List your record of employment beginning with your present or most recent position.', margin, y);
  y += 6;

  const employers = app.employers || [];
  (employers.length > 0 ? employers : [{}]).forEach((emp, idx) => {
    checkSpace(60);
    if (idx > 0) { y += 4; drawLine(margin, y, pw - margin); y += 6; }
    fieldRow('Name of Employer:', emp.name);
    fieldRowDouble('May We Contact?', emp.mayContact, 'Contact Number:', emp.phone);
    fieldRowTriple('City:', emp.city, 'State:', emp.state, 'Zip Code:', emp.zip);
    fieldRowTriple('Your Title:', emp.title, 'Supervisor:', emp.supervisor, "Supervisor's Title:", emp.supervisorTitle);
    fieldRowDouble('From:', emp.dateFrom, 'To:', emp.dateTo);
    fieldRow('Work Performed:', emp.workPerformed);
    fieldRow('Reason for leaving:', emp.reasonLeaving);
  });

  y += 6;
  drawLine(margin, y, pw - margin);
  y += 8;

  // Background questions
  const bgQuestions = [
    ['Have you ever been convicted, plead guilty or no contest to a crime?', app.convicted, app.convicted_explanation],
    ['Have you ever been excluded from the Medicare or Medicaid program?', app.excluded_medicaid, app.excluded_explanation],
    ['Have you ever been disciplined by professional or state ethics or licensing board?', app.disciplined, app.disciplined_explanation],
  ];
  bgQuestions.forEach(([q, answer, explanation]) => {
    checkSpace(20);
    setFont('normal', 9);
    doc.text(q, margin, y, { maxWidth: contentWidth });
    y += 5;
    fieldRow('Answer:', answer || '');
    if (answer === 'Yes' && explanation) {
      fieldRow('Explanation:', explanation);
    }
    y += 2;
  });

  addFooter();

  // ============================================================
  // PAGE 3: REFERENCES
  // ============================================================
  addPage();
  sectionTitle('REFERENCE INFORMATION');

  const refs = app.references_data || [];
  (refs.length > 0 ? refs : [{}, {}]).forEach((ref, idx) => {
    checkSpace(30);
    setFont('bold', 10);
    doc.text(`Reference ${idx + 1}`, margin, y);
    y += 6;
    fieldRow('Name of Reference:', ref.name);
    fieldRowDouble('Day Time Telephone #:', ref.phone, 'Best Times to Contact:', ref.bestTime);
    y += 4;
  });

  addFooter();

  // ============================================================
  // PAGE 4: SKILLS CHECKLIST
  // ============================================================
  addPage();
  sectionTitle('CNA/GNA/CMT Skills Checklist');
  setFont('normal', 8);
  doc.text('A = I can perform well   B = I need to review   C = I have no experience', margin, y);
  y += 6;

  const skills = app.skills_assessment || {};
  const skillNames = [
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
  const skillData = skillNames.map(s => [s, skills[s] || '']);
  doc.autoTable({
    startY: y,
    head: [['Skills', 'Self Rating']],
    body: skillData,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [90, 120, 96], textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: contentWidth - 30 }, 1: { cellWidth: 25, halign: 'center' } },
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 6;

  addFooter();

  // ============================================================
  // PAGE 5: BACKGROUND CHECK AUTHORIZATION
  // ============================================================
  addPage();
  sectionTitle('PRE-EMPLOYMENT BACKGROUND CHECK AUTHORIZATION');

  const agreements = app.agreements || {};
  setFont('normal', 9);
  const bgText = `I, ${app.first_name} ${app.last_name}, understand that as part of the employment process, Divine Healthcare Services, LLC. needs to complete a background check on me regarding:\n\n1. Criminal record\n2. Sex and Violent Offenders Record\n3. Employment Verification\n4. Education Verification\n5. License Verification\n6. Motor Vehicle Records\n7. Personal/Professional Reference Verification\n8. Medical Suitability\n9. Drugs/Alcohol`;
  const lines = doc.splitTextToSize(bgText, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 4 + 6;

  checkSpace(20);
  fieldRowDouble('Authorized:', agreements.backgroundCheck ? 'YES' : 'NO', 'Signature:', agreements.backgroundSignature || '');

  addFooter();

  // ============================================================
  // PAGE 6: EMPLOYMENT CERTIFICATION
  // ============================================================
  checkSpace(50);
  y += 8;
  sectionTitle('EMPLOYMENT CERTIFICATION');
  setFont('normal', 9);
  const certText = 'I certify that all the information I have provided is true, complete, and correct. The information contained within this application or any cover letter and/or resume attached is not shared with any third parties. I authorize this company to investigate all statements contained on this application. I understand that any misrepresentation or omission of facts called for is cause for immediate disqualification and/or if employed, immediate dismissal.';
  const certLines = doc.splitTextToSize(certText, contentWidth);
  doc.text(certLines, margin, y);
  y += certLines.length * 4 + 6;

  fieldRowDouble('Certified:', agreements.certification ? 'YES' : 'NO', 'Signature:', agreements.certificationSignature || '');
  fieldRow('Date:', new Date(app.created_at).toLocaleDateString());

  addFooter();

  // ============================================================
  // PAGE 7: CONFIDENTIALITY & NDA
  // ============================================================
  addPage();
  sectionTitle('CONFIDENTIALITY & NON-DISCLOSURE AGREEMENT');
  setFont('normal', 8);
  const ndaText = 'It is the responsibility of all Agency employees to preserve and protect confidential Agency, client and employee medical, personal and business information and, thus, shall not disclose such information except as authorized by law, client or individual.\n\nI acknowledge that I understand it is my legal and ethical responsibility to protect the security, privacy, and confidentiality of all client records, Agency information and other confidential information relating to the Agency.';
  const ndaLines = doc.splitTextToSize(ndaText, contentWidth);
  doc.text(ndaLines, margin, y);
  y += ndaLines.length * 3.5 + 6;

  fieldRowDouble('Agreed:', agreements.confidentiality ? 'YES' : 'NO', 'Signature:', agreements.confidentialitySignature || '');

  // SUBSTANCE ABUSE
  y += 8;
  sectionTitle('SUBSTANCE ABUSE POLICY ACKNOWLEDGMENT');
  setFont('normal', 8);
  const saText = 'Divine Healthcare Services LLC is committed to providing a safe work environment and to fostering the well-being and health of all its employees. Pre-employment drug testing is required for all positions. Violation of this policy will result in disciplinary action up to and including termination.';
  const saLines = doc.splitTextToSize(saText, contentWidth);
  doc.text(saLines, margin, y);
  y += saLines.length * 3.5 + 6;

  fieldRowDouble('Acknowledged:', agreements.substanceAbuse ? 'YES' : 'NO', 'Signature:', agreements.substanceAbuseSignature || '');

  // AT-WILL
  y += 8;
  checkSpace(30);
  sectionTitle('AT-WILL EMPLOYMENT ACKNOWLEDGMENT');
  setFont('normal', 8);
  doc.text('I understand that employment with Divine Healthcare Services LLC is at-will.', margin, y);
  y += 5;
  fieldRow('Acknowledged:', agreements.atWill ? 'YES' : 'NO');

  addFooter();

  // ============================================================
  // PAGE 8: DOCUMENT CHECKLIST
  // ============================================================
  addPage();
  sectionTitle('EMPLOYMENT REQUIREMENTS — CHECKLIST');

  const requiredDocs = [
    ['Unexpired ID / Driver\'s License', true],
    ['US Passport, Permanent Resident Card, or Work Authorization', true],
    ['Social Security Card (Original Only)', true],
    ['2 References', true],
    ['Pre-employment Physical (within 1 year)', true],
    ['Void Check for Direct Deposit (MANDATORY)', true],
    ['Background Check (must be received prior to start date)', true],
    ['Auto Insurance Information (Optional)', false],
    ['Clear Head-shot (for company ID)', true],
    ['Copy of Nursing License(s) — for clinical roles', true],
    ['Current CPR and First Aid Certificate — for clinical roles', true],
    ['PPD within last year — for clinical roles', true],
  ];

  const uploadedTypes = new Set(documents.map(d => d.doc_type));
  const checklistData = requiredDocs.map(([name, req]) => {
    const key = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 10);
    const uploaded = documents.some(d => d.file_name && d.doc_type);
    return [req ? '* Required' : 'Optional', name, uploaded ? 'Uploaded' : 'Pending'];
  });

  doc.autoTable({
    startY: y,
    head: [['Status', 'Document', 'Submitted']],
    body: checklistData,
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [90, 120, 96], textColor: 255, fontStyle: 'bold' },
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 8;

  if (documents.length > 0) {
    setFont('bold', 10);
    doc.text('Uploaded Documents:', margin, y);
    y += 6;
    documents.forEach(d => {
      checkSpace(8);
      setFont('normal', 9);
      doc.text(`• ${d.doc_type}: ${d.file_name} (${((d.file_size || 0) / 1024).toFixed(0)} KB)`, margin + 4, y);
      y += 5;
    });
  }

  addFooter();

  // -- Save --
  const fileName = `Application_${app.reference_number || 'DHH'}_${app.last_name || 'Unknown'}_${app.first_name || ''}.pdf`;
  doc.save(fileName);
  return fileName;
}
