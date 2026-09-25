# Tela de calendário de eventos

## O que será criado
- Uma página **Eventos** no estilo editorial do Arthere, acessível pelo menu principal.
- Calendário mensal com navegação entre meses, destaque do dia selecionado e marcações nos dias com programação.
- Lista da agenda do mês e painel de detalhes com data, horário, local, categoria, descrição e ação para demonstrar interesse.
- Filtros rápidos por tipo de evento e busca por nome ou local.
- Adaptação completa para celular e computador, mantendo a paleta e a tipografia atuais.

## Dados
- Estrutura de eventos no Lovable Cloud, protegida por regras de acesso.
- Eventos de demonstração da Baixada Santista para a tela já abrir preenchida.

## Detalhes técnicos
- Nova rota `/eventos`, ligada ao item “Eventos” da navegação.
- Calendário baseado nos controles já disponíveis no projeto e datas tratadas com `date-fns` em português.
- Metadados próprios para a página de eventos.
