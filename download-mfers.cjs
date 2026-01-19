const https = require('https');
const fs = require('fs');
const path = require('path');

// 15 IDs variados entre 1-10000
const mferIds = [69, 420, 777, 1337, 42, 100, 500, 888, 1000, 2000, 3333, 5000, 6969, 8000, 9999];

const outputDir = path.join(__dirname, 'public', 'mfers-samples');

// Cria diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadMfer(id) {
  return new Promise((resolve) => {
    // Busca metadata do IPFS
    https.get(`https://ipfs.io/ipfs/QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo/${id}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const meta = JSON.parse(data);
          const imageUrl = meta.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
          
          // Baixa imagem
          const filePath = path.join(outputDir, `mfer-${id}.png`);
          https.get(imageUrl, (imgRes) => {
            const file = fs.createWriteStream(filePath);
            imgRes.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log(`✅ Mfer #${id} baixado`);
              resolve();
            });
          }).on('error', (err) => {
            console.error(`❌ Erro ao baixar imagem #${id}:`, err.message);
            resolve();
          });
        } catch(e) {
          console.error(`❌ Erro ao parsear metadata #${id}:`, e.message);
          resolve();
        }
      });
    }).on('error', (err) => {
      console.error(`❌ Erro ao buscar metadata #${id}:`, err.message);
      resolve();
    });
  });
}

(async () => {
  console.log('📥 Baixando 15 Mfers...\n');
  for (const id of mferIds) {
    await downloadMfer(id);
    await new Promise(r => setTimeout(r, 800)); // delay entre requests
  }
  console.log('\n🎉 Todos os Mfers foram baixados em /public/mfers-samples/');
})();
