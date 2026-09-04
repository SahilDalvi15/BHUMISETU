const mongoose = require('mongoose');
const dotenv = require('dotenv');
const State = require('../models/State');
const District = require('../models/District');
const Village = require('../models/Village');

dotenv.config({ path: '../../.env' });

const seedMasterData = async () => {
  try {
    // For demo purposes we can run this without full connection if we just want the script ready
    // mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing
    await State.deleteMany({});
    await District.deleteMany({});
    await Village.deleteMany({});

    console.log('Seeding Master Data (Synthetic)...');

    // States
    const mh = await State.create({ code: 'MH', name: 'Maharashtra', region: 'West' });
    const up = await State.create({ code: 'UP', name: 'Uttar Pradesh', region: 'North' });

    // Districts
    const thn = await District.create({ code: 'THN', name: 'Thane', stateId: mh._id });
    const pne = await District.create({ code: 'PNE', name: 'Pune', stateId: mh._id });
    const lko = await District.create({ code: 'LKO', name: 'Lucknow', stateId: up._id });

    // Villages
    await Village.create([
      { code: 'V-THN-01', name: 'Murbad', districtId: thn._id, stateId: mh._id, coordinates: { lat: 19.25, lng: 73.40 } },
      { code: 'V-THN-02', name: 'Shahapur', districtId: thn._id, stateId: mh._id, coordinates: { lat: 19.45, lng: 73.30 } },
      { code: 'V-PNE-01', name: 'Khed', districtId: pne._id, stateId: mh._id, coordinates: { lat: 18.85, lng: 73.90 } },
      { code: 'V-LKO-01', name: 'Bakshi Ka Talab', districtId: lko._id, stateId: up._id, coordinates: { lat: 26.95, lng: 80.95 } }
    ]);

    console.log('Master data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedMasterData();
}

module.exports = seedMasterData;
