export type CategoriaId =
  | "fotografo"
  | "videomaker"
  | "dj"
  | "design"
  | "artesao"
  | "artesanato";

export type CategoriaInfo = {
  id: CategoriaId;
  label: string;
  /** classe de cor de fundo (token semântico) */
  dot: string;
  /** variável CSS usada pelo marcador do mapa */
  cssVar: string;
};

export const CATEGORIAS: Record<CategoriaId, CategoriaInfo> = {
  fotografo: {
    id: "fotografo",
    label: "Fotografia",
    dot: "bg-cat-fotografo",
    cssVar: "--cat-fotografo",
  },
  videomaker: {
    id: "videomaker",
    label: "Videomaker",
    dot: "bg-cat-videomaker",
    cssVar: "--cat-videomaker",
  },
  dj: { id: "dj", label: "DJ", dot: "bg-cat-dj", cssVar: "--cat-dj" },
  design: { id: "design", label: "Design", dot: "bg-cat-design", cssVar: "--cat-design" },
  artesao: { id: "artesao", label: "Artesão", dot: "bg-cat-artesao", cssVar: "--cat-artesao" },
  artesanato: {
    id: "artesanato",
    label: "Artesanato",
    dot: "bg-cat-artesanato",
    cssVar: "--cat-artesanato",
  },
};

export const LISTA_CATEGORIAS = Object.values(CATEGORIAS);

export function categoriaInfo(id: string): CategoriaInfo {
  return CATEGORIAS[id as CategoriaId] ?? CATEGORIAS.design;
}
