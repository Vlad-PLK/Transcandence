import { useContext, useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useTranslation } from "react-i18next";
import TranslationSelect from "./TranslationSelect";
import './customFonts.css';
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import UserHomePage from "./UserHomePage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { UserConnectContext } from "./UserConnectContext";
import { userData } from "three/examples/jsm/nodes/Nodes.js";
import { TwoFaContext } from "./TwoFaContext";
import api from "./api";

function TypingEffect({ text, speed = 100, fontFamily = 'cyber4' }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset animation when text changes (language switch)
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <h1 className="display-3 fw-bold mb-4" style={{ fontFamily, minHeight: '80px' }}>
      {displayedText}
      <span className="typing-cursor">|</span>
    </h1>
  );
}

function ScrollIndicator() {
  return (
    <div className="scroll-indicator">
      <div className="mouse">
        <div className="wheel"></div>
      </div>
      <div className="arrow-down">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

function WelcomePage()
{
  const { t } = useTranslation();
  const {navigate} = useNavigate();
  const {userData} = useContext(UserDataContext);
  const {TwoFA, setTwoFA} = useContext(TwoFaContext);

  const main_image = {
		backgroundImage: `url('/cyberpunk1.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundAttachment: 'fixed',
	};

	return (
    <>
    {userData == null ?
      <>
      <div className="welcome-container" style={main_image}>
        {/* Fixed Header Navigation */}
        <header className="fixed-header" style={{fontFamily: 'cyber4'}}>
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-lg-start">
              <TranslationSelect/>
              <a href="/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
                <span className="fs-5">{t('main.title')}</span>
              </a>
              <div className="text-end">
                <button type="button" className="btn btn-outline-light rounded-3 me-2" data-bs-toggle="modal" data-bs-target="#loginModal">{t('login')}</button>
              </div>
            </div>
          </div>
        </header>

        {/* Section 1: Hero - Welcome */}
        <section id="hero" className="section-full">
          <div className="container h-100 d-flex align-items-center justify-content-center">
            <div className="row w-100">
              <div className="col-lg-8 mx-auto text-center text-white">
                <div className="hero-content p-5 rounded-4 shadow-lg">
                  <TypingEffect text={t('welcomePage.hero.title')} speed={80} fontFamily="cyber4" />

                  <p className="lead mb-4" style={{fontFamily: 'cyber4', fontSize: '1.2rem'}}>
                    {t('welcomePage.hero.subtitle')}
                  </p>

                  <div className="hero-description mt-4">
                    <h4 className="mb-3" style={{fontFamily: 'cyber4', color: '#61DAFB', fontSize: '1.5rem'}}>
                      {t('welcomePage.hero.whatIsTitle')}
                    </h4>
                    <p className="paragraph-text">
                      {t('welcomePage.hero.description1')}
                    </p>
                    <p className="paragraph-text mt-3">
                      {t('welcomePage.hero.description2')}
                    </p>
                  </div>

                  <div className="mt-5">
                    <button type="button" className="btn btn-lg btn-primary rounded-3 px-5 py-3 shadow"
                            data-bs-toggle="modal" data-bs-target="#signupModal"
                            style={{fontFamily: 'cyber4', fontSize: '1.1rem'}}>
                      {t('welcomePage.hero.getStarted')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        {/* Section 2: Key Features */}
        <section id="features" className="section-full">
          <div className="container h-100 d-flex align-items-center justify-content-center">
            <div className="row w-100">
              <div className="col-lg-10 mx-auto text-white">
                <div className="section-content p-5 rounded-4 shadow-lg">
                  <h2 className="text-center mb-5" style={{fontFamily: 'cyber4', color: '#61DAFB', fontSize: '2.5rem'}}>
                    {t('welcomePage.features.title')}
                  </h2>

                  <div className="row mt-4">
                    <div className="col-md-6 mb-4">
                      <div className="feature-card p-4 rounded-3">
                        <h5 className="feature-title" style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem'}}>
                          {t('welcomePage.features.graphics.title')}
                        </h5>
                        <p className="paragraph-text">
                          {t('welcomePage.features.graphics.description')}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="feature-card p-4 rounded-3">
                        <h5 className="feature-title" style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem'}}>
                          {t('welcomePage.features.gameModes.title')}
                        </h5>
                        <p className="paragraph-text">
                          {t('welcomePage.features.gameModes.description')}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="feature-card p-4 rounded-3">
                        <h5 className="feature-title" style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem'}}>
                          {t('welcomePage.features.auth.title')}
                        </h5>
                        <p className="paragraph-text">
                          {t('welcomePage.features.auth.description')}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="feature-card p-4 rounded-3">
                        <h5 className="feature-title" style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem'}}>
                          {t('welcomePage.features.customization.title')}
                        </h5>
                        <p className="paragraph-text">
                          {t('welcomePage.features.customization.description')}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="feature-card p-4 rounded-3">
                        <h5 className="feature-title" style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem'}}>
                          {t('welcomePage.features.social.title')}
                        </h5>
                        <p className="paragraph-text">
                          {t('welcomePage.features.social.description')}
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="feature-card p-4 rounded-3">
                        <h5 className="feature-title" style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem'}}>
                          {t('welcomePage.features.languages.title')}
                        </h5>
                        <p className="paragraph-text">
                          {t('welcomePage.features.languages.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScrollIndicator />
        </section>

        {/* Section 3: Tech Stack + Footer */}
        <section id="tech-stack" className="section-full section-with-footer">
          <div className="container h-100 d-flex flex-column justify-content-between py-5">
            {/* Tech Stack Content */}
            <div className="row flex-grow-1 align-items-center">
              <div className="col-lg-10 mx-auto text-white">
                <div className="section-content p-5 rounded-4 shadow-lg">
                  <h2 className="text-center mb-5" style={{fontFamily: 'cyber4', color: '#61DAFB', fontSize: '2.5rem'}}>
                    {t('welcomePage.techStack.title')}
                  </h2>

                  <div className="row mt-4">
                    <div className="col-md-4 mb-4">
                      <div className="tech-card p-4 rounded-3">
                        <h5 style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.4rem', textAlign: 'center', marginBottom: '1.5rem'}}>
                          {t('welcomePage.techStack.frontend.title')}
                        </h5>
                        <ul className="tech-list paragraph-text">
                          <li>{t('welcomePage.techStack.frontend.react')}</li>
                          <li>{t('welcomePage.techStack.frontend.threejs')}</li>
                          <li>{t('welcomePage.techStack.frontend.router')}</li>
                          <li>{t('welcomePage.techStack.frontend.bootstrap')}</li>
                          <li>{t('welcomePage.techStack.frontend.i18n')}</li>
                        </ul>
                      </div>
                    </div>

                    <div className="col-md-4 mb-4">
                      <div className="tech-card p-4 rounded-3">
                        <h5 style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.4rem', textAlign: 'center', marginBottom: '1.5rem'}}>
                          {t('welcomePage.techStack.backend.title')}
                        </h5>
                        <ul className="tech-list paragraph-text">
                          <li>{t('welcomePage.techStack.backend.django')}</li>
                          <li>{t('welcomePage.techStack.backend.drf')}</li>
                          <li>{t('welcomePage.techStack.backend.channels')}</li>
                          <li>{t('welcomePage.techStack.backend.jwt')}</li>
                          <li>{t('welcomePage.techStack.backend.postgres')}</li>
                        </ul>
                      </div>
                    </div>

                    <div className="col-md-4 mb-4">
                      <div className="tech-card p-4 rounded-3">
                        <h5 style={{fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.4rem', textAlign: 'center', marginBottom: '1.5rem'}}>
                          {t('welcomePage.techStack.infrastructure.title')}
                        </h5>
                        <ul className="tech-list paragraph-text">
                          <li>{t('welcomePage.techStack.infrastructure.docker')}</li>
                          <li>{t('welcomePage.techStack.infrastructure.nginx')}</li>
                          <li>{t('welcomePage.techStack.infrastructure.redis')}</li>
                          <li>{t('welcomePage.techStack.infrastructure.ssl')}</li>
                          <li>{t('welcomePage.techStack.infrastructure.daphne')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <span className="badge bg-primary me-2 mb-2">React 18.3.1</span>
                    <span className="badge bg-success me-2 mb-2">Django 5.1</span>
                    <span className="badge bg-info me-2 mb-2">Three.js</span>
                    <span className="badge bg-warning text-dark mb-2">Docker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Width Footer Section */}
        <section id="footer" className="section-full-footer">
          <footer className="w-100 py-2 text-white" style={{backgroundColor: 'rgba(0, 0, 0, 0.9)', position: 'relative', zIndex: 100, minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
            <div className="container">
              <div className="row">
                <div className="col-md-4 mb-2">
                  <h5 style={{fontFamily: 'cyber4', color: '#61DAFB', fontSize: '1.1rem'}}>{t('welcomePage.footer.aboutTitle')}</h5>
                  <p className="paragraph-text small" style={{fontSize: '0.85rem'}}>
                    {t('welcomePage.footer.aboutDescription')}
                  </p>
                  <p className="paragraph-text small mt-1" style={{fontSize: '0.8rem'}}>
                    <strong>{t('welcomePage.footer.developmentTime')}</strong> {t('welcomePage.footer.developmentTimeValue')}<br/>
                    <strong>{t('welcomePage.footer.teamSize')}</strong> {t('welcomePage.footer.teamSizeValue')}<br/>
                    <strong>{t('welcomePage.footer.linesOfCode')}</strong> {t('welcomePage.footer.linesOfCodeValue')}
                  </p>
                </div>

                <div className="col-md-4 mb-2">
                  <h5 style={{fontFamily: 'cyber4', color: '#61DAFB', fontSize: '1.1rem'}}>{t('welcomePage.footer.teamTitle')}</h5>
                  <ul className="list-unstyled paragraph-text small">
                    <li className="mb-1">
                      <strong>Vlad-PLK</strong> (vpolojie)<br/>
                      <span style={{color: 'white', fontSize: '0.8rem'}}>{t('welcomePage.footer.vlad')}</span>
                    </li>
                    <li className="mb-1">
                      <strong>gendelize</strong><br/>
                      <span style={{color: 'white', fontSize: '0.8rem'}}>{t('welcomePage.footer.gendelize')}</span>
                    </li>
                    <li className="mb-1">
                      <strong>TVincil</strong><br/>
                      <span style={{color: 'white', fontSize: '0.8rem'}}>{t('welcomePage.footer.tvincil')}</span>
                    </li>
                  </ul>
                </div>

                <div className="col-md-4 mb-2">
                  <h5 style={{fontFamily: 'cyber4', color: '#61DAFB', fontSize: '1.1rem'}}>{t('welcomePage.footer.linksTitle')}</h5>
                  <ul className="list-unstyled paragraph-text small">
                    <li className="mb-1">
                      <a href="https://github.com/Vlad-PLK/Transcendence"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-white text-decoration-none"
                         style={{fontSize: '0.85rem'}}>
                        {t('welcomePage.footer.githubRepo')}
                      </a>
                    </li>
                    <li className="mb-1">
                      <a href="https://github.com/Vlad-PLK/Transcendence/issues"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-white text-decoration-none"
                         style={{fontSize: '0.85rem'}}>
                        {t('welcomePage.footer.reportIssues')}
                      </a>
                    </li>
                    <li className="mb-1">
                      <a href="https://42nice.fr/"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-white text-decoration-none"
                         style={{fontSize: '0.85rem'}}>
                        {t('welcomePage.footer.school42')}
                      </a>
                    </li>
                    <li className="mb-1">
                      <a href="https://github.com/Vlad-PLK"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-white text-decoration-none"
                         style={{fontSize: '0.85rem'}}>
                        {t('welcomePage.footer.vladProfile')}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <hr className="my-2 border-secondary"/>

              <div className="row align-items-center">
                <div className="col-md-4 small paragraph-text">
                  <p className="mb-0" style={{fontSize: '0.75rem'}}>
                    {t('welcomePage.footer.copyright')}
                  </p>
                </div>
                <div className="col-md-4 text-center small paragraph-text">
                  <p className="mb-0" style={{fontSize: '0.75rem', color: 'white'}}>
                    {t('welcomePage.footer.tagline')}
                  </p>
                </div>
                <div className="col-md-4 text-md-end small paragraph-text">
                  <p className="mb-0" style={{fontSize: '0.75rem'}}>
                    {t('welcomePage.footer.madeWith')} <strong>42 Nice School</strong> | 
                    <a href="https://github.com/Vlad-PLK/Transcendence"
                       className="text-white text-decoration-none ms-1">
                      {t('welcomePage.footer.starOnGithub')}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </section>
      </div>

      {/* Modals */}
      <LoginModal/>
      <RegisterModal/>

      {/* Styles */}
      <style>{`
        /* Global Styles */
        .welcome-container {
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          height: 100vh;
          scroll-behavior: smooth;
        }

        /* Fixed Header */
        .fixed-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        /* Section Styles */
        .section-full {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          position: relative;
          padding: 100px 20px 80px 20px;
        }

        .section-with-footer {
          display: block;
          padding: 100px 20px 0px 20px;
          min-height: calc(100vh - 200px);
        }

        .section-with-footer .container {
          min-height: auto;
        }

        .section-full-footer {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          position: relative;
          padding: 0;
        }

        /* Content Boxes */
        .hero-content,
        .section-content {
          background-color: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(97, 218, 251, 0.2);
          transition: transform 0.3s ease;
        }

        .hero-content:hover,
        .section-content:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(97, 218, 251, 0.2);
        }

        /* Typography */
        .paragraph-text {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          color: #e0e0e0;
        }

        /* Feature Cards */
        .feature-card {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          transition: all 0.3s ease;
          height: 100%;
        }

        .feature-card:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
        }

        /* Tech Cards */
        .tech-card {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(97, 218, 251, 0.3);
          transition: all 0.3s ease;
          height: 100%;
        }

        .tech-card:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: rgba(97, 218, 251, 0.6);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(97, 218, 251, 0.3);
        }

        .tech-list {
          list-style-type: none;
          padding-left: 0;
        }

        .tech-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tech-list li:last-child {
          border-bottom: none;
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
        }

        .mouse {
          width: 25px;
          height: 40px;
          border: 2px solid #61DAFB;
          border-radius: 20px;
          display: inline-block;
          position: relative;
          margin-bottom: 10px;
        }

        .wheel {
          width: 3px;
          height: 8px;
          background-color: #61DAFB;
          border-radius: 2px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          animation: scroll-wheel 1.5s infinite;
        }

        @keyframes scroll-wheel {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(15px);
          }
        }

        .arrow-down {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .arrow-down span {
          display: block;
          width: 15px;
          height: 15px;
          border-bottom: 2px solid #61DAFB;
          border-right: 2px solid #61DAFB;
          transform: rotate(45deg);
          margin: -5px;
          animation: scroll-arrow 1.5s infinite;
        }

        .arrow-down span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .arrow-down span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes scroll-arrow {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* Typing Effect */
        .typing-cursor {
          animation: blink 1s infinite;
          font-weight: 100;
          opacity: 1;
        }

        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        /* Button Styles */
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
        }

        /* Footer Styles */
        footer a:hover {
          color: #61DAFB !important;
          transition: color 0.3s ease;
        }

        .badge {
          font-family: 'cyber5';
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .section-full {
            padding: 80px 15px 60px 15px;
          }

          .hero-content,
          .section-content {
            padding: 2rem !important;
          }

          h1.display-3 {
            font-size: 2rem !important;
          }

          h2 {
            font-size: 1.8rem !important;
          }

          .scroll-indicator {
            bottom: 15px;
          }
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      </>
    :
    <UserHomePage/>}
    </>
  );
}

export default WelcomePage
