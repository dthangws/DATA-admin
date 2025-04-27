import React from "react";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { usePostLoginMutation } from "../../api/auth";
import { useMessage } from "../../context/MessageContext";

const { Title, Text } = Typography;

const LoginPage = () => {
  const messageApi = useMessage();
  const dispatch = useDispatch();

  const [login, { isLoading }] = usePostLoginMutation();

  interface LoginFormValues {
    email: string;
    password: string;
  }

  const onFinish = (values: LoginFormValues) => {
    login(values).then((res: any) => {
      if (res?.error) {
        messageApi.error(res.error.data.message || "");
      } else {
        localStorage.setItem("accessToken", res?.data?.data?.token);
        dispatch({
          type: "auth/updateAccessToken",
          payload: res?.data?.data?.token,
        });
        window.location.href = "/account-setting/user";
      }
    });
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100vh", background: "#f5f5f5" }}
    >
      <Col span={8}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Đăng nhập
        </Title>

        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Form
            name="login_form"
            initialValues={{}}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input size="large" placeholder="email@gmail.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password size="large" placeholder="********" />
            </Form.Item>

            <Form.Item>
              <Button
                size="large"
                htmlType="submit"
                block
                loading={isLoading}
                style={{
                  background: "#1a1a1a",
                  borderColor: "#1a1a1a",
                  color: "#fff",
                  fontWeight: 500,
                }}
              >
                Sign In
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text>
                <Link to="/forgot-password">Forgot password?</Link>
              </Text>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;
