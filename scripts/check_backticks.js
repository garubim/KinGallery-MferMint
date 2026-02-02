const fs=require('fs');
const s=fs.readFileSync('app/components/MagicMintButton.tsx','utf8');
let count=0;let positions=[];
for(let i=0;i<s.length;i++){
  const c=s[i];
  if(c==='`'){
    // check if escaped
    let esc=0;let j=i-1;while(j>=0 && s[j]==='\\'){esc++;j--;}
    if(esc%2===0){count++;positions.push(i+1);} // 1-based
  }
}
console.log('backtick count:',count);
if(count%2!==0){
  console.log('Odd number of backticks — probable unclosed template literal. Positions (1-based):',positions.slice(-10));
} else {
  console.log('Backticks balanced.');
}
// Also find unclosed braces in JSX-ish parts by counting braces
let open=0;for(let i=0;i<s.length;i++){const c=s[i];if(c==='{') open++; if(c==='}') open--}
console.log('brace balance (should be 0):',open);
