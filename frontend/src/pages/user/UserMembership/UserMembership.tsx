import { useEffect, useState } from "react";
import API from "../../../api/axios";
import { useNavigate } from "react-router";
import "./userMembership.css";

const UserMembership = () => {
  const navigate = useNavigate();

  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/membership/me");
      setMembership(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    navigate(`/membership/pay/${membership.id}`);
  };

  const isUnpaid =
    membership?.status === "PENDING" || membership?.status === "EXPIRED";

  if (loading) return <p>Loading...</p>;
  if (!membership) return <p>No membership found</p>;

  return (
    <div className="membership-container">
      <h2>My Membership</h2>

      <div className="card">
        <h3>{membership.plan?.name}</h3>
        <p>{membership.plan?.description}</p>

        <div className="info">
          <p>
            <strong>Price:</strong> ${membership.price.toFixed(2)}
          </p>
          <p>
            <strong>Duration:</strong> {membership.plan?.durationInDays} days
          </p>

          <p>
            <strong>Status:</strong>
            <span className={`badge ${membership.status.toLowerCase()}`}>
              {membership.status}
            </span>
          </p>

          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(membership.startDate).toLocaleDateString()}
          </p>

          <p>
            <strong>End Date:</strong>{" "}
            {membership.endDate
              ? new Date(membership.endDate).toLocaleDateString()
              : "Not started"}
          </p>
        </div>

        {/* 🏋️ Programs */}
        {membership.membershipPrograms?.length > 0 && (
          <div className="programs">
            <h4>Programs Included</h4>
            {membership.membershipPrograms.map((item: any) => (
              <div key={item.id} className="program-item">
                <span>{item.program.name}</span>
                <span>${item.program.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* 💳 Payment Section */}
        {isUnpaid && (
          <button className="pay-btn" onClick={handlePayment}>
            Pay Now
          </button>
        )}

        {/* ✅ If paid */}
        {membership.payments?.length > 0 && (
          <p className="paid-text">✅ Payment completed</p>
        )}
      </div>
    </div>
  );
};

export default UserMembership;
