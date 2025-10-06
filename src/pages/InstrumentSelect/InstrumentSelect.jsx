import React from "react";
import "./InstrumentSelect.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const instruments = [
  { name: "Đàn Nguyệt", image: "/nguyệt.png", route: "/home?instrument=nguyet" },
  { name: "Đàn Tranh", image: "/tranh.png", route: "/dan-tranh" },
  { name: "Đàn Tỳ Bà", image: "/tỳ_bà.png", route: "/home?instrument=tyba" },
];

const InstrumentSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (instrument) => {
    // Kiểm tra đàn nào chưa mở
    if (instrument.name === "Đàn Nguyệt" || instrument.name === "Đàn Tỳ Bà") {
      toast.info(`${instrument.name} - Coming Soon 🎵`, {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
      });
    } else {
      navigate(instrument.route);
    }
  };

  return (
    <div className="instrument-select-page">
      <Navbar />

      <div className="instrument-container">
        {instruments.map((item) => (
          <div
            key={item.name}
            className="instrument-card"
            onClick={() => handleSelect(item)}
          >
            <img src={item.image} alt={item.name} className="instrument-img" />
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default InstrumentSelect;
