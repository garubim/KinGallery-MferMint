const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/', (req, res) => {
  const { method, id } = req.body || {};
  if (method === 'pm_getPaymasterStubData') {
    return res.json({
      jsonrpc: '2.0',
      id: id || 1,
      result: {
        paymaster: '0x0000000000000000000000000000000000000000',
        paymasterInput: '0x',
      },
    });
  }

  if (method === 'eth_sendUserOperation') {
    return res.json({ jsonrpc: '2.0', id: id || 1, result: '0xmock-tx-hash' });
  }

  // default echo
  res.json({ jsonrpc: '2.0', id: id || 1, result: { received: true, body: req.body } });
});

const port = process.env.MOCK_PAYMASTER_PORT || 3001;
app.listen(port, () => console.log(`Mock Paymaster listening on http://localhost:${port}`));
