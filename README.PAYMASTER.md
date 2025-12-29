README — KinGallery + MferMint (Paymaster-first)

Resumo
- Este repositório contém a versão final do scaffold "KinGallery+MferMint" que deve ser publicada.
- Arquitetura: paymaster-first. A app não injeta provedores de carteira por padrão nem força preferência por uma carteira específica.
- Fluxo principal: cliente gera unsigned payloads -> paymaster (Wallet Server V2) assina/relaya e gerencia chaves seguras no servidor.
- O paymaster fornece UI/painel/modal neutro com opções de conexão que ele suporta (BasePay, WalletConnect, smart wallets, etc.), sem priorizar nenhuma.

Regras operacionais (resumidas)
- Não colocar secrets do paymaster no frontend. Secrets em `PAYMASTER_SECRET` só no servidor (Netlify function, serverless, ou segredo gerenciado).
- O servidor atua como relayer/guardian: aceita pagamentos em ETH/USDC/ERC20 que o paymaster suporta e executa swap/cambio quando necessário.
- O frontend apenas envia `unsignedPayload` e exibe as opções que o paymaster retorna. Tudo a ver com a segurança do servidor.

Como este build difere dos anteriores
- Simplificado: sem injeções de provedores ou flows externos diretamente embutidos.
- Depende de Wallet Server V2 (relayer) para gerenciar chaves privadas e segredos.
- Objetivo: reduzir superfície de ataque, facilitar deploy e auditoria.

Onde colocar ativos de UI
- Coloque animações e assets em `public/animations/mint-button/` (já populado).

Notas sobre Next.js
- Versão usada localmente no scaffold: leia `package.json` (ex.: Next 16.x). Evitar canary em produção: podemos pinnear `16.1.1` estável. Ver releases oficiais para canary/patch notes.

Contato/Próximos passos
- Se concorda: (A) inicializo git no diretório separado `KinGallery+MferMint` e preparo push; (B) deixo `next dev` rodando e faço smoke test e testes de wallet/paymaster.
