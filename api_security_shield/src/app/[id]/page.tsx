'use client';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";

const ApiDetails = () => {
  // Dummy data for API details
  const params = useParams<{ tag: string; item: string }>()

  const id = params.id;
  const [apiDetails, setApiDetails] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  // Dummy data for audit logs
  const auditLogs = [
    {
      id: 1,
      change: "Updated description and endpoints",
      user: "Admin",
      date: "2024-08-01",
    },
    {
      id: 2,
      change: "Added new endpoint",
      user: "Developer A",
      date: "2024-07-25",
    },
    {
      id: 3,
      change: "Changed security status to Secure",
      user: "Security Team",
      date: "2024-07-20",
    },
  ];


  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch API data from the server
    const fetchApiData = async () => {
      try {
        if (id) {
        const response = await fetch(`http://localhost:5000/api/api/${id}`,
        { method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          }});
        const data = await response.json();
        setApiDetails(data);
        const vuln = [data.vulnerabilities];
        if(data.vulnerabilities){
          setVulnerabilities(data.vulnerabilities);
        }
      };
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchApiData();

  }, []);


  return (
    <Layout>
      <div className="container mx-auto p-6">
        {/* API Details Section */}
        <h2 className="text-2xl font-bold text-blue-900 mb-4">API Details</h2>
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h3 className="text-gray-700 mb-2"><strong>API Name:</strong> {apiDetails.name}</h3>
          <p className="text-gray-700 mb-2"><strong>Description:</strong> {apiDetails.description}</p>
          <p className="text-gray-700 mb-2"><strong>Owner:</strong> {apiDetails.owner}</p>
          <p className="text-gray-700 mb-2"><strong>Version:</strong> {apiDetails.version}</p>
          <p className="text-gray-700 mb-2"><strong>Creation Date:</strong> {apiDetails.creationDate}</p>
          <p className="text-gray-700 mb-2"><strong>Last Updated:</strong> {apiDetails.lastUpdated}</p>
          <p className="text-gray-700 mb-2"><strong>Current Security Status:</strong> {apiDetails.securityStatus}</p>
          <p className="text-gray-700 mb-2"><strong>Documentation URL:</strong> <a href={apiDetails.documentationUrl} className="text-blue-500 hover:underline">{apiDetails.documentationUrl}</a></p>
          <p className="text-gray-700 mb-2"><strong>Endpoints:</strong></p>
        </div>

        {/* Vulnerability List Section */}
        <h3 className="text-xl font-bold text-blue-900 mb-4">Vulnerabilities</h3>
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="p-3 border-b border-gray-300">Description</th>
                <th className="p-3 border-b border-gray-300">Severity</th>
                <th className="p-3 border-b border-gray-300">Remediation</th>
                <th className="p-3 border-b border-gray-300">Status</th>
                <th className="p-3 border-b border-gray-300">Discovered Date</th>
              </tr>
            </thead>
            <tbody>
              {vulnerabilities.length > 0 ? (
                vulnerabilities.map((vuln, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-3 border-b border-gray-300">{vuln.description}</td>
                    <td className="p-3 border-b border-gray-300">{vuln.severity}</td>
                    <td className="p-3 border-b border-gray-300">{vuln.remediation}</td>
                    <td className="p-3 border-b border-gray-300">{vuln.status}</td>
                    <td className="p-3 border-b border-gray-300">{vuln.discoveredDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-3">No vulnerabilities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Logs Section */}
        <h3 className="text-xl font-bold text-blue-900 mb-4">Audit Logs</h3>
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="p-3 border-b border-gray-300">Change Description</th>
                <th className="p-3 border-b border-gray-300">User</th>
                <th className="p-3 border-b border-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} className={log.id % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3 border-b border-gray-300">{log.change}</td>
                  <td className="p-3 border-b border-gray-300">{log.user}</td>
                  <td className="p-3 border-b border-gray-300">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ApiDetails;
