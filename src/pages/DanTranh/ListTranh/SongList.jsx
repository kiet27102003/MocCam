import React from "react";
import "./SongList.css";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { FaStar, FaRegStar } from "react-icons/fa";

const songs = [
  {
    id: 1,
    title: "Lý cây đa",
    description: "Dân ca Bắc Bộ",
    color: "#EACBA7",
    rating: 3,
  },
  {
    id: 2,
    title: "Trống cơm",
    description: "Âm hưởng truyền thống",
    color: "#A00000",
    rating: 4,
  },
  {
    id: 3,
    title: "Hò kéo pháo",
    description: "Nhạc cách mạng",
    color: "#800000",
    rating: 4,
  },
];

export default function SongList() {
  return (
    <div className="songlist-page">
      <Navbar />

      <Sidebar active="baihat" />

      <main className="songlist-content">
        <div className="song-search-bar">
          <input type="text" placeholder="Tìm kiếm bài hát" />
          <button className="search-btn">🔍</button>
        </div>

        <div className="song-grid">
          {songs.map((song) => (
            <div key={song.id} className="song-card">
              <div
                className="song-image"
                style={{ backgroundColor: song.color }}
              ></div>
              <div className="song-info">
                <h4>{song.title}</h4>
                <p>{song.description}</p>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((i) =>
                    i <= song.rating ? (
                      <FaStar key={i} className="star filled" />
                    ) : (
                      <FaRegStar key={i} className="star" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
