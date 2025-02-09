import "../styles/Footer.css";

export default function Footer({ params }) {
  return (
    <div className="footer">
      <div className="footer-inner">
        <div className="footer-block footer-block-1">
          <div className="footer-arrow">{">"}</div>
          <div className="footer-block-inner">
            <h4>Контакты</h4>
            <div>
              React is a popular JavaScript library for building user
              interfaces, especially for single-page applications. It allows
              developers to create reusable UI components. One of the many
              features that make React stand out is its ability to handle
              events. In this blog post, we will focus on one specific event,
              the onScrollCapture event.
            </div>
          </div>
        </div>
        <div className="footer-block-2-3">
          <div className="footer-block footer-block-2">
            <div className="footer-arrow">{">"}</div>
            <div className="footer-block-inner">
              <h4>Telegram: +7-8352-20-12-09</h4>
            </div>
          </div>
          <div className="footer-block footer-block-3">
            <div className="footer-arrow">{">"}</div>
            <div className="footer-block-inner">
              <h4>Мой Силант 2022</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
