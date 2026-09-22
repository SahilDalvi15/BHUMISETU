const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'client', 'src', 'store', 'initialData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Find the start of initialParcels
const startIndex = content.indexOf('export const initialParcels = [');
if (startIndex === -1) {
  console.error("Could not find initialParcels");
  process.exit(1);
}

// Find the end of initialParcels array
// It ends right before export const initialState
const endIndex = content.indexOf('export const initialState = {');
if (endIndex === -1) {
  console.error("Could not find initialState");
  process.exit(1);
}

const beforeParcels = content.substring(0, startIndex);
const afterParcels = content.substring(endIndex);

const parcelsStr = content.substring(startIndex + 'export const initialParcels = '.length, endIndex).trim();
// Strip the trailing semicolon
const cleanParcelsStr = parcelsStr.replace(/;$/, '');

let parcels = [];
try {
  // Try to parse it
  parcels = eval(`(${cleanParcelsStr})`);
} catch (e) {
  console.error("Failed to parse parcels", e);
  process.exit(1);
}

// Spread them along the Mumbai-Nagpur Samruddhi Mahamarg corridor
// Mumbai: 19.0760, 72.8777
// Nagpur: 21.1458, 79.0882
// We will also add some random jitter so they aren't exactly on a straight line.
parcels.forEach((p, i) => {
  const fraction = i / parcels.length;
  // Linear interpolation
  let lat = 19.0760 + fraction * (21.1458 - 19.0760);
  let lng = 72.8777 + fraction * (79.0882 - 72.8777);
  
  // Add some jitter (approx 20-30km spread)
  lat += (Math.random() - 0.5) * 0.5;
  lng += (Math.random() - 0.5) * 0.5;

  p.lat = parseFloat(lat.toFixed(4));
  p.lng = parseFloat(lng.toFixed(4));
});

const newParcelsStr = 'export const initialParcels = ' + JSON.stringify(parcels, null, 2) + ';\n\n';

fs.writeFileSync(filePath, beforeParcels + newParcelsStr + afterParcels);
console.log("Successfully updated and spread out the parcels!");
