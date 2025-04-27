import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select, Spin } from "antd";

import { UserStatusOptions } from "@/constants/master-data";
import { useMessage } from "@/context/MessageContext";
import { ErrorResponse } from "@/type/global";
import {
  GetDetailSubjectApiResponse,
  TypeSubject,
  useLazyGetDetailSubjectQuery,
  usePostSubjectMutation,
  usePutSubjectMutation,
} from "../../../api/subject";

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

  const [getDetail, { data, isFetching }] = useLazyGetDetailSubjectQuery();
  const [createSubject, { isLoading: isCreating }] = usePostSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = usePutSubjectMutation();

  useEffect(() => {
    if (editId) {
      getDetail({ id: editId });
    }
  }, [editId]);

  useEffect(() => {
    const dataDetail = data as GetDetailSubjectApiResponse;
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

  const handleSubmit = (values: TypeSubject) => {
    const dataSubmit = {
      name: values?.name || "",
      description: values?.description || "",
      status: values?.status || "pending",
    };

    if (!editId) {
      createSubject(dataSubmit).then((res) => {
        if (res?.error) {
          messageApi.error(
            (res as ErrorResponse).error.data.error.message || ""
          );
        } else {
          messageApi.success("Tạo môn học thành công!");
          setIsModalVisible(false);
        }
      });
    } else {
      updateSubject({ body: dataSubmit, id: editId }).then((res) => {
        if (res?.error) {
          messageApi.error(
            (res as ErrorResponse).error.data.error.message || ""
          );
        } else {
          messageApi.success("Cập nhật môn học thành công!");
          setIsModalVisible(false);
        }
      });
    }
  };

  return (
    <Modal
      title={!editId ? "Tạo mới môn học" : "Cập nhât môn học"}
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
            label="Tên môn học"
            rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}
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
