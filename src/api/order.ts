import { apiWrapper } from "@/store/apiWrapper";
import { ErrorResponse, UserStatusType } from "@/type/global";
import { PaginationType, TypeUser } from "./user";
import { TypeDocument } from "./document";

const injectedRtkApi = apiWrapper.injectEndpoints({
  endpoints: (build) => ({
    getListOrder: build.query<
      GetListOrderApiResponse | ErrorResponse,
      GetListOrderApiArg
    >({
      query: (queryArg) => ({
        url: "/order",
        params: queryArg,
      }),
      providesTags: ["order"],
    }),
    getDetailOrder: build.query<
      GetDetailOrderApiResponse | ErrorResponse,
      GetDetailOrderApiArg
    >({
      query: (queryArg) => ({
        url: `/order/${queryArg?.id}`,
        params: queryArg,
      }),
    }),
    postOrder: build.mutation<PostOrderApiResponse | ErrorResponse, TypeOrder>({
      query: (data) => ({
        url: "/order",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["order"],
    }),
    putOrder: build.mutation<
      PostOrderApiResponse | ErrorResponse,
      PutOrderApiArg
    >({
      query: (data) => ({
        url: `/order/${data.id}`,
        body: data.body,
        method: "PUT",
      }),
      invalidatesTags: ["order"],
    }),
    deleteOrder: build.mutation<
      DeleteOrderApiResponse | ErrorResponse,
      DeleteOrderApiArg
    >({
      query: (queryArg) => ({
        url: `/order/${queryArg?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export type DeleteOrderApiResponse = {
  data: {
    message: string;
    statusCode: number;
  };
};
export type DeleteOrderApiArg = {
  id: number;
};

export type PutOrderApiArg = {
  id: number;
  body: TypeOrder;
};

export type PostOrderApiResponse = {
  message: string;
  statusCode: number;
  data: TypeOrder;
};

export type GetDetailOrderApiResponse = {
  data: TypeOrder;
  message: string;
  statusCode: number;
};
export type GetDetailOrderApiArg = {
  id: number;
};

export type GetListOrderApiResponse = {
  message?: string;
  statusCode?: number;
  data: {
    data?: TypeOrder[];
    pagination?: PaginationType;
  };
};
export type GetListOrderApiArg = {
  keyword?: string;
  status?: number;
  page?: number;
  limit?: number;
};

export type TypeOrder = {
  id?: number;
  user_id?: number;
  total_amount?: number;
  status?: UserStatusType;
  created_at?: string;
  updatedAt?: string;

  user?: TypeUser;
  orderItems?: TypeOrderItem[];
  referral_history?: TypeReferralHistory[];
};

export type TypeReferralHistory = {
  id?: number;
  order_id?: number;
  commission_amount?: string;
  created_at?: string;
};

export type TypeOrderItem = {
  id?: number;
  order_id?: number;
  document_id?: number;
  price?: number;
  document?: TypeDocument;
};

export { injectedRtkApi as OrderApi };
export const {
  useGetListOrderQuery,
  useLazyGetListOrderQuery,
  useGetDetailOrderQuery,
  useLazyGetDetailOrderQuery,
  usePostOrderMutation,
  usePutOrderMutation,
  useDeleteOrderMutation,
} = injectedRtkApi;
