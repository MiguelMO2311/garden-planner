import api from "../../../api/axios";
import { getPanelSanitario } from "./panelSanitarioApi";
import type { RiesgoClimatico } from "../types";

export const getRiesgosClimaticos = async (
  cultivoParcelaId: number
): Promise<RiesgoClimatico[]> => {
  const res = await api.get("/riesgos_climaticos/por_cultivo", {
    params: { cultivo_parcela_id: cultivoParcelaId }
  });

  return res.data;
};

export const getRiesgosClimaticosGlobal = async (): Promise<RiesgoClimatico[]> => {
  const panel = await getPanelSanitario();
  const ids = panel.map((p) => p.cultivo_parcela_id);

  const results: { data: RiesgoClimatico[] }[] = await Promise.all(
    ids.map((id) =>
      api.get("/riesgos_climaticos/por_cultivo", {
        params: { cultivo_parcela_id: id }
      })
    )
  );

  return results.flatMap((r) => r.data);
};
