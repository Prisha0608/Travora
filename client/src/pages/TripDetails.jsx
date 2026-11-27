
// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// import api from "../services/api";
// import Navbar from "../components/Navbar";
// import DestinationsTab from "../components/DestinationsTab";
// import ItineraryTab from "../components/ItineraryTab";
// import BudgetTab from "../components/BudgetTab";
// import Spinner from "../components/Spinner";
// import { getDestinationImage } from "../utils/destinationImages";
// import {
//   formatDate,
//   getTripDays,
//   formatCurrency,
// } from "../utils/helpers";
// const coverImage = getDestinationImage(
//   trip.destination || trip.title
// );
// import "./TripDetails.css";

// const TABS = ["Overview", "Destinations", "Itinerary", "Budget"];

// const TripDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [trip, setTrip] = useState(null);
//   const [activeTab, setActiveTab] = useState("Overview");

//   useEffect(() => {
//     api
//       .get(`/trips/${id}`)
//       .then((res) => setTrip(res.data))
//       .catch(() => {
//         toast.error("Trip not found");
//         navigate("/dashboard");
//       });
//   }, [id, navigate]);

//   if (!trip) {
//     return <Spinner text="Loading trip..." />;
//   }

//   const days = getTripDays(trip.startDate, trip.endDate);

//   const totalSpent = (trip.expenses || []).reduce(
//     (sum, expense) => sum + Number(expense.amount || 0),
//     0
//   );

//   // Use exactly the same image as the Trip Card
//   const coverImage = getDestinationImage(
//     trip.destination || trip.title
//   );

//   return (
//     <>
//       <Navbar />

//       <main className="page">
//         <div
//           className="trip-details-page"
//           style={{
//             backgroundImage: `
//               linear-gradient(
//                 rgba(10, 35, 31, 0.55),
//                 rgba(10, 35, 31, 0.68)
//               ),
//               url("${coverImage}")
//             `,
//           }}
//         >
//           {/* Back Navigation */}
//           <Link to="/dashboard" className="back-link">
//             ← Back to dashboard
//           </Link>

//           {/* Trip Hero */}
//           <div className="details-hero">
//             <h1>{trip.title}</h1>

//             <p>
//               📅 {formatDate(trip.startDate)} –{" "}
//               {formatDate(trip.endDate)} · {days}{" "}
//               {days === 1 ? "day" : "days"}
//             </p>

//             <Link
//               to={`/trips/${trip._id}/edit`}
//               className="btn btn-light"
//             >
//               Edit trip
//             </Link>
//           </div>

//           {/* Tabs */}
//           <div className="tabs">
//             {TABS.map((tab) => (
//               <button
//                 key={tab}
//                 type="button"
//                 className={`tab ${
//                   activeTab === tab ? "tab-active" : ""
//                 }`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Overview */}
//           {activeTab === "Overview" && (
//             <>
//               <div className="details-grid">
//                 <div className="details-box">
//                   <span className="muted">Total budget</span>
//                   <strong>
//                     {formatCurrency(trip.totalBudget)}
//                   </strong>
//                 </div>

//                 <div className="details-box">
//                   <span className="muted">Destinations</span>
//                   <strong>
//                     {(trip.destinations || []).length}
//                   </strong>
//                 </div>

//                 <div className="details-box">
//                   <span className="muted">Total spent</span>
//                   <strong>
//                     {formatCurrency(totalSpent)}
//                   </strong>
//                 </div>
//               </div>

//               {trip.description && (
//                 <div className="details-desc">
//                   <h3>About this trip</h3>
//                   <p>{trip.description}</p>
//                 </div>
//               )}
//             </>
//           )}

//           {/* Destinations */}
//           {activeTab === "Destinations" && (
//             <DestinationsTab
//               trip={trip}
//               onTripUpdate={setTrip}
//             />
//           )}

//           {/* Itinerary */}
//           {activeTab === "Itinerary" && (
//             <ItineraryTab
//               trip={trip}
//               onTripUpdate={setTrip}
//             />
//           )}

//           {/* Budget */}
//           {activeTab === "Budget" && (
//             <BudgetTab
//               trip={trip}
//               onTripUpdate={setTrip}
//             />
//           )}
//         </div>
//       </main>
//     </>
//   );
// };

// export default TripDetails;

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import Navbar from "../components/Navbar";
import DestinationsTab from "../components/DestinationsTab";
import ItineraryTab from "../components/ItineraryTab";
import BudgetTab from "../components/BudgetTab";
import Spinner from "../components/Spinner";
import { getDestinationImage } from "../utils/destinationImages";
import {
  formatDate,
  getTripDays,
  formatCurrency,
} from "../utils/helpers";

import "./TripDetails.css";

const TABS = ["Overview", "Destinations", "Itinerary", "Budget"];

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    api
      .get(`/trips/${id}`)
      .then((res) => setTrip(res.data))
      .catch(() => {
        toast.error("Trip not found");
        navigate("/dashboard");
      });
  }, [id, navigate]);

  if (!trip) {
    return <Spinner text="Loading trip..." />;
  }

  const days = getTripDays(trip.startDate, trip.endDate);

  const totalSpent = (trip.expenses || []).reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  // Destination-specific background image
  const coverImage = getDestinationImage(
    trip.destination || trip.title
  );

  return (
    <>
      <Navbar />

      <main className="page">
        <div
          className="trip-details-page"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(10, 35, 31, 0.55),
                rgba(10, 35, 31, 0.68)
              ),
              url("${coverImage}")
            `,
          }}
        >
          <Link to="/dashboard" className="back-link">
            ← Back to dashboard
          </Link>

          <div className="details-hero">
            <h1>{trip.title}</h1>

            <p>
              📅 {formatDate(trip.startDate)} –{" "}
              {formatDate(trip.endDate)} · {days}{" "}
              {days === 1 ? "day" : "days"}
            </p>

            <Link
              to={`/trips/${trip._id}/edit`}
              className="btn btn-light"
            >
              Edit trip
            </Link>
          </div>

          <div className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab ${
                  activeTab === tab ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <>
              <div className="details-grid">
                <div className="details-box">
                  <span className="muted">Total budget</span>
                  <strong>
                    {formatCurrency(trip.totalBudget)}
                  </strong>
                </div>

                <div className="details-box">
                  <span className="muted">Destinations</span>
                  <strong>
                    {(trip.destinations || []).length}
                  </strong>
                </div>

                <div className="details-box">
                  <span className="muted">Total spent</span>
                  <strong>
                    {formatCurrency(totalSpent)}
                  </strong>
                </div>
              </div>

              {trip.description && (
                <div className="details-desc">
                  <h3>About this trip</h3>
                  <p>{trip.description}</p>
                </div>
              )}
            </>
          )}

          {activeTab === "Destinations" && (
            <DestinationsTab
              trip={trip}
              onTripUpdate={setTrip}
            />
          )}

          {activeTab === "Itinerary" && (
            <ItineraryTab
              trip={trip}
              onTripUpdate={setTrip}
            />
          )}

          {activeTab === "Budget" && (
            <BudgetTab
              trip={trip}
              onTripUpdate={setTrip}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default TripDetails;
