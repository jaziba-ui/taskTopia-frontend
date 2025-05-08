import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from '@/utils/withAuth';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      console.log("Stored Token: ", storedToken);
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Fetched Users:", res.data);
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh after update
    } catch (err) {
      alert('Error updating role');
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard'); // Change this path as per your actual dashboard route
  };

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <button 
        onClick={goToDashboard} 
        className="mt-4 px-4 py-2 bg-[#D0B8A8] text-white rounded-full hover:bg-[#C3B091]"      >
        Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">All Users & Roles</h2>
      <ul className="space-y-4">
        {users.map(user => (
          <li key={user._id} className="border-b pb-4">
            <div><strong>{user.name}</strong> ({user.email})</div>
            <div className="text-sm text-gray-600 mb-2">Role: {user.role}</div>
            {/* <label className="block text-sm font-medium mb-1">Role:</label>
            <select
              value={user.role}
              onChange={(e) => updateRole(user._id, e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withAuth(AdminUsers, ["admin"]);
