'use client';
import Layout from "@/components/Layout";
import { version } from "os";
import { useEffect, useState } from "react";

const ApiInventory = () => {
  const [apiList, setApiList] = useState([]);
  const [newApi, setNewApi] = useState({ name: "", endpoint: "", owner: "", status: "Active", lastScanned: "", version: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDirection, setSortDirection] = useState("ascending");


  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch API data from the server
    const fetchApiData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/api/all",
        { method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          }});
        const data = await response.json();
        console.log(data);
        setApiList(data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchApiData();

  }, []);


  const filteredApiList = apiList.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortArray = (array, key, direction) => {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSortChange = (event) => {
    const selectedSortKey = event.target.value;
    const newDirection = (sortKey === selectedSortKey && sortDirection === "ascending") ? "descending" : "ascending";
    setSortKey(selectedSortKey);
    setSortDirection(newDirection);
  };

  const sortedApiList = sortArray(filteredApiList, sortKey, sortDirection);


  const handleDeleteApi = (id) => {
    setApiList(apiList.filter(api => api.id !== id));
  };

  const handleAddApi = async () => {
    const newApiEntry = {
      ...newApi,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/api/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newApiEntry),
      });
    } catch (error) {
      console.error("Error adding API:", error);
    }
  };
  

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">API Inventory Management</h2>

        {/* Search Bar and Sort Dropdown */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search APIs..."
            className="p-2 border border-gray-300 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={sortKey}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="endpoint">Sort by Endpoint</option>
            <option value="owner">Sort by Owner</option>
            <option value="status">Sort by Status</option>
            <option value="lastScanned">Sort by Last Scanned</option>
          </select>
        </div>

        {/* API List Table */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="p-3 border-b border-gray-300">API Name</th>
                <th className="p-3 border-b border-gray-300">Endpoint</th>
                <th className="p-3 border-b border-gray-300">Owner</th>
                <th className="p-3 border-b border-gray-300">Status</th>
                <th className="p-3 border-b border-gray-300">Last Scanned</th>
                <th className="p-3 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedApiList.map(api => (
                <tr key={api.id} className="bg-gray-50">
                  <td className="p-3 border-b border-gray-300">{api.name}</td>
                  <td className="p-3 border-b border-gray-300">{api.endpoint}</td>
                  <td className="p-3 border-b border-gray-300">{api.owner}</td>
                  <td className="p-3 border-b border-gray-300">{api.status}</td>
                  <td className="p-3 border-b border-gray-300">{api.lastScanned}</td>
                  <td className="p-3 border-b border-gray-300">
                    <button className="text-blue-600 hover:underline" onClick={() => console.log("Scan", api.id)}>Scan</button>
                    <button className="text-yellow-600 hover:underline ml-2" onClick={() => console.log("Edit", api.id)}>Edit</button>
                    <button className="text-red-600 hover:underline ml-2" onClick={() => handleDeleteApi(api.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New API Form */}
        <h3 className="text-xl font-bold text-blue-900 mb-4">Add New API</h3>
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <form onSubmit={(e) => { e.preventDefault(); handleAddApi(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="API Name"
                className="p-2 border border-gray-300 rounded"
                value={newApi.name}
                onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="API Endpoint"
                className="p-2 border border-gray-300 rounded"
                value={newApi.endpoint}
                onChange={(e) => setNewApi({ ...newApi, endpoint: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description"
                className="p-2 border border-gray-300 rounded"
                value={newApi.description}
                onChange={(e) => setNewApi({ ...newApi, description: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Owner"
                className="p-2 border border-gray-300 rounded"
                value={newApi.owner}
                onChange={(e) => setNewApi({ ...newApi, owner: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Version"
                className="p-2 border border-gray-300 rounded"
                value={newApi.version}
                onChange={(e) => setNewApi({ ...newApi, version: e.target.value })}
                required
              />
              <select
                value={newApi.status}
                onChange={(e) => setNewApi({ ...newApi, status: e.target.value })}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add API</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ApiInventory;
