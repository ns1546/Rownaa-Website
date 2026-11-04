const https = require('https');

const DEPLOYMENT_URL = 'https://script.google.com/macros/s/AKfycbwgSv5OXT-z0dKr06cWRs5r1T-lrT3OYhVmvLQHbwQ7DuteyRoKrjMvAjrfRv9X35dW/exec';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (options.body) {
      if (!reqOptions.headers['Content-Type']) {
        reqOptions.headers['Content-Type'] = 'application/json';
      }
      reqOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = https.request(reqOptions, (res) => {
      // Handle Google Apps Script 302 Redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(request(res.headers.location, { method: 'GET' }));
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json: json
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(45000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTest() {
  console.log('Testing live post with Rental Fleet (Drivers with Photos + Car Licenses)...');
  const testId = 'FLT-TEST-' + Math.floor(1000 + Math.random() * 9000);
  
  const payload = {
    applicationId: testId,
    id: testId,
    fullName: 'Prime Star Rental Car Fleet',
    phone: '01899' + Math.floor(100000 + Math.random() * 900000),
    nidNumber: '5544332211',
    baseCity: 'Dhaka',
    role: 'rental_fleet_operator',
    businessName: 'Prime Star Luxury Cars & Chauffeurs',
    tradeLicense: 'TRD-DHK-99881',
    emergencyContact: { name: 'Shahidul Alam', phone: '01911000000' },
    payoutWallet: 'bKash Merchant - 01899000000',
    fleetData: {
      totalCars: 2,
      totalDrivers: 2,
      cars: [
        { model: 'Toyota Noah Hybrid', plate: 'Dhaka Metro Cha 55-1122', year: 2022, seats: '7 Seats', fuel: 'Hybrid', fitness: '2027-05-15' },
        { model: 'Toyota HiAce Super GL', plate: 'Dhaka Metro Cha 77-3344', year: 2021, seats: '12 Seats', fuel: 'Octane', fitness: '2026-11-20' }
      ],
      drivers: [
        {
          name: 'Kabir Ahmed',
          phone: '01755112233',
          nid: '1987551122334',
          license: 'DL-882194',
          vehicleIndex: 0,
          photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...',
          licenseFront: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...'
        },
        {
          name: 'Monir Hossain',
          phone: '01866334455',
          nid: '1992883344556',
          license: 'DL-773182',
          vehicleIndex: 1,
          photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...',
          licenseFront: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...'
        }
      ]
    }
  };

  const res = await request(DEPLOYMENT_URL, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  console.log('HTTP Status:', res.statusCode);
  console.log('Response JSON:', JSON.stringify(res.json, null, 2));

  if (res.json && res.json.status === 'success') {
    console.log('✅ PASS: Rental Fleet with Driver Photos and Car Licenses recorded successfully!');
  } else {
    console.error('❌ FAIL: Response did not indicate success');
    process.exit(1);
  }
}

runTest();
