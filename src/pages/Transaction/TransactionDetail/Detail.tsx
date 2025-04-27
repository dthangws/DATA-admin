import React, { useEffect } from "react";
import { Form, Typography, Spin, Image } from "antd";
import { useParams } from "react-router-dom";

import {
  GetDetailTransactionApiResponse,
  useLazyGetDetailTransactionQuery,
} from "@/api/transaction";

const Detail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const [getDetail, { data, isFetching }] = useLazyGetDetailTransactionQuery();

  useEffect(() => {
    if (id) {
      getDetail({ id: Number(id) });
    }
  }, [id]);

  const dataDetail = data as GetDetailTransactionApiResponse;
  console.log("dataDetail", dataDetail);

  return <div>Detail</div>;
};

export default Detail;
