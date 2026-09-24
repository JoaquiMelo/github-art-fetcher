# Migrar o Arthere_ para o Lovable

## O que é o Arthere_
Aplicativo (TCC) que conecta **agentes criativos** (fotógrafos, DJs, artesãos, designers, videomakers) a **contratantes**. Hoje é um app mobile (Expo/React Native) com backend NestJS + MySQL. O Lovable não roda app mobile nativo nem NestJS, então vamos recriá-lo como **aplicativo web completo** (funciona no celular e no computador), com banco de dados e login embutidos (Lovable Cloud).

## Identidade visual (preservada do app original)
- Paleta da marca: coral `#EB6241`, terracota `#D88160`, azul `#90C8D8`, areia `#F2CE99`, grafite `#29242B`, papel `#F6F1E8`
- Categorias com cores próprias: Artesanato, Design, Fotógrafo, DJ, Videomaker, Artesão
- Interface em português

## Telas a recriar (do app original)
1. **Login e cadastro** — com escolha de tipo: Agente Criativo ou Contratante
2. **Mapa** — agentes criativos visíveis no mapa com marcadores por categoria
3. **Perfil** — perfil de agente (especialidade, bio, cidade, portfólio, avaliações) e de contratante (empresa), com edição
4. **Eventos** — lista e detalhes de eventos
5. **Oportunidades** — projetos publicados por contratantes; agentes se candidatam; contratante gerencia candidaturas
6. **Chat** — conversas entre agente e contratante
7. **Configurações**

## Dados (Lovable Cloud)
Tabelas equivalentes ao banco atual: usuários, perfis de agente e contratante, projetos, candidaturas, portfólio, avaliações, eventos, mensagens. Regras de acesso por tipo de usuário (agente/contratante/admin).

## O que muda em relação ao original
- App mobile nativo → aplicativo web responsivo
- Login por JWT próprio → login do Lovable Cloud (e-mail + senha)
- Banco MySQL → banco do Lovable Cloud
- Dados de exemplo (mocks) → dados reais no banco

## Dados existentes
O repositório não inclui os registros do banco atual. Depois da prévia, você pode exportar as tabelas (CSV/JSON) do banco MySQL atual e eu importo.

## Detalhes técnicos
- Stack: TanStack Start + Tailwind + shadcn; Lovable Cloud (auth, Postgres, storage)
- Mapa: Leaflet (carregado só no cliente)
- Roles em tabela separada `user_roles` com função `has_role`; RLS em todas as tabelas
- Upload de imagens de portfólio/avatar no storage do Cloud
