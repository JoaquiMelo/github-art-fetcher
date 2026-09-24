CREATE TABLE public.agentes_criativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  especialidade TEXT NOT NULL DEFAULT '',
  bio TEXT,
  cidade TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  visivel_mapa BOOLEAN NOT NULL DEFAULT true,
  disponivel BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  nota_media NUMERIC(3,2) NOT NULL DEFAULT 0,
  total_avaliacoes INTEGER NOT NULL DEFAULT 0,
  total_projetos INTEGER NOT NULL DEFAULT 0,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.portfolio_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id UUID NOT NULL REFERENCES public.agentes_criativos(id) ON DELETE CASCADE,
  imagem_url TEXT NOT NULL,
  titulo TEXT,
  descricao TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portfolio_agente ON public.portfolio_itens(agente_id);

GRANT SELECT ON public.agentes_criativos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agentes_criativos TO authenticated;
GRANT ALL ON public.agentes_criativos TO service_role;

GRANT SELECT ON public.portfolio_itens TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_itens TO authenticated;
GRANT ALL ON public.portfolio_itens TO service_role;

ALTER TABLE public.agentes_criativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_itens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agentes visiveis publicamente"
  ON public.agentes_criativos FOR SELECT
  USING (visivel_mapa = true);

CREATE POLICY "Agente le proprio registro"
  ON public.agentes_criativos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Agente cria proprio registro"
  ON public.agentes_criativos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agente atualiza proprio registro"
  ON public.agentes_criativos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Agente remove proprio registro"
  ON public.agentes_criativos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Portfolio publico"
  ON public.portfolio_itens FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.agentes_criativos a WHERE a.id = agente_id AND a.visivel_mapa = true));

CREATE POLICY "Agente gerencia proprio portfolio"
  ON public.portfolio_itens FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agentes_criativos a WHERE a.id = agente_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.agentes_criativos a WHERE a.id = agente_id AND a.user_id = auth.uid()));

INSERT INTO public.agentes_criativos (id, nome, categoria, especialidade, bio, cidade, latitude, longitude, disponivel, avatar_url, nota_media, total_avaliacoes, total_projetos) VALUES
 ('11111111-1111-1111-1111-111111111111','Marina Oliveira','fotografo','Fotógrafa e videomaker','Transformo momentos em imagens com personalidade. Disponível para ensaios, eventos e projetos autorais.','Santos, SP',-23.9608,-46.3339,true,'https://i.pravatar.cc/300?img=47',4.9,127,94),
 ('22222222-2222-2222-2222-222222222222','João Paulo','videomaker','Videomaker','Videomaker para campanhas, eventos e conteúdo digital.','São Vicente, SP',-23.9650,-46.3800,true,'https://i.pravatar.cc/300?img=12',4.7,64,51),
 ('33333333-3333-3333-3333-333333333333','Beatriz Costa','dj','DJ','DJ para casamentos, festas e eventos corporativos.','Guarujá, SP',-23.9900,-46.2600,false,'https://i.pravatar.cc/300?img=25',4.8,89,73),
 ('44444444-4444-4444-4444-444444444444','Rafael Souza','artesao','Artesão','Artesão de peças autorais em madeira para casas e eventos.','Praia Grande, SP',-24.0050,-46.4100,true,'https://i.pravatar.cc/300?img=33',4.6,42,38),
 ('55555555-5555-5555-5555-555555555555','Helena Prado','design','Designer gráfica','Identidade visual e direção de arte para marcas culturais.','Santos, SP',-23.9540,-46.3260,true,'https://i.pravatar.cc/300?img=5',4.9,58,66),
 ('66666666-6666-6666-6666-666666666666','Caio Bernardes','artesanato','Ceramista','Peças de cerâmica utilitária e escultórica feitas à mão.','Bertioga, SP',-23.8540,-46.1390,true,'https://i.pravatar.cc/300?img=52',4.5,31,27);

INSERT INTO public.portfolio_itens (agente_id, imagem_url, titulo) VALUES
 ('11111111-1111-1111-1111-111111111111','https://picsum.photos/seed/arthere-1/600/600','Ensaio urbano'),
 ('11111111-1111-1111-1111-111111111111','https://picsum.photos/seed/arthere-2/600/600','Casamento Ana & Bruno'),
 ('11111111-1111-1111-1111-111111111111','https://picsum.photos/seed/arthere-3/600/600','Editorial de moda'),
 ('22222222-2222-2222-2222-222222222222','https://picsum.photos/seed/joao-1/600/600','Vídeo de campanha'),
 ('33333333-3333-3333-3333-333333333333','https://picsum.photos/seed/beatriz-1/600/600','Evento ao vivo'),
 ('44444444-4444-4444-4444-444444444444','https://picsum.photos/seed/rafael-1/600/600','Coleção em madeira'),
 ('55555555-5555-5555-5555-555555555555','https://picsum.photos/seed/helena-1/600/600','Identidade Festival Mar'),
 ('66666666-6666-6666-6666-666666666666','https://picsum.photos/seed/caio-1/600/600','Série Maresia');