const fs=require('fs');const s=fs.readFileSync('app/components/MagicMintButton.tsx','utf8');
let par=0,curly=0,brack=0;let i=0;for(i=0;i<s.length;i++){const c=s[i];if(c==='(')par++; if(c===')')par--; if(c==='{')curly++; if(c==='}')curly--; if(c==='[')brack++; if(c===']')brack--; if(par<0||curly<0||brack<0){console.log('Balance error at index',i,'char',c,'par',par,'curly',curly,'brack',brack); break;}}
console.log('final counts par,curly,brack',par,curly,brack);console.log('position',i);
// print nearby context
console.log(s.slice(Math.max(0,i-200),i+200));
