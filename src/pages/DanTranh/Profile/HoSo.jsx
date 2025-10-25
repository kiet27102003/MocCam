// TEMPORARILY COMMENTED OUT - UNDER DEVELOPMENT
const _originalCode = `
import React from "react";
import { Card, Avatar, Row, Col, Button, Typography, Input } from "antd";
import { FireFilled } from "@ant-design/icons";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import "./HoSo.css";

const { Title, Text } = Typography;

const suggestedFriends = [
  { name: "Hồng Anh", color: "#A52317" },
  { name: "Kim Anh", color: "#E7C49A" },
  { name: "Thảo Quyên", color: "#F0D3B2" },
];

const newsList = [
  { title: "Lorem ipsum dolor sit amet...", date: "30 MARCH, 2024" },
  { title: "Aenean commodo ligula eget dolor...", date: "30 MARCH, 2024" },
  { title: "Suspendisse potenti. Morbi mattis...", date: "30 MARCH, 2024" },
];

export default function HoSo() {
  return (
    <div className="hoso-layout">
      <Row className="hoso-row">
        <Col span={4} className="hoso-sidebar">
          <Sidebar active="hoso" />
        </Col>
        <Col span={20} className="hoso-content">
          <Navbar />
          <main className="hoso-main">
            <Row gutter={[32, 32]}>
              <Col span={16}>
                <div className="hoso-profile">
                  <Avatar size={96} style={{ backgroundColor: "#E7C49A" }} />
                  <Title level={4}>Tấn Phát</Title>
                  <Text>1 Đang theo dõi · 0 Người theo dõi</Text>
                  <Button type="primary" className="hoso-edit-btn">
                    Chỉnh sửa hồ sơ
                  </Button>
                  <div className="hoso-stats">
                    <Card className="hoso-stat-card">
                      <Title level={4}>10</Title>
                      <Text>Ngày liên tục</Text>
                    </Card>
                    <Card className="hoso-stat-card">
                      <Title level={4}>Đứng thứ 4</Title>
                      <Text>Trên bảng xếp hạng</Text>
                    </Card>
                    <Card className="hoso-stat-card">
                      <Title level={4}>3 giờ 21 phút</Title>
                      <Text>Luyện tập</Text>
                    </Card>
                    <Card className="hoso-stat-card">
                      <Title level={4}>1 bài hát</Title>
                      <Text>Đã mở khóa</Text>
                    </Card>
                  </div>
                  <Title level={5} className="hoso-section-title">
                    Bạn bè đề xuất
                  </Title>
                  <Row gutter={[16, 16]}>
                    {suggestedFriends.map((friend) => (
                      <Col span={8} key={friend.name}>
                        <Card className="hoso-friend-card">
                          <Avatar
                            size={64}
                            style={{ backgroundColor: friend.color }}
                          >
                            {friend.name[0]}
                          </Avatar>
                          <Text>{friend.name}</Text>
                          <Button type="primary" size="small" className="hoso-follow-btn">
                            Theo dõi
                          </Button>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
              <Col span={8}>
                <div className="hoso-news">
                  <Title level={5}>News</Title>
                  {newsList.map((news, index) => (
                    <Card className="hoso-news-card" key={index}>
                      <div className="hoso-news-thumbnail" />
                      <Text type="secondary" className="hoso-news-date">
                        {news.date}
                      </Text>
                      <Text>{news.title}</Text>
                    </Card>
                  ))}
                </div>
              </Col>
            </Row>
          </main>
          <div className="hoso-fire">
            <FireFilled style={{ color: "#A52317", fontSize: 20 }} />
            <span>10</span>
          </div>
        </Col>
      </Row>
    </div>
  );
}
`;

// PLACEHOLDER COMPONENT - UNDER DEVELOPMENT
import HoSoPlaceholder from "./HoSoPlaceholder";

export default function HoSo() {
  return <HoSoPlaceholder />;
}
