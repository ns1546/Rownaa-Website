const fs = require('fs');

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

console.log('=== TEST SUITE: DOCUMENT OPTIMIZATION SPEED, RENTAL FLEET STEP 4/5 FLOW & CAR LICENSE TERMINOLOGY ===');

const html = fs.readFileSync('driver-register.html', 'utf8');

// 1. JavaScript Syntax & Reference Safety
assert('No TDZ ReferenceError: selectedRole declared at top of handleDriverApplication',
  html.includes("const selectedRole = document.getElementById('drv-role-val')?.value || 'seeking_fleet_car';\n\n      const agreementCb") ||
  html.includes("const selectedRole = document.getElementById('drv-role-val')?.value || 'seeking_fleet_car';"));

assert('handleDriverApplication wrapped in try-catch with error fallback',
  html.includes('} catch (submitErr) {') && html.includes('console.error(\'Fatal submission error:\', submitErr);'));

// 2. Ultra-Fast Image Compressor
assert('compressAndEncodeImage includes 3.5s safety timeout',
  html.includes('setTimeout(() => {') && html.includes('Image optimizer timed out'));

assert('compressAndEncodeImage includes fast-pass for images under 120KB',
  html.includes('if (file.size && file.size < 120 * 1024)'));

assert('compressAndEncodeImage uses optimized 1000px and medium smoothing quality',
  html.includes("ctx.imageSmoothingQuality = 'medium';"));

// 3. Rental Fleet Driver Picture Upload in Step 4
assert('addFleetDriverCard initializes photo and photoName properties',
  html.includes("photo: null,\n        photoName: ''"));

assert('renderFleetDrivers includes Driver Photo upload button',
  html.includes('fleet-driver-photo-${idx}') && html.includes('Upload Photo'));

assert('handleFleetDriverLicenseUpload handles driver photo compression',
  html.includes("handleFleetDriverLicenseUpload(this, ${idx}, 'photo')"));

// 4. Rental Fleet Step 5 Optimization (No redundant solo uploads)
assert('Step 5 wraps solo uploads in solo-driver-documents-container',
  html.includes('id="solo-driver-documents-container"'));

assert('Step 5 includes rental-fleet-step5-summary-banner',
  html.includes('id="rental-fleet-step5-summary-banner"'));

assert('goToStep(5) automatically hides solo uploads for rental_fleet_operator',
  html.includes("soloWrap.style.display = isFleet ? 'none' : 'block';") &&
  html.includes("fleetBanner.style.display = isFleet ? 'block' : 'none';"));

assert('goToStep(4) updates Next button to "Continue to Review & Submit" for rental fleets',
  html.includes("bn4Span.textContent = currentLang === 'bn' ? 'সারসংক্ষেপ পর্যালোচনা ও সাবমিট করুন' : 'Continue to Review & Submit';"));

assert('Rental Fleet submission bypasses empty Step 5 compression and uses Step 4 driver & car docs directly',
  html.includes("if (selectedRole === 'rental_fleet_operator') {") &&
  html.includes("photoBase64 = fleetDrivers[0].photo || null;"));

// 5. Terminology Check: Blue Book -> Car License
assert('No Blue Book in Step 4 fleet vehicle upload cards',
  !html.includes('Blue Book (Front)') && html.includes('Car License (Front)'));

assert('No Blue Book in Step 5 vehicle upload titles',
  !html.includes('id="up-title-car-lic-front">Car License / Blue Book (Front)') &&
  html.includes('id="up-title-car-lic-front">Car License (Front)'));

assert('No Bengali ব্লু-বুক in Step 4 or Step 5',
  !html.includes('ব্লু-বুক'));

// 6. Google Sheet Webhook Sync
const gs = fs.readFileSync('google_sheet_webhook.gs', 'utf8');
assert('Google Sheet webhook Col AB is "Car License (Front)"',
  gs.includes('"Car License (Front)",                    // Col AB (28)'));

assert('Google Sheet webhook saves fleet driver photos to Drive vault',
  gs.includes('Driver_" + dNum + "_" + dNameClean + "_Photo.jpg'));

assert('Google Sheet webhook uses "Car License" hyperlinks',
  gs.includes('"🚗 Car License Front"') && gs.includes('"🚗 Car License Back"'));

console.log(`\n======================================================`);
console.log(`TOTAL RESULTS: ${pass} PASSED, ${fail} FAILED`);
console.log(`======================================================`);

if (fail > 0) process.exit(1);
