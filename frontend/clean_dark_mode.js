const fs = require('fs');

const files = [
  './src/components/Navbar.jsx',
  './src/pages/Profile.jsx',
  './src/layouts/AdminLayout.jsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/dark:[^\s"'\`]+/g, '');
  content = content.replace(/ {2,}/g, ' '); // remove multiple spaces
  fs.writeFileSync(f, content);
  console.log('Processed', f);
});
