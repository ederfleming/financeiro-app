import {
  addTag as addTagStorage,
  deleteTag as deleteTagStorage,
  editTag as editTagStorage,
  getTags,
} from "@/services/storage";
import { Categoria, TagsPorCategoria } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useTags = () => {
  const [tags, setTags] = useState<TagsPorCategoria>({
    entradas: [],
    saidas: [],
    diarios: [],
    cartao: [],
    economia: [],
  });
  const [loading, setLoading] = useState(true);

  const carregarTags = useCallback(async () => {
    try {
      setLoading(true);
      const tagsCarregadas = await getTags();
      setTags(tagsCarregadas);
    } catch (error) {
      console.error("Erro ao carregar tags:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTags();
  }, [carregarTags]);

  const adicionarTag = useCallback(
    async (categoria: Categoria, nomeTag: string) => {
      const resultado = await addTagStorage(categoria, nomeTag);

      if (resultado.success) {
        await carregarTags();
      }

      return resultado;
    },
    [carregarTags]
  );

  const editarTag = useCallback(
    async (categoria: Categoria, nomeAntigo: string, nomeNovo: string) => {
      const resultado = await editTagStorage(categoria, nomeAntigo, nomeNovo);

      if (resultado.success) {
        await carregarTags();
      }

      return resultado;
    },
    [carregarTags]
  );

  const removerTag = useCallback(
    async (categoria: Categoria, nomeTag: string) => {
      const resultado = await deleteTagStorage(categoria, nomeTag);

      if (resultado.success) {
        await carregarTags();
      }

      return resultado;
    },
    [carregarTags]
  );

  return {
    tags,
    loading,
    adicionarTag,
    editarTag,
    removerTag,
    recarregarTags: carregarTags,
  };
};
