'use client';
import { useState } from "react";
import Modal from "react-modal";
import Layout from "@/components/Layout";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { username: "jdoe", fullName: "John Doe", email: "jdoe@example.com", role: "Security Analyst", lastLogin: "2024-08-14", status: "Active" },
    { username: "asmith", fullName: "Alice Smith", email: "asmith@example.com", role: "Developer", lastLogin: "2024-08-12", status: "Active" },
    { username: "admin", fullName: "Admin User", email: "admin@example.com", role: "Admin", lastLogin: "2024-08-10", status: "Active" },
    { username: "bwhite", fullName: "Bob White", email: "bwhite@example.com", role: "Security Analyst", lastLogin: "2024-08-09", status: "Inactive" },
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [newUser, setNewUser] = useState({ username: "", fullName: "", email: "", password: "", role: "", status: "" });
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const roles = ["Admin", "Security Analyst", "Developer"];
  const statuses = ["Active", "Inactive"];

  const activityLogs = [
    { timestamp: "2024-08-14 10:00 AM", username: "jdoe", action: "Logged In", ipAddress: "192.168.1.10" },
    { timestamp: "2024-08-13 04:45 PM", username: "asmith", action: "Created API", ipAddress: "192.168.1.11" },
    { timestamp: "2024-08-12 02:30 PM", username: "admin", action: "Resolved Issue", ipAddress: "192.168.1.12" },
    { timestamp: "2024-08-10 01:00 PM", username: "bwhite", action: "Logged Out", ipAddress: "192.168.1.13" },
  ];

  const [filteredLogs, setFilteredLogs] = useState(activityLogs);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterUsers(term, roleFilter, statusFilter);
    filterLogs(term);
  };

  const handleRoleFilter = (e) => {
    const role = e.target.value;
    setRoleFilter(role);
    filterUsers(searchTerm, role, statusFilter);
  };

  const handleStatusFilter = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterUsers(searchTerm, roleFilter, status);
  };

  const filterUsers = (search, role, status) => {
    let result = users;
    if (search) {
      result = result.filter(user => user.username.includes(search) || user.email.includes(search));
    }
    if (role) {
      result = result.filter(user => user.role === role);
    }
    if (status) {
      result = result.filter(user => user.status === status);
    }
    setFilteredUsers(result);
  };

  const filterLogs = (search) => {
    let result = activityLogs;
    if (search) {
      result = result.filter(log => log.username.includes(search));
    }
    setFilteredLogs(result);
  };

  const handleAddUser = () => {
    setUsers([...users, { ...newUser, lastLogin: "N/A" }]);
    setNewUser({ username: "", fullName: "", email: "", password: "", role: "", status: "" });
    setIsAddModalOpen(false);
  };

  const handleEditUser = () => {
    setUsers(users.map(user => user.username === editUser.username ? editUser : user));
    setEditUser(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.username !== deleteUser.username));
    setDeleteUser(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">User Management</h2>

        {/* Search and Filter Section */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search by Username or Email"
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded p-2 w-full"
          />
          <select onChange={handleRoleFilter} value={roleFilter} className="border rounded p-2 ml-2">
            <option value="">All Roles</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <select onChange={handleStatusFilter} value={statusFilter} className="border rounded p-2 ml-2">
            <option value="">All Statuses</option>
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 text-white rounded px-4 ml-2">Add User</button>
        </div>

        {/* User List Table */}
        <table className="min-w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Username</th>
              <th className="border border-gray-300 p-2">Full Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Last Login</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.username} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.fullName}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">{user.lastLogin}</td>
                <td className="border border-gray-300 p-2">{user.status}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => openEditModal(user)} className="text-blue-600">Edit</button>
                  <button onClick={() => { setDeleteUser(user); setIsDeleteModalOpen(true); }} className="text-red-600 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add User Modal */}
        <Modal isOpen={isAddModalOpen} onRequestClose={() => setIsAddModalOpen(false)} ariaHideApp={false}>
          <h2 className="text-2xl font-bold mb-4">Add New User</h2>
          <form>
            <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <select onChange={e => setNewUser({ ...newUser, role: e.target.value })} value={newUser.role} className="border rounded p-2 w-full mb-2" required>
              <option value="">Select Role</option>
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <select onChange={e => setNewUser({ ...newUser, status: e.target.value })} value={newUser.status} className="border rounded p-2 w-full mb-4" required>
              <option value="">Select Status</option>
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <button type="button" onClick={handleAddUser} className="bg-blue-500 text-white rounded px-4">Save</button>
          </form>
        </Modal>

        {/* Edit User Modal */}
        <Modal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} ariaHideApp={false}>
          <h2 className="text-2xl font-bold mb-4">Edit User</h2>
          <form>
            <input type="text" placeholder="Username" value={editUser?.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <input type="text" placeholder="Full Name" value={editUser?.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <input type="email" placeholder="Email" value={editUser?.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <select onChange={e => setEditUser({ ...editUser, role: e.target.value })} value={editUser?.role} className="border rounded p-2 w-full mb-2" required>
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <select onChange={e => setEditUser({ ...editUser, status: e.target.value })} value={editUser?.status} className="border rounded p-2 w-full mb-4" required>
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
            <button type="button" onClick={handleEditUser} className="bg-blue-500 text-white rounded px-4">Update</button>
          </form>
        </Modal>

        {/* Delete User Modal */}
        <Modal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} ariaHideApp={false}>
          <h2 className="text-lg">Are you sure you want to delete this user?</h2>
          <p className="mb-4">{deleteUser?.username}</p>
          <button onClick={handleDeleteUser} className="bg-red-500 text-white rounded px-4 mr-2">Delete</button>
          <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-300 rounded px-4">Cancel</button>
        </Modal>

        {/* User Activity Logs Section */}
        <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">User Activity Logs</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Timestamp</th>
              <th className="border border-gray-300 p-2">Username</th>
              <th className="border border-gray-300 p-2">Action</th>
              <th className="border border-gray-300 p-2">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.timestamp} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{log.timestamp}</td>
                <td className="border border-gray-300 p-2">{log.username}</td>
                <td className="border border-gray-300 p-2">{log.action}</td>
                <td className="border border-gray-300 p-2">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UserManagement;
