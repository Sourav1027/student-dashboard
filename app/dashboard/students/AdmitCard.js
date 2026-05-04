import Image from "next/image";
import React from "react";

// Map image as inline base64 — html2canvas la external image CORS issue nahi yeil
// tumhi map.png cha actual base64 paste kara khali, kinva "/map.png" URL theva
// joparyant same-origin ahe
import mapImage from "./map.png";

const AdmitCard = ({ student }) => {
  if (!student) return null;

  return (
    <div className="admit-card-container">
      <style>{`
        .admit-card-container {
          width: 210mm;
          min-height: 297mm;
          padding: 12mm;
          margin: auto;
          background-color: #fff;
          color: #333;
          font-family: 'Times New Roman', serif;
          border: 1px solid #ccc;
          box-sizing: border-box;
          position: relative;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          border-bottom: 2px solid #5d3a24;
          padding-bottom: 10px;
        }
        .header-logo {
          height: 50px;
          width: auto;
          object-fit: contain;
        }
        .college-name {
          color: #5d3a24;
          font-weight: 800;
          margin: 0;
          line-height: 1.2;
        }
        .exam-title {
          color: #5d3a24;
          font-size: 1.15rem;
          font-weight: bold;
          margin-top: 5px;
          text-transform: uppercase;
          line-height: 1.2;
        }
        .student-info-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          margin-top: 25px;
          gap: 20px;
        }
        .details-table {
          width: 100%;
          font-size: 1rem;
        }
        .details-table td {
          padding: 7px 0;
          vertical-align: top;
        }
        .label { width: 160px; font-weight: normal; }
        .value { font-weight: bold; text-transform: uppercase; }
        .photo-box {
          width: 140px;
          height: 170px;
          border: 1px solid #000;
          margin-left: auto;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .photo-box img { width: 100%; height: 100%; object-fit: cover; }
        .sign-area {
          margin-top: 15px;
          text-align: center;
          width: 140px;
          margin-left: auto;
        }
        .sign-box {
          height: 55px;
          border: 1px solid #000;
          background: white;
          margin-bottom: 5px;
        }
        .instruction-section {
          margin-top: 25px;
          font-size: 0.88rem;
          line-height: 1.5;
        }
        .instruction-section h4 {
          font-weight: bold;
          text-decoration: underline;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .map-container {
          width: 360px;
          height: 200px;
          border: 2px solid black;
          float: right;
          margin-left: 15px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .map-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .footer-info {
          clear: both;
          text-align: center;
          margin-top: 15px;
          font-size: 0.85rem;
          border-top: 1px solid #5d3a24;
          padding-top: 15px;
        }
        .candidate-sig-wrapper {
          margin-top: 32px;
        }
        .candidate-sig-box {
          width: 192px;
          height: 64px;
          border: 1px solid #000;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .candidate-sig-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .sig-label {
          font-size: 11px;
          font-weight: bold;
          margin-top: 4px;
        }
        @media print {
          .admit-card-container { border: none; margin: 0;  padding: 10mm 10mm; }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="header-section">
        {/* 
          crossOrigin attribute NAHI — same-origin images la necessary nahi
          aani html2canvas la CORS issue create karto external URLs var
        */}
        <img
          src="/logo.jpg"
          alt="Amar Jyoti Logo"
          className="header-logo"
          onError={(e) => { e.target.style.display = "none"; }}
        />

        <div>
          <h1
            style={{
              fontSize: "1.25rem",
              color: "#5d3a24",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            AMAR JYOTI INSTITUTE OF PHYSIOTHERAPY
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              color: "#5d3a24",
              margin: "2px 0 0",
            }}
          >
            (UNIVERSITY OF DELHI)
          </p>
          <div className="exam-title" style={{ letterSpacing: "-0.3px" }}>
            BPT ENTRANCE EXAMINATION 2026
            <br />
            ADMIT CARD
          </div>
        </div>

        {/* DU Logo — plain <img>, NO crossOrigin */}
        <img
          src="/delhiuniversity.png"
          alt="DU Logo"
          style={{ height: "80px", width: "auto", objectFit: "contain" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>

      {/* ── Student Info Grid ── */}
      <div className="student-info-grid">
        {/* Left: details + candidate signature */}
        <div>
          <table className="details-table">
            <tbody>
              <tr>
                <td className="label">Roll No:</td>
                <td className="value">{student.Roll_No || student.rollNo || "1011"}</td>
              </tr>
              <tr>
                <td className="label">Reference No:</td>
                <td className="value">
                  {student.Reference_No || student.refNo || "AJI/BPT/1011"}
                </td>
              </tr>
              <tr>
                <td className="label">Name of Candidate:</td>
                <td className="value" style={{ fontWeight: 900 }}>
                  {student.Name || student.name || "AVANI RAWAT"}
                </td>
              </tr>
              <tr>
                <td className="label">Course:</td>
                <td className="value">{student.Course || student.course || "BPT"}</td>
              </tr>
              <tr>
                <td className="label">Examination Centre:</td>
                <td
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    lineHeight: 1.4,
                  }}
                >
                  Amar Jyoti Institute of Physiotherapy,
                  <br />
                  Karkardooma, Vikas Marg, Delhi - 110092
                </td>
              </tr>
              <tr>
                <td className="label">Date of Exam:</td>
                <td className="value" style={{ color: "#111827" }}>
                  30th August 2026, Saturday
                </td>
              </tr>
              <tr>
                <td className="label">Exam Time:</td>
                <td className="value">10:00 A.M. - 12:00 Noon</td>
              </tr>
            </tbody>
          </table>

          {/* Candidate Signature */}
          <div className="candidate-sig-wrapper">
            <div className="candidate-sig-box">
              {student.Signature || student.signature ? (
                <img
                  src={student.Signature || student.signature}
                  alt="Candidate Signature"
                />
              ) : (
                <span
                  style={{
                    fontSize: 10,
                    color: "#9CA3AF",
                    fontStyle: "italic",
                  }}
                >
                  Signature of Candidate
                </span>
              )}
            </div>
            <p className="sig-label">Signature of Candidate</p>
          </div>
        </div>

        {/* Right: photo + authorised signatory */}
        <div>
          <div className="photo-box" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
            {student.Photo || student.photo ? (
              <img
                src={student.Photo || student.photo}
                alt="Candidate Photo"
              />
            ) : (
              <span
                style={{
                  color: "#D1D5DB",
                  fontSize: 10,
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: 8,
                }}
              >
                Photo
                <br />
                Available
                <br />
                after Upload
              </span>
            )}
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: "bold",
              marginTop: 4,
              textTransform: "uppercase",
              letterSpacing: "-0.2px",
            }}
          >
            Photo of Candidate
          </p>

          <div className="sign-area" style={{ marginTop: 24 }}>
            <div className="sign-box" />
            <p
              style={{
                fontSize: 11,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Authorised Signatory
            </p>
          </div>
        </div>
      </div>

      {/* ── Instructions ── */}
      <div className="instruction-section">
        <h4>Instructions to the Candidate:</h4>

        {/* Map — plain <img>, NO next/image, NO crossOrigin */}
        <div className="map-container">
          <Image

          
            src={mapImage}
            alt="Exam Centre Map"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<p style="font-size:11px;color:#9CA3AF;text-align:center;padding:8px;">Map<br/>not available</p>';
            }}
          />
        </div>

        <ol style={{ paddingLeft: 0 }}>
          <li>
            Reporting time for the Candidates at Examination Centre is at 9:30
            A.M.
          </li>
          <li>Entry to the Examination Centre will close at 9:50 A.M.</li>
          <li>
            No candidate will be allowed to enter before 9:30 A.M. or leave the
            Examination Hall before 12:00 Noon.
          </li>
          <li>
            Candidate is strictly advised to carry Adhar card as a Valid ID
            proof along with the Admit Card (COLOURED PRINT) on A4 Sheet.
          </li>
          <li>
            Mobile phone/smart watch/Bluetooth device/tablet/books/scanner/
            notes/calculator etc. are strictly Not Allowed inside the
            Examination Hall. In case, any Candidate is found to possess the
            same his/her Examination will be deemed as cancelled.
          </li>
          <li>
            The Candidate is advised to carry a blue ballpoint pen and pencil
            to the Examination Hall. No correction pen/whitener is allowed.
          </li>
          <li>
            Candidate is advised to kindly check the seating plan displayed at
            the entrance gate of the Examination Centre.
          </li>
          <li>
            No parents/guardians will be allowed to enter the examination
            venue. No accommodation will be provided.
          </li>
        </ol>
      </div>

      {/* ── Footer ── */}
      <div className="footer-info">
        <p style={{ fontWeight: "bold", fontSize: 12 }}>
          Under aegis of AMAR JYOTI CHARITABLE TRUST
        </p>
        <p style={{ fontSize: 11 }}>Karkardooma, Vikas Marg, Delhi, 110092</p>
        <p style={{ fontSize: 11 }}>011-22379827 | Email: info@ajipt.org</p>
      </div>
    </div>
  );
};

export default AdmitCard;