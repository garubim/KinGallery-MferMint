## Checklist rápido para redeploy & verificação (Remix)

Siga estes passos no Remix e salve os artefatos para me enviar:

1. Compiler
   - Solidity version: **0.8.19** (use exatamente essa versão quando possível)
   - Optimization: **Enabled**
   - Runs: **200**
   - EVM Version: **paris** (se você usou outra, anote: prague, istanbul, shanghai etc.)

2. Compile o contrato (use a fonte **compatível com KinGallery** / flatten se necessário).

3. Antes de deploy
   - Copie o **bytecode de criação (creation bytecode)** tal como aparece (campo "bytecode" no compilador).
   - Anote os **constructor args** (valores), e exporte a chamada (calldata) se o Remix mostrar.
   - Salve o **ABI** gerado.
   - Salve o **Solidity compilation details / build information** (se disponível no Remix).

4. Deploy
   - Faça o redeploy com a conta/parametros desejados.
   - Após o deploy, copie o **transaction receipt** e o **address** do contrato.

5. O que me enviar (cole aqui ou anexe):
   - Creation bytecode (hex completo) — exatamente como saiu do Remix.
   - Constructor args (hex ou valores) e calldata (se disponível).
   - ABI JSON do contrato.
   - Endereço do contrato na rede Base (ou testnet se for um teste).
   - Confirmação da versão do compilador e das opções (optimizer=true, runs=200, evmVersion="paris").

6. O que eu farei com isso
   - Vou gerar um `Standard-JSON` input correspondente, compilar com `solc-js` e comparar o runtime bytecode com o on‑chain.
   - Se necessário, iterarei nas configurações (metadata.bytecodeHash, evmVersion, viaIR, runs) até reproduzir o on‑chain.

Dica: se possível, salve também o arquivo `flattened` fonte (`contracts/MferMintGalleryCompatible_Flattened.sol`) após suas mudanças — facilita gerar o Standard‑JSON exato.
