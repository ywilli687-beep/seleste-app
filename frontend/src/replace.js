const fs = require('fs');
const file = '/Users/yannickwilliams/Downloads/seleste/seleste-antigravity/frontend/src/components/ResultsView.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(
  '${window.location.origin}/report/${result.slug || result.auditId}',
  '${window.location.origin}/results/${result.auditId}'
);
fs.writeFileSync(file, data);
console.log("Done");
