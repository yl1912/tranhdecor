import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* CỘT 1 */}
        <div className="footer-col">
          <h3>Rock your space!</h3>
          <p>
            Tranh Decor Từ poster đồ họa đến art print, từ những xu hướng được
            nhiều người yêu thích cho đến những sáng tác đậm tính cá nhân. Chúng
            tôi tự tin mang đến cho bạn đa dạng lựa chọn trang trí giúp không
            gian sống động và thể hiện phong cách riêng.
          </p>
        </div>

        {/* CỘT 2 */}
        <div className="footer-col">
          <h3>Tranh Decor</h3>
          <ul>
            <li>Về Tranh Decor</li>
            <li>Hướng dẫn treo tranh</li>
            <li>Chính sách & điều kiện</li>
            <li>Điều khoản & dịch vụ</li>
          </ul>
        </div>

        {/* CỘT 3 - LIÊN LẠC + LIÊN KẾT */}
        <div className="footer-col">
          <h3>Liên lạc</h3>
          <ul className="contact-info">
            <li>📍 Văn phòng: 27G Trần Nhật Duật, Tân Định, Quận 1, TP. HCM</li>
            <li>📞 (+84)768 96 22 76</li>
            <li>✉️ hello@.vn</li>
          </ul>

          <h3>Liên kết</h3>
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-square"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        {/* CỘT 4 — MAP */}
        <div className="footer-col">
          <h3>Bản đồ</h3>
          <div className="map-box">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.605252164116!2d106.6707558735517!3d10.764875359409695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ee10bef3c07%3A0xfd59127e8c2a3e0!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEtpbmggdOG6vyBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1763735287429!5m2!1svi!2s"
              width="100%"
              height="210"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </footer>
  );
}
