import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { useToast } from "../components/ToastProvider";

const StatusBadge = ({ status }) => {
  const styles = {
    Applied: "bg-gray-100 text-gray-700",
    "Under review": "bg-yellow-100 text-yellow-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

const MyApplications = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const { addToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/job/my-applications",
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setApplications(res.data.applications || []);
      } else {
        addToast({ type: "error", message: res.data.message });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: "Failed to load applications" });
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (!token) {
    setLoading(false);
    return;
  }

  loadApplications();
}, [token]);


if (!token && !loading) {
  return (
  <div className="border-t pt-16 max-w-4xl mx-auto px-4">
      <div className="text-2xl mb-6">
        <Title text1={"MY"} text2={"APPLICATIONS"} />
      </div>
    <div className="border-t pt-16 text-center text-sm text-gray-500 mb-20">
      Please login to view your applications.
    </div>
    </div>
  );
}


  return (

    
    <div className="border-t pt-16 max-w-4xl mx-auto px-4">
      <div className="text-2xl mb-6">
        <Title text1={"MY"} text2={"APPLICATIONS"} />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading applications…</p>
      ) : applications.length === 0 ? (
        <div className="py-10 text-center text-gray-500 text-sm">
          You haven’t applied for any jobs yet.
        </div>
      ) : (
        applications.map(app => (
          <div
            key={app._id}
            className="py-5 border-t border-b flex flex-col sm:flex-row sm:justify-between gap-4"
          >
            <div>
              <p className="font-medium">{app.job?.title}</p>
              <p className="text-sm text-gray-500">{app.job?.company}</p>
              <p className="text-xs text-gray-400 mt-1">
                Applied on {new Date(app.date).toDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <StatusBadge status={app.status} />

              {app.resumeUrl && (
                <a
                  href={`${backendUrl}/${app.resumeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline"
                >
                  View Resume
                </a>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;
