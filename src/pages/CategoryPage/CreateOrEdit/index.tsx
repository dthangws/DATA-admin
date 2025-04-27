import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select, Spin } from "antd";

import { UserStatusOptions } from "@/constants/master-data";
import { useMessage } from "@/context/MessageContext";
import { ErrorResponse } from "@/type/global";
import {
  GetDetailCategoryApiResponse,
  TypeCategory,
  useLazyGetDetailCategoryQuery,
  usePostCategoryMutation,
  usePutCategoryMutation,
} from "../../../api/category";

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

  const [getDetail, { data, isFetching }] = useLazyGetDetailCategoryQuery();
  const [createCategory, { isLoading: isCreating }] = usePostCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = usePutCategoryMutation();

  useEffect(() => {
    if (editId) {
      getDetail({ id: editId });
    }
  }, [editId]);

  useEffect(() => {
    const dataDetail = data as GetDetailCategoryApiResponse;
    if (dataDetail) {
      form.setFieldsValue({
        name: dataDetail?.data?.name || "",
        description: dataDetail?.data?.description || "",
        status: dataDetail?.data?.status || "pending",
      });
    }
  }, [data]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: TypeCategory) => {
    const dataSubmit = {
      name: values?.name || "",
      description: values?.description || "",
      status: values?.status || "pending",
    };

    if (!editId) {
      createCategory(dataSubmit).then((res) => {
        if (res?.error) {
          messageApi.error(
            (res as ErrorResponse).error.data.error.message || ""
          );
        } else {
          messageApi.success("Tạo chuyên ngành thành công!");
          setIsModalVisible(false);
        }
      });
    } else {
      updateCategory({ body: dataSubmit, id: editId }).then((res) => {
        if (res?.error) {
          messageApi.error(
            (res as ErrorResponse).error.data.error.message || ""
          );
        } else {
          messageApi.success("Cập nhật chuyên ngành thành công!");
          setIsModalVisible(false);
        }
      });
    }
  };

  return (
    <Modal
      title={!editId ? "Tạo mới chuyên ngành " : "Cập nhât chuyên ngành"}
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
          <Form.Item
            name="name"
            label="Tên chuyên ngành"
            rules={[
              { required: true, message: "Vui lòng nhập tên chuyên ngành!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Ghi chú">
            <Input.TextArea rows={4} />
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
