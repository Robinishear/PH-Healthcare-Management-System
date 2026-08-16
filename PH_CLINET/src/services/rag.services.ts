import { httpClient } from "@/lib/axios/httpClient";
import { IIngestDoctorsData, IRagQueryData, IRagQueryPayload } from "@/types/rag.types";

export const queryRagService = async (payload: IRagQueryPayload) => {
    const response = await httpClient.post<IRagQueryData>("/rag/query", payload);

    return response;
}

export const ingestDoctorService = async () => {
    const response = await httpClient.post<IIngestDoctorsData>("/rag/ingest-doctors", {});
    return response;
}

export const congressDoctorService = ingestDoctorService;