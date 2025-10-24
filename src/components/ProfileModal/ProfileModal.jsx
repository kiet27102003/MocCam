import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Upload, 
  DatePicker, 
  message, 
  Avatar,
  Row,
  Col,
  Divider,
  Space
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LockOutlined, 
  CameraOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import profileService from '../../services/profileService';
import './ProfileModal.css';

const { TextArea } = Input;

const ProfileModal = ({ 
  visible, 
  onClose, 
  userData, 
  onProfileUpdated 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // 🔹 Khóa scroll ngoài khi modal mở
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [visible]);

  // 🔹 Khởi tạo form với dữ liệu user
  useEffect(() => {
    if (visible && userData) {
      form.setFieldsValue({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone_number: userData.phone_number || '',
        date_of_birth: userData.date_of_birth ? dayjs(userData.date_of_birth) : null,
        bio: userData.bio || ''
      });

      setPreviewImage(userData.picture || null);
    }
  }, [visible, userData, form]);

  // 🔹 Submit form
  const handleSubmit = async (values) => {
    console.log('🚀 [ProfileModal] Bắt đầu submit form:', {
      userId: userData?.id,
      formValues: values,
      timestamp: new Date().toISOString()
    });

    try {
      setLoading(true);
      
      const updateData = {
        full_name: values.full_name,
        email: values.email,
        phone_number: values.phone_number,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null,
        bio: values.bio
      };

      if (values.password && values.password.trim() !== '') {
        updateData.password = '[HIDDEN]'; // Không log password thực
        console.log('🔐 [ProfileModal] Có thay đổi mật khẩu');
      }

      console.log('📤 [ProfileModal] Dữ liệu gửi lên API:', updateData);

      const updatedUser = await profileService.updateProfile(userData.id, updateData);
      
      console.log('✅ [ProfileModal] Cập nhật thành công:', {
        userId: userData.id,
        updatedFields: Object.keys(updateData),
        newUserData: updatedUser,
        timestamp: new Date().toISOString()
      });
      
      message.success('Cập nhật hồ sơ thành công!');
      onProfileUpdated(updatedUser);
      onClose();
      
    } catch (error) {
      console.error('❌ [ProfileModal] Lỗi khi cập nhật hồ sơ:', {
        userId: userData?.id,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setLoading(false);
      console.log('🏁 [ProfileModal] Hoàn thành submit form');
    }
  };

  // 🔹 Upload ảnh đại diện
  const handlePictureUpload = async (file) => {
    console.log('📸 [ProfileModal] Bắt đầu upload ảnh:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      userId: userData?.id,
      timestamp: new Date().toISOString()
    });

    try {
      setUploading(true);

      if (!file.type.startsWith('image/')) {
        console.warn('⚠️ [ProfileModal] File không phải ảnh:', file.type);
        message.error('Chỉ được tải lên file ảnh!');
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        console.warn('⚠️ [ProfileModal] File quá lớn:', file.size);
        message.error('Kích thước ảnh không được vượt quá 5MB!');
        return false;
      }

      console.log('📤 [ProfileModal] Gửi ảnh lên server...');
      const result = await profileService.uploadProfilePicture(userData.id, file);
      
      console.log('✅ [ProfileModal] Upload ảnh thành công:', {
        userId: userData.id,
        newPictureUrl: result.picture,
        timestamp: new Date().toISOString()
      });

      setPreviewImage(result.picture);
      message.success('Cập nhật ảnh đại diện thành công!');
      
      return false;
    } catch (error) {
      console.error('❌ [ProfileModal] Lỗi khi upload ảnh:', {
        userId: userData?.id,
        fileName: file.name,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      message.error(error.message || 'Có lỗi xảy ra khi tải lên ảnh');
      return false;
    } finally {
      setUploading(false);
      console.log('🏁 [ProfileModal] Hoàn thành upload ảnh');
    }
  };

  // 🔹 Đóng modal
  const handleClose = () => {
    console.log('🚪 [ProfileModal] Đóng modal:', {
      userId: userData?.id,
      timestamp: new Date().toISOString()
    });
    form.resetFields();
    setPreviewImage(null);
    onClose();
  };

  return (
    <Modal
      title={(
        <div className="profile-modal-header">
          <UserOutlined />
          <span> Hồ sơ cá nhân</span>
        </div>
      )}
      open={visible}
      onCancel={handleClose}
      width={800}
      className="profile-modal"
      footer={null}
      destroyOnClose
      centered={false}   // ❗ Không căn giữa
      maskClosable={false}
      keyboard={false}
      style={{ top: 30 }} // ❗ Modal nằm lên cao hơn
    >
      <div className="profile-modal-content">
        {/* 🔹 Ảnh đại diện */}
        <div className="profile-picture-section">
          <div className="avatar-container">
            <Avatar
              size={120}
              src={previewImage}
              icon={<UserOutlined />}
              className="profile-avatar"
            />
            <Upload
              showUploadList={false}
              beforeUpload={handlePictureUpload}
              accept="image/*"
              className="avatar-upload"
            >
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                className="upload-button"
                loading={uploading}
              />
            </Upload>
          </div>
          <p className="upload-hint">Nhấn để thay đổi ảnh đại diện</p>
        </div>

        <Divider />

        {/* 🔹 Form hồ sơ */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="profile-form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="full_name"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Nhập họ và tên"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone_number"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày sinh"
                name="date_of_birth"
              >
                <DatePicker
                  placeholder="Chọn ngày sinh"
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* ❌ Bỏ trường role — người dùng không tự thay đổi được */}
            </Col>
          </Row>

          <Form.Item
            label="Giới thiệu bản thân"
            name="bio"
          >
            <TextArea
              rows={4}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Divider />

          {/* 🔹 Nút hành động */}
          <div className="profile-form-actions">
            <Space>
              <Button
                type="default"
                icon={<CloseOutlined />}
                onClick={handleClose}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Lưu thay đổi
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ProfileModal;
