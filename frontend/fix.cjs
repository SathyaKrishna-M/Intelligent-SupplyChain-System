const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
fs.readdirSync(dir).forEach(f => {
  if (f.endsWith('.jsx')) {
    const p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    if ((c.includes('useState') || c.includes('useEffect')) && !c.includes("from 'react'")) {
      c = "import { useState, useEffect } from 'react';\n" + c;
      fs.writeFileSync(p, c);
      console.log('Fixed', p);
    }
  }
});
