import "../styles/Footer.css";
import { useAuth } from './Auth/AuthProvider'
export default function Footer({ params }) {
  const auth = useAuth()
  const t = auth.translate
  return (
    <div className="footer">
      <div className="footer-inner">
        <div className="footer-block footer-block-1">
          <div className="footer-arrow">{">"}</div>
          <div className="footer-block-inner">
            <h4>{t('contacts')}</h4>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id fringilla turpis, quis sollicitudin mi. Fusce quis vestibulum justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin tincidunt accumsan molestie. Vestibulum turpis orci, accumsan ut accumsan sed, ultrices eget risus. Quisque luctus, diam et rutrum rhoncus, lorem justo iaculis enim, eget eleifend mi orci vitae ipsum.
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
              <h4>{t('mySilant')}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
