// TEMPORARILY COMMENTED OUT - UNDER DEVELOPMENT
const _originalCode = `
import React from "react";
import { Card, Avatar, List, Row, Col, Typography } from "antd";
import { FireFilled } from "@ant-design/icons";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import "./BangXepHang.css";

const { Title } = Typography;

const top3 = [
  { name: "Kim Anh", score: 85, color: "#E7C49A" },
  { name: "Hồng Anh", score: 95, color: "#A52317" },
  { name: "Quang Lê", score: 78, color: "#D17A43" },
];

const others = [
  { rank: 4, name: "Tấn Phát", color: "#E7C49A" },
  { rank: 5, name: "Thảo Quyên", color: "#F0D3B2" },
  { rank: 6, name: "Thành Nam", color: "#A52317" },
  { rank: 7, name: "Đức Anh", color: "#D17A43" },
];

export default function BangXepHang() {
  return (
    <div className="bxh-layout">
      <Row className="bxh-row">
        <Col span={4} className="bxh-sidebar">
          <Sidebar active="bangxephang" />
        </Col>
        <Col span={20} className="bxh-content">
          <Navbar />
          <main className="bxh-main">
            <Title level={3} className="bxh-title">
              Bảng xếp hạng
            </Title>
            <Row justify="center" align="bottom" className="bxh-top3">
              {top3.map((user, index) => (
                <Col key={user.name} className={\`bxh-col bxh-\${index}\`}>
                  <Card
                    className="bxh-card"
                    style={{
                      backgroundColor: user.color,
                      height: 100 + (index === 1 ? 60 : 0),
                    }}
                  >
                    <Avatar
                      size={64}
                      style={{
                        backgroundColor: user.color,
                        border: "3px solid white",
                      }}
                    >
                      {user.name[0]}
                    </Avatar>
                    <p className="bxh-name">{user.name}</p>
                  </Card>
                </Col>
              ))}
            </Row>
            <Card className="bxh-list-card">
              <List
                itemLayout="horizontal"
                dataSource={others}
                renderItem={(item) => (
                  <List.Item className="bxh-list-item">
                    <div className="bxh-rank">{item.rank}</div>
                    <Avatar style={{ backgroundColor: item.color }}>
                      {item.name[0]}
                    </Avatar>
                    <span className="bxh-username">{item.name}</span>
                  </List.Item>
                )}
              />
            </Card>
          </main>
          <div className="bxh-fire">
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
import BangXepHangPlaceholder from "./BangXepHangPlaceholder";

export default function BangXepHang() {
  return <BangXepHangPlaceholder />;
}
