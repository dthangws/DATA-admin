import React, { useEffect } from "react";
import { Form, Typography, Spin, List, Image } from "antd";
import { useParams } from "react-router-dom";

import {
  GetDetailDocumentApiResponse,
  useLazyGetDetailDocumentQuery,
} from "@/api/document";
import { handleGetFile } from "@/utils";

const Detail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const [getDetail, { data, isFetching }] = useLazyGetDetailDocumentQuery();

  useEffect(() => {
    if (id) {
      getDetail({ id: Number(id) });
    }
  }, [id]);

  const dataDetail = data as GetDetailDocumentApiResponse;
  useEffect(() => {
    if (dataDetail) {
      form.setFieldsValue({
        title: dataDetail?.data?.title || "",
        price: dataDetail?.data?.price || "",
        subject_id: dataDetail?.data?.subject_id || "",
        university_id: dataDetail?.data?.university_id || "",
        status: dataDetail?.data?.status || "pending",
        description: dataDetail?.data?.description || "",
      });
    }
  }, [data]);

  return (
    <Spin spinning={isFetching}>
      <Form
        form={form}
        layout="horizontal"
        className="[&_.ant-form-item]:mb-3"
        labelCol={{ span: 6 }}
        labelAlign="left"
      >
        <div className="flex gap-x-6">
          <div className="w-1/3">
            <Form.Item label="Tên tài liệu">
              <Typography>{dataDetail?.data?.title || ""}</Typography>
            </Form.Item>

            <Form.Item label="Trường học">
              <Typography>
                {dataDetail?.data?.university?.name || ""}
              </Typography>
            </Form.Item>

            <Form.Item label="Môn học">
              <Typography>{dataDetail?.data?.subject?.name || ""}</Typography>
            </Form.Item>

            <Form.Item label="Giá">
              <Typography>
                {dataDetail?.data?.price
                  ? `${Number(dataDetail.data.price).toLocaleString(
                      "vi-VN"
                    )} VNĐ`
                  : ""}
              </Typography>
            </Form.Item>

            <Typography.Title level={5} className="uppercase mb-4">
              Chi tiết tác giả
            </Typography.Title>

            <Form.Item label="Tên tác giả">
              <Typography>{dataDetail?.data?.user?.full_name || ""}</Typography>
            </Form.Item>

            <Form.Item label="Email">
              <Typography>{dataDetail?.data?.user?.email || ""}</Typography>
            </Form.Item>

            <Form.Item label="Số điện thoại">
              <Typography>{dataDetail?.data?.user?.phone || ""}</Typography>
            </Form.Item>
          </div>
          <div className="flex-1">
            <Form.Item label="Hình ảnh tài liệu">
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
                dataSource={dataDetail?.data?.fileImages || []}
                renderItem={(image) => (
                  <List.Item>
                    <Image
                      src={handleGetFile(image?.image_path || "")}
                      className="!max-h-[150px] !w-full object-cover"
                      preview
                    />
                  </List.Item>
                )}
              />
            </Form.Item>

            <Form.Item label="Tài liệu">
              {dataDetail?.data?.file_path &&
              /\.(jpe?g|png|gif|bmp|webp)$/i.test(
                dataDetail?.data?.file_path
              ) ? (
                <Image
                  src={handleGetFile(dataDetail?.data?.file_path)}
                  className="!max-h-[300px] !w-full object-cover"
                />
              ) : (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    `${process.env.REACT_APP_SEVER_URL}/${dataDetail?.data?.file_path}`
                  )}&embedded=true`}
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  title="Document Preview"
                />
              )}
            </Form.Item>
          </div>
        </div>
      </Form>
    </Spin>
  );
};

export default Detail;
