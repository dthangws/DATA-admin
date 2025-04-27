import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Upload,
} from "antd";

import { UserStatusOptions } from "@/constants/master-data";
import { useMessage } from "@/context/MessageContext";
import { ErrorResponse } from "@/type/global";
import {
  GetDetailDocumentApiResponse,
  TypeDocument,
  useLazyGetDetailDocumentQuery,
  usePostDocumentMutation,
  usePutDocumentMutation,
} from "../../../api/document";
import {
  GetListSubjectApiResponse,
  useGetListSubjectQuery,
} from "@/api/subject";
import {
  GetListUniversityApiResponse,
  useGetListUniversityQuery,
} from "@/api/university";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  GetListCategoryApiResponse,
  useGetListCategoryQuery,
} from "@/api/category";

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

  const { data: universities } = useGetListUniversityQuery({});
  const { data: subjects } = useGetListSubjectQuery({});
  const { data: categories } = useGetListCategoryQuery({});
  const [getDetail, { data, isFetching }] = useLazyGetDetailDocumentQuery();
  const [createDocument, { isLoading: isCreating }] = usePostDocumentMutation();
  const [updateDocument, { isLoading: isUpdating }] = usePutDocumentMutation();

  const categoryOptions = (
    categories as GetListCategoryApiResponse
  )?.data?.data?.map((item) => ({
    label: item?.name,
    value: item?.id,
  }));

  const subjectOptions = (
    subjects as GetListSubjectApiResponse
  )?.data?.data?.map((item) => ({
    label: item?.name,
    value: item?.id,
  }));

  const universityOptions = (
    universities as GetListUniversityApiResponse
  )?.data?.data?.map((item) => ({
    label: item?.name,
    value: item?.id,
  }));

  useEffect(() => {
    if (editId) {
      getDetail({ id: editId });
    }
  }, [editId]);

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
        category_ids:
          dataDetail?.data?.documentCategories?.map(
            (item) => item?.category_id
          ) || [],
        fileImages:
          dataDetail?.data?.fileImages?.map((img) => ({
            uid: img?.id,
            name: img?.name,
            status: "done",
            url: `${process.env.REACT_APP_SEVER_URL}/${img.image_path}`,
          })) || [],
      });
    }
  }, [data]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: TypeDocument) => {
    const formData = new FormData();

    formData.append("title", values?.title || "");
    formData.append("description", values?.description || "");
    formData.append("status", values?.status || "pending");
    formData.append("price", values?.price ? String(values.price) : "");
    formData.append(
      "category_ids",
      values?.category_ids ? String(values.category_ids) : ""
    );
    formData.append(
      "subject_id",
      values?.subject_id ? String(values.subject_id) : ""
    );
    formData.append(
      "university_id",
      values?.university_id ? String(values.university_id) : ""
    );

    if (values?.file?.[0]?.originFileObj) {
      formData.append("file", values.file[0].originFileObj || "");
      formData.append("instruct", values.file[0].originFileObj || "");
    }

    if (values?.fileImages) {
      values.fileImages.forEach((file: any) => {
        if (file.originFileObj) {
          formData.append("fileImages", file.originFileObj);
        }
      });
    }

    const submitFn = editId
      ? updateDocument({ id: editId, body: formData })
      : createDocument(formData);

    submitFn.then((res) => {
      if (res?.error) {
        messageApi.error(
          (res as ErrorResponse)?.error?.data?.error?.message ||
            "Lỗi không xác định"
        );
      } else {
        messageApi.success(
          editId ? "Cập nhật thành công!" : "Tạo mới thành công!"
        );
        setIsModalVisible(false);
        form.resetFields();
      }
    });
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      title={!editId ? "Tạo mới tài liệu" : "Cập nhật tài liệu"}
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
            name="title"
            label="Tên tài liệu"
            rules={[{ required: true, message: "Vui lòng nhập tên tài liệu!" }]}
          >
            <Input placeholder="Tên tài liệu" />
          </Form.Item>

          <Form.Item
            name="file"
            label="Tài liệu"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: !editId, message: "Vui lòng chọn file" }]}
          >
            <Upload
              name="file"
              listType="text"
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>

          {dataDetail?.data?.file_path && (
            <Link
              className="text-blue-400 my-2"
              to={`${process.env.REACT_APP_SEVER_URL}/${dataDetail?.data?.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tài liệu
            </Link>
          )}

          {dataDetail?.data?.instruct_path && (
            <Link
              className="text-blue-400 my-2"
              target="_blank"
              rel="noopener noreferrer"
              to={`${process.env.REACT_APP_SEVER_URL}/${dataDetail?.data?.instruct_path}`}
            >
              Instruct
            </Link>
          )}

          <Form.Item
            name="fileImages"
            label="Hình ảnh tài liệu"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="fileImages"
              listType="picture"
              beforeUpload={() => false}
              multiple
              maxCount={10}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              controls={false}
              className="w-full"
              placeholder="Giá"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => (value ? value.replace(/\./g, "") : "")}
            />
          </Form.Item>

          <Form.Item
            name="university_id"
            label="Trường học"
            rules={[{ required: true, message: "Vui lòng chọn trường học!" }]}
          >
            <Select
              placeholder="Trường học"
              style={{ width: "100%", marginBottom: "8px" }}
              options={universityOptions}
            />
          </Form.Item>

          <Form.Item
            name="category_ids"
            label="Chuyên ngành"
            rules={[{ required: true, message: "Vui lòng chọn chuyên ngành!" }]}
          >
            <Select
              placeholder="Chuyên ngành"
              style={{ width: "100%", marginBottom: "8px" }}
              options={categoryOptions}
              mode="multiple"
            />
          </Form.Item>

          <Form.Item
            name="subject_id"
            label="Môn học"
            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
          >
            <Select
              placeholder="Môn học"
              style={{ width: "100%", marginBottom: "8px" }}
              options={subjectOptions}
            />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select
              placeholder="Trạng thái"
              style={{ width: "100%", marginBottom: "8px" }}
              options={UserStatusOptions}
            />
          </Form.Item>

          <Form.Item name="description" label="Ghi chú">
            <Input.TextArea rows={4} />
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
