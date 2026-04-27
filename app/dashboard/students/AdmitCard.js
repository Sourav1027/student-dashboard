
import React from 'react';
import mapImage from "./map.png";
import Image from 'next/image';


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

          background-color: #fff; /* Peach Color as per image */

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



        /* Image sizing fix for dynamic URLs */

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

        }



        .footer-info {

          clear: both;

          text-align: center;

          margin-top: 50px;

          font-size: 0.85rem;

          border-top: 1px solid #5d3a24;

          padding-top: 15px;

        }



        @media print {

          .admit-card-container { border: none; margin: 0; }

        }

      `}</style>



      {/* Header Section with Direct Logo Links */}

      <div className="header-section">

        {/* Amar Jyoti Logo from ajipt.org */}

        <img 

          src="/logo.jpg"

          alt="Amar Jyoti Logo" 

          className="header-logo"

          onError={(e) => { e.target.style.display='none'; }}

        />

        

        <div>

          <h1 className="text-xl college-name tracking-tight">AMAR JYOTI INSTITUTE OF PHYSIOTHERAPY</h1>

          <p className="text-sm font-bold college-name">(UNIVERSITY OF DELHI)</p>

          <div className="exam-title tracking-tight">BPT ENTRANCE EXAMINATION 2026<br/>ADMIT CARD</div>

        </div>



        {/* DU Logo from Wikimedia */}

        <img 

          src="https://upload.wikimedia.org/wikipedia/en/b/b6/Delhi_University.svg" 

          alt="DU Logo" 

          className="header-logo"

          style={{ height: '80px' }} /* SVG scaling fix */

          onError={(e) => { e.target.style.display='none'; }}

        />

      </div>



      {/* Main Content */}

      <div className="student-info-grid">

        <div>

          <table className="details-table">

            <tbody>

              <tr>

                <td className="label">Roll No:</td>

                <td className="value">{student.Roll_No || student.rollNo || '1011'}</td>

              </tr>

              <tr>

                <td className="label">Reference No:</td>

                <td className="value">{student.Reference_No || student.refNo || 'AJI/BPT/1011'}</td>

              </tr>

              <tr>

                <td className="label">Name of Candidate:</td>

                <td className="value font-extrabold">{student.Name || student.name || 'AVANI RAWAT'}</td>

              </tr>

              <tr>

                <td className="label">Course:</td>

                <td className="value">{student.Course || student.course || 'BPT'}</td>

              </tr>

              <tr>

                <td className="label">Examination Centre:</td>

                <td className="text-sm font-bold leading-tight">

                  Amar Jyoti Institute of Physiotherapy,<br/>

                  Karkardooma, Vikas Marg, Delhi - 110092

                </td>

              </tr>

              <tr>

                <td className="label">Date of Exam:</td>

                <td className="value font-bold text-gray-900">30th August 2026, Saturday</td>

              </tr>

              <tr>

                <td className="label">Exam Time:</td>

                <td className="value">10:00 A.M. - 12:00 Noon</td>

              </tr>

            </tbody>

          </table>

          

          <div className="mt-8">

            <div className="w-48 h-16 border border-black bg-white flex items-center justify-center overflow-hidden">

               {student.Signature || student.signature ? (

                 <img src={student.Signature || student.signature} className="w-full h-full object-contain" alt="Sign" />

               ) : (

                 <span className="text-[10px] text-gray-400 italic">Signature of Candidate</span>

               )}

            </div>

            <p className="text-[11px] font-bold mt-1">Signature of Candidate</p>

          </div>

        </div>



        <div>

          <div className="photo-box shadow-md">

             {student.Photo || student.photo ? (

               <img src={student.Photo || student.photo} alt="Candidate" />

             ) : (

               <span className="text-gray-300 text-[10px] uppercase font-bold text-center p-2">Photo<br/>Available<br/>after Upload</span>

             )}

          </div>

          <p className="text-center text-[11px] font-bold mt-1 uppercase tracking-tight">Photo of Candidate</p>

          

          <div className="sign-area mt-6">

            <div className="sign-box"></div>

            <p className="text-[11px] font-bold uppercase">Authorised Signatory</p>

          </div>

        </div>

      </div>



      <div className="instruction-section">

        <h4 className="uppercase">Instructions to the Candidate:</h4>

<div className="map-container">
  <Image
    src={mapImage} 
    alt="Exam Centre Map" 
  />
</div>

        <ol className="list-decimal pl-5 space-y-1">

          <li>Reporting time for the Candidates at Examination Centre is at 9:30 A.M.</li>

          <li>Entry to the Examination Centre will close at 9:50 A.M.</li>
          <li>No candidate will be allowed to enter before 9:30 A.M. or leave the Examination Hall before 12:00 Noon.</li>

          <li>Candidate is strictly advised to carry Adhar card as a Valid ID proof along with the Admit Card (COLOURED PRINT) on A4 Sheet.</li>

          <li>Mobile phone/smart watch/Bluetooth device/ tablet/ books/scanner/ notes/ calculator etc. are strictly Not Allowed inside the Examination Hall. In case, any Candidate is found to possess the same his/ her Examination will be deemed as cancelled.</li>

          <li>The Candidate is advised to carry a blue ballpoint pen and pencil to the Examination Hall. No correction pen / whitener is allowed.</li>
          <li>Candidate is advised to kindly check the seating plan displayed at the entrance gate of the Examination Centre.</li>
          <li>No parents/ guardians will be allowed to enter the examination venue. No accommodation will be provided.</li>

        </ol>

      </div>



      <div className="footer-info">

        <p className="font-bold text-[12px]">Under aegis of AMAR JYOTI CHARITABLE TRUST</p>

        <p className="text-[11px]">Karkardooma, Vikas Marg, Delhi, 110092</p>

        <p className="text-[11px]">011-22379827 | Email: info@ajipt.org</p>

      </div>

    </div>

  );

};



export default AdmitCard;