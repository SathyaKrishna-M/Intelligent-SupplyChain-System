const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  
  // Replace `setStats(res.data)` with `setStats(res.data.data || res.data)`
  // This safely handles both the wrapper and direct responses
  c = c.replace(/set([A-Za-z]+)\(res\.data\)/g, "set$1(res.data.data || res.data)");
  
  // For Inventory.jsx, we need to fix the Array.isArray check and the setLowStock filter
  if (f === 'Inventory.jsx') {
    c = c.replace(/if \(res\.data && Array\.isArray\(res\.data\)\) \{/g, "if (res.data) { const d = res.data.data || res.data; if (Array.isArray(d)) {");
    c = c.replace(/setProducts\(res\.data\);/g, "setProducts(d);");
    c = c.replace(/setLowStock\(res\.data\.filter/g, "setLowStock(d.filter");
    // Add the closing brace for the new if statement... wait, the original was:
    // if (res.data && Array.isArray(res.data)) {
    //   setProducts(res.data);
    //   setLowStock(res.data.filter(...));
    // }
    // If we replace the first line, it becomes:
    // if (res.data) { const d = res.data.data || res.data; if (Array.isArray(d)) {
    // We would need an extra closing brace.
    // Instead, let's just do a simpler replacement:
    c = c.replace(/const res = await api\.get\('\/products'\);\n\s*if \(res\.data && Array\.isArray\(res\.data\)\) \{\n\s*setProducts\(res\.data\);\n\s*setLowStock\(res\.data\.filter\(p => p\.stockQuantity <= 50\)\);\n\s*\}/g, 
      "const res = await api.get('/products');\n      const d = res.data?.data || res.data;\n      if (d && Array.isArray(d)) {\n        setProducts(d);\n        setLowStock(d.filter(p => p.stockQuantity <= 50));\n      }");
  }

  fs.writeFileSync(p, c);
  console.log('Fixed', p);
});
