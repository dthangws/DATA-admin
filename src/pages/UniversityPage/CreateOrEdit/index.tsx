import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select, Spin } from "antd";

import { UserStatusOptions } from "@/constants/master-data";
import { useMessage } from "@/context/MessageContext";
import { ErrorResponse } from "@/type/global";
import {
  GetDetailUniversityApiResponse,
  TypeUniversity,
  useLazyGetDetailUniversityQuery,
  usePostUniversityMutation,
  usePutUniversityMutation,
} from "../../../api/university";

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

  const [getDetail, { data, isFetching }] = useLazyGetDetailUniversityQuery();
  const [createUniversity, { isLoading: isCreating }] =
    usePostUniversityMutation();
  const [updateUniversity, { isLoading: isUpdating }] =
    usePutUniversityMutation();

  useEffect(() => {
    if (editId) {
      getDetail({ id: editId });
    }
  }, [editId]);

  useEffect(() => {
    const dataDetail = data as GetDetailUniversityApiResponse;
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

  const handleSubmit = (values: TypeUniversity) => {
    const dataSubmit = {
      name: values?.name || "",
      description: values?.description || "",
      status: values?.status || "pending",
    };

    if (!editId) {
      createUniversity(dataSubmit).then((res) => {
        if (res?.error) {
          messageApi.error(
            (res as ErrorResponse).error.data.error.message || ""
          );
        } else {
          messageApi.success("Tạo trường học thành công!");
          setIsModalVisible(false);
        }
      });
    } else {
      updateUniversity({ body: dataSubmit, id: editId }).then((res) => {
        if (res?.error) {
          messageApi.error(
            (res as ErrorResponse).error.data.error.message || ""
          );
        } else {
          messageApi.success("Cập nhật trường học thành công!");
          setIsModalVisible(false);
        }
      });
    }
  };

  return (
    <Modal
      title={!editId ? "Tạo mới trường học" : "Cập nhât trường học"}
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
            label="Tên trường học"
            rules={[
              { required: true, message: "Vui lòng nhập tên trường học!" },
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
