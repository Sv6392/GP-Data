import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* Hero Section */}
      <div className="hero">
        <h1>BharatNet MP GP Dashboard</h1>
        <p>
          Empowering rural India with high-speed broadband connectivity.
          Monitor, manage and analyze GP-level network infrastructure efficiently.
        </p>
      </div>

      {/* About Section */}
      <div className="about">
        <h2>About BharatNet</h2>
        <b>
        <p>
            BharatNet is one of the largest rural telecommunications projects in the world,
            launched by the Government of India to bridge the digital divide between urban
            and rural areas. The mission is to provide high-speed broadband connectivity
            to all Gram Panchayats (GPs) through optical fiber infrastructure.

            <br /><br />

            This initiative plays a crucial role in enabling e-Governance, digital services,
            online education, telemedicine, and financial inclusion in rural India. By
            strengthening digital infrastructure, BharatNet empowers villages to become
            digitally self-reliant and connected to the global economy.

            <br /><br />

            The GP Dashboard is designed to monitor, manage, and analyze network performance,
            connectivity status, and infrastructure details at the Gram Panchayat level. It
            provides real-time insights, efficient data handling, and seamless reporting for
            better decision-making and operations.
        </p>
        </b>
        </div>
      {/* Features */}
      <div className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">📊 Real-time Data Management</div>
          <div className="feature-card">📁 Excel Upload & Download</div>
          <div className="feature-card">🔍 Smart Search System</div>
          <div className="feature-card">⚡ Fast Data Management</div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p><b>© 2026 BharatNet GP Dashboard | Developed by Suraj Verma</b></p>

        <div className="socials">
          <a >🌐Contact Number:- +91 6392863417</a>
          <a href="https://www.linkedin.com/in/suraj-verma1410/">💼 LinkedIn</a>
          <a href="https://github.com/Sv6392">🐙 GitHub</a>
        </div>
      </div>

    </div>
  );
}

export default Home;