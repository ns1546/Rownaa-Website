const fs = require('fs');

const filesToTest = [
  'driver-register.html',
  'netlify-driver-portal/index.html',
  'Rownaa-Frontend-Netlify/driver-register.html'
];

let pass = 0, fail = 0;
function assert(desc, cond) {
  if (cond) {
    console.log('✅ PASS:', desc);
    pass++;
  } else {
    console.error('❌ FAIL:', desc);
    fail++;
  }
}

console.log('=== VERIFYING STEP 1 CLEANLINESS & SUCCESS SCREEN CORRECTION OPTION ===');

filesToTest.forEach(file => {
  console.log(`\nTesting file: ${file}`);
  const html = fs.readFileSync(file, 'utf8');

  // 1. Step 1 Cleanliness
  assert(`${file}: Old visible correction bar removed from Step 1`, !html.includes('class="correction-helper-bar"'));
  assert(`${file}: Resubmission fields are hidden by default`, html.includes('id="resubmission-hidden-fields" style="display:none;"'));
  assert(`${file}: Checkbox chk-is-resubmission exists in DOM`, html.includes('id="chk-is-resubmission"'));
  assert(`${file}: Input resubmit-prev-id exists in DOM`, html.includes('id="resubmit-prev-id"'));

  // 2. Success Screen Correction Card
  assert(`${file}: Success Screen has success-correction-container`, html.includes('id="success-correction-container"'));
  assert(`${file}: Success Screen has correction header with bilingual text`, html.includes('id="lbl-succ-correction-header"'));
  assert(`${file}: Success Screen has edit & correct button`, html.includes('id="btn-succ-correction-act"'));
  assert(`${file}: Button calls reopenApplicationForCorrection()`, html.includes('onclick="reopenApplicationForCorrection()"'));

  // 3. JavaScript Functions
  assert(`${file}: reopenApplicationForCorrection function exists`, html.includes('function reopenApplicationForCorrection()'));
  assert(`${file}: cancelCorrectionMode function exists`, html.includes('function cancelCorrectionMode()'));
  assert(`${file}: reopenApplicationForCorrection sets chk.checked = true`, html.includes('chk.checked = true;'));
  assert(`${file}: reopenApplicationForCorrection populates prevId with cleanRef`, html.includes('prevId.value = cleanRef;'));
  assert(`${file}: window.lastSubmittedAppId is stored on submission`, html.includes('window.lastSubmittedAppId = appId;'));

  // 4. Bilingual Language Support
  assert(`${file}: Bilingual support translates lbl-succ-correction-header in BN`, html.includes("lang === 'bn' ? 'ভুল তথ্য দিয়ে থাকলে সংশোধন করুন'"));
  assert(`${file}: Bilingual support translates lbl-succ-correction-btn in BN`, html.includes("lang === 'bn' ? 'আবেদন সংশোধন করুন'"));
});

// 5. Google Apps Script Webhook Defensive Freeze Fix
console.log('\nTesting Google Apps Script: google_sheet_webhook.gs');
const gs = fs.readFileSync('google_sheet_webhook.gs', 'utf8');
assert('GS expands columns before breakApart', gs.includes('if (curCols < 40)'));
assert('GS breaks apart dataRange defensively', gs.includes('sheet.getDataRange().breakApart();'));
assert('GS wraps setFrozenColumns in try-catch with fallback unmerging', gs.includes('Logger.log("setFrozenColumns note: " + fcErr.toString());'));

console.log(`\n========================================`);
console.log(`TOTAL RESULTS: ${pass} PASSED, ${fail} FAILED`);
console.log(`========================================`);
if (fail > 0) process.exit(1);
