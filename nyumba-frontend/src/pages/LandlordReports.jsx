import {
  useEffect,
  useState,
} from "react";

import Navbar
  from "../components/layout/Navbar";

import {
  getReport,
} from "../services/api";

import "../styles/dashboard.css";

function LandlordReports() {

  const [report, setReport] =
    useState(null);

  useEffect(() => {

    fetchReport();

  }, []);

  const fetchReport =
    async () => {

      try {

        const data =
          await getReport();

        console.log(data);

        setReport(data);

      } catch (error) {

        console.error(error);
      }
    };

  return (

    <div>

      <Navbar />

      <section className="dashboard">

        <h1>
          Property Report
        </h1>

        <div className="analytics-grid">

          <div className="analytics-card">
            <h2>
              {report?.total_properties || 0}
            </h2>

            <p>Total Properties</p>
          </div>

          <div className="analytics-card">
            <h2>
              {report?.available_properties || 0}
            </h2>

            <p>Available</p>
          </div>

          <div className="analytics-card">
            <h2>
              {report?.booked_properties || 0}
            </h2>

            <p>Occupied</p>
          </div>

          <div className="analytics-card">
            <h2>
              {report?.occupancy_rate || 0}%
            </h2>

            <p>Occupancy Rate</p>
          </div>

          <div className="analytics-card">
            <h2>
              KES
              {" "}
              {report?.monthly_income || 0}
            </h2>

            <p>Monthly Income</p>
          </div>

          <div className="analytics-card">
                <h2>
                KES
                {" "}
                {report?.total_income || 0}
                </h2>

                <p>Total Income</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default LandlordReports;