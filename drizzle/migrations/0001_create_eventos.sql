CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL DEFAULT 'Cultura',
  local_nome TEXT NOT NULL,
  cidade TEXT NOT NULL DEFAULT 'Santos',
  endereco TEXT,
  inicio TIMESTAMPTZ NOT NULL,
  fim TIMESTAMPTZ,
  imagem_url TEXT,
  gratuito BOOLEAN NOT NULL DEFAULT true,
  preco_centavos INTEGER CHECK (preco_centavos IS NULL OR preco_centavos >= 0),
  publicado BOOLEAN NOT NULL DEFAULT false,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.eventos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.eventos TO authenticated;
GRANT ALL ON public.eventos TO service_role;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eventos publicados são públicos"
ON public.eventos FOR SELECT TO public
USING (publicado = true);
CREATE POLICY "Organizador lê próprios eventos"
ON public.eventos FOR SELECT TO authenticated
USING (auth.uid() = organizador_id);
CREATE POLICY "Organizador cria eventos"
ON public.eventos FOR INSERT TO authenticated
WITH CHECK (auth.uid() = organizador_id);
CREATE POLICY "Organizador atualiza próprios eventos"
ON public.eventos FOR UPDATE TO authenticated
USING (auth.uid() = organizador_id)
WITH CHECK (auth.uid() = organizador_id);
CREATE POLICY "Organizador remove próprios eventos"
ON public.eventos FOR DELETE TO authenticated
USING (auth.uid() = organizador_id);
CREATE INDEX eventos_inicio_idx ON public.eventos (inicio);
CREATE INDEX eventos_categoria_idx ON public.eventos (categoria) WHERE publicado = true;