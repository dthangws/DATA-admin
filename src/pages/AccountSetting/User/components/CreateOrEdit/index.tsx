import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, Spin } from "antd";

import {
  GetDetailUserApiResponse,
  TypeUser,
  useLazyGetDetailUserQuery,
  usePostUserMutation,
  usePutUserMutation,
} from "../../../../../api/user";
import { useMessage } from "../../../../../context/MessageContext";
import { ErrorResponse } from "../../../../../type/global";
import { UserStatusOptions } from "@/constants/master-data";

interface PropsType {
  editId: number;
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateOrEdit = ({
  editId,
  isModalVisible,
  setIsModalVisible,
}: PropsType) => {
  const [form] = Form.useForm();
  const messageApi = useMessage();

  const [getDetail, { data, isFetching }] = useLazyGetDetailUserQuery();
  const [createUser, { isLoading: isCreating }] = usePostUserMutation();
  const [updateUser, { isLoading: isUpdating }] = usePutUserMutation();

  useEffect(() => {
    if (editId) {
      getDetail({ id: editId });
    }
  }, [editId]);

  useEffect(() => {
    const dataDetail = data as GetDetailUserApiResponse;
    if (dataDetail) {
      form.setFieldsValue({
        full_name: dataDetail?.data?.full_name || "",
        username: dataDetail?.data?.username || "",
        email: dataDetail?.data?.email || "",
        phone: dataDetail?.data?.phone || "",
        balance: dataDetail?.data?.balance || "",
        referral_code: dataDetail?.data?.referral_code || undefined,
        status: dataDetail?.data?.status || "pending",
      });
    }
  }, [data]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Gửi dữ liệu khi nhấn "Lưu"
  const handleSubmit = (values: TypeUser) => {
    const dataSubmit = {
      full_name: values?.full_name || "",
      username: values?.username || "",
      email: values?.email || "",
      phone: values?.phone || "",
      balance: values?.balance || 0,
      referral_code: values?.referral_code || null,
      password: values?.password || undefined,
      status: values?.status || "active",
    };

    if (!editId) {
      createUser(dataSubmit).then((res) => {
        if (res?.error) {
          messageApi.error(
            (res as ErrorResponse)?.error?.data?.error?.message ||
              "Xảy ra lỗi. Vui lòng thử lại."
          );
        } else {
          messageApi.success("Tạo người dùng thành công!");
          setIsModalVisible(false);
        }
      });
    } else {
      updateUser({ body: dataSubmit, id: editId }).then((res) => {
        if (res?.error) {
          messageApi.error(
            (res as ErrorResponse)?.error?.data?.error?.message ||
              "Xảy ra lỗi. Vui lòng thử lại."
          );
        } else {
          messageApi.success("Cập nhật người dùng thành công!");
          setIsModalVisible(false);
        }
      });
    }
  };

  return (
    <Modal
      title={!editId ? "Tạo mới người dùng" : "Cập nhât người dùng"}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Spin spinning={isCreating || isUpdating || isFetching}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="[&_.ant-form-item]:mb-3"
        >
          <Form.Item name="full_name" label="Họ tên">
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Tên người dùng"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input disabled={!!editId} />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: !editId, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="balance" label="Số dư">
            <InputNumber
              style={{ widows: "100%" }}
              controls={false}
              className="w-full"
              parser={(value) =>
                parseInt((value || "").replace(/[^\d]/g, ""), 10)
              }
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item name="referral_code" label="Mã giới thiệu">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue="active">
            <Select
              placeholder="Trạng thái"
              style={{ width: "100%", marginBottom: "8px" }}
              options={UserStatusOptions}
            />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateOrEdit;
