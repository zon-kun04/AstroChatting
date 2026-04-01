const fs = require('fs');
const path = require('path');

const dir = './';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.json') || file.endsWith('.mjs')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  if (file.endsWith('.js') && file.includes('replace_')) return;
  const before = fs.readFileSync(file, 'utf8');
  
  let after = before.replace(/http:\/\/54\.38\.26\.90:3001/g, 'http://localhost:3001');
  after = after.replace(/ws:\/\/54\.38\.26\.90:3001/g, 'ws://localhost:3001');
  after = after.replace(/54\.38\.26\.90:3001/g, 'localhost:3001');

  
  after = after.replace(/\.replace\(\/\\\\\/\\$\/, ""\)/g, '');
  after = after.replace(/\.replace\(\/\\\\\/\$\/, ""\)/g, '');
  after = after.replace(/\.replace\(\/\\\/\$\/, ""\)/g, '');
  after = after.replace(/\.replace\(\/\\\/\$\/, ''\)/g, '');
  after = after.replace(/\.replace\(\/\\\\\/\\$\/, ''\)/g, '');

  if(before !== after) {
      fs.writeFileSync(file, after, 'utf8');
      console.log('Cleaned file:', file);
  }
});
console.log('Done cleaning IPs and replaces.');
