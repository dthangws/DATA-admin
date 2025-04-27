/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiWrapper } from "@/store/apiWrapper";
import { ErrorResponse, UserStatusType } from "@/type/global";
import { PaginationType, TypeUser } from "./user";
import { TypeSubject } from "./subject";
import { TypeUniversity } from "./university";

const injectedRtkApi = apiWrapper.injectEndpoints({
  endpoints: (build) => ({
    getListDocument: build.query<
      GetListDocumentApiResponse | ErrorResponse,
      GetListDocumentApiArg
    >({
      query: (queryArg) => ({
        url: "/document",
        params: queryArg,
      }),
      providesTags: ["document"],
    }),
    getTopViewDocument: build.query<
      GetListDocumentApiResponse | ErrorResponse,
      GetListDocumentApiArg
    >({
      query: (queryArg) => ({
        url: "/document/top-viewed",
        params: queryArg,
      }),
      providesTags: ["document"],
    }),
    getDetailDocument: build.query<
      GetDetailDocumentApiResponse | ErrorResponse,
      GetDetailDocumentApiArg
    >({
      query: (queryArg) => ({
        url: `/document/${queryArg?.id}`,
        params: queryArg,
      }),
    }),
    createPayment: build.mutation<
      PostDocumentApiResponse | ErrorResponse,
      { document_ids: number[] }
    >({
      query: (data) => ({
        url: "/document/payment",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["document"],
    }),
    postDocument: build.mutation<
      PostDocumentApiResponse | ErrorResponse,
      FormData
    >({
      query: (data) => ({
        url: "/document",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["document"],
    }),
    putDocument: build.mutation<
      PostDocumentApiResponse | ErrorResponse,
      PutDocumentApiArg
    >({
      query: (data) => ({
        url: `/document/${data.id}`,
        body: data.body,
        method: "PUT",
      }),
      invalidatesTags: ["document"],
    }),
    deleteDocument: build.mutation<
      DeleteDocumentApiResponse | ErrorResponse,
      DeleteDocumentApiArg
    >({
      query: (queryArg) => ({
        url: `/document/${queryArg?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["document"],
    }),
  }),
});

export type DeleteDocumentApiResponse = {
  data: {
    message: string;
    statusCode: number;
  };
};
export type DeleteDocumentApiArg = {
  id: number;
};

export type PutDocumentApiArg = {
  id: number;
  body: FormData;
};

export type PostDocumentApiResponse = {
  message: string;
  statusCode: number;
  data: TypeDocument;
};

export type GetDetailDocumentApiResponse = {
  data: TypeDocument;
  message: string;
  statusCode: number;
};
export type GetDetailDocumentApiArg = {
  id: number;
};

export type GetListDocumentApiResponse = {
  message?: string;
  statusCode?: number;
  data: {
    data?: TypeDocument[];
    pagination?: PaginationType;
  };
};
export type GetListDocumentApiArg = {
  keyword?: string;
  status?: number;
  page?: number;
  limit?: number;
};

export type TypeDocument = {
  id?: number;
  title?: string;
  description?: string;
  price?: number;
  file_path?: string;
  instruct_path?: string;
  user_id?: number;
  subject_id?: number;
  university_id?: number;
  view_count?: number;
  download_count?: number;
  status?: UserStatusType;
  created_at?: string;
  updatedAt?: string;
  file?: any;
  instruct?: any;
  category_ids?: number[];
  subject?: TypeSubject;
  university?: TypeUniversity;
  user?: TypeUser;
  documentCategories: DocumentCategoryType[];
  fileImages?: FileImages[];
};

export type FileImages = {
  id?: number;
  name?: string;
  image_path?: string;
  created_at?: string;
  updated_at?: string;
};

export type DocumentCategoryType = {
  document_id?: number;
  category_id?: number;
  category?: TypeCategory;
};

export type TypeCategory = {
  id?: number;
  name?: string;
  status?: UserStatusType;
  createdAt?: string;
  updatedAt?: string;
};

export { injectedRtkApi as DocumentApi };
export const {
  useGetListDocumentQuery,
  useLazyGetListDocumentQuery,
  useGetTopViewDocumentQuery,
  useLazyGetTopViewDocumentQuery,
  useGetDetailDocumentQuery,
  useLazyGetDetailDocumentQuery,
  useCreatePaymentMutation,
  usePostDocumentMutation,
  usePutDocumentMutation,
  useDeleteDocumentMutation,
} = injectedRtkApi;
