import React, { useEffect, useState } from "react";
import axios from "axios";

const LaptopList = () => {
  const [laptops, setLaptops] = useState([]);
  const [error, setError] = useState(null);
  const [newLaptop, setNewLaptop] = useState({
    brand: "",
    model: "",
    serialNumber: "",
    status: "",
    purchaseDate: "",
  });

  // Fetch laptops when component mounts
  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/laptops/${id}`
      );
      if (response.status === 204) {
        setLaptops(laptops.filter((laptop) => laptop._id !== id));
      }
    } catch (error) {
      setError(`Error deleting laptop: ${error.message}`);
    }
  };

  const fetchLaptops = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/laptops");
      setLaptops(response.data);
    } catch (error) {
      setError(`Error fetching laptops: ${error.message}`);
    }
  };

  const handleCreateLaptop = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    
    try {
      // Validate required fields
      if (!newLaptop.brand || !newLaptop.model || !newLaptop.serialNumber || !newLaptop.status || !newLaptop.purchaseDate) {
        setError("All fields are required: Brand, Model, Serial Number, Status, and Purchase Date");
        return;
      }

      // Validate serial number format
      if (!/^[A-Za-z0-9]+$/.test(newLaptop.serialNumber)) {
        setError("Serial number must contain only letters and numbers (no spaces or special characters)");
        return;
      }

      // Format the data before sending
      const laptopData = {
        ...newLaptop,
        brand: newLaptop.brand.trim(),
        model: newLaptop.model.trim(),
        serialNumber: newLaptop.serialNumber.trim(),
        status: newLaptop.status || 'available',
        purchaseDate: newLaptop.purchaseDate || new Date().toISOString().split('T')[0]
      };

      const response = await axios.post(
        "http://localhost:5000/api/laptops",
        laptopData
      );

      if (response.data) {
        // Reset the form
        setNewLaptop({
          brand: "",
          model: "",
          serialNumber: "",
          status: "available",
          purchaseDate: new Date().toISOString().split('T')[0]
        });
        
        // Fetch the updated list
        await fetchLaptops();
        setError(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error creating laptop");
      console.error("Laptop creation error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Laptop List</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <h3>Create New Laptop</h3>
      <form onSubmit={handleCreateLaptop} className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Brand"
              className="form-control mb-2"
              value={newLaptop.brand}
              onChange={(e) =>
                setNewLaptop({ ...newLaptop, brand: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              placeholder="Model"
              className="form-control mb-2"
              value={newLaptop.model}
              onChange={(e) =>
                setNewLaptop({ ...newLaptop, model: e.target.value })
              }
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Serial Number"
          className="form-control mb-2"
          value={newLaptop.serialNumber}
          onChange={(e) =>
            setNewLaptop({ ...newLaptop, serialNumber: e.target.value })
          }
        />

        <select
          className="form-select mb-2"
          value={newLaptop.status}
          required
          onChange={(e) =>
            setNewLaptop({ ...newLaptop, status: e.target.value })
          }
        >
          <option value="">Select Status</option>
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
          <option value="under maintenance">Under Maintenance</option>
        </select>
        {/* <small className="text-muted d-block mb-3">Please select the laptop status</small> */}

        <input
          type="date"
          className="form-control mb-2"
          value={newLaptop.purchaseDate}
          required
          onChange={(e) =>
            setNewLaptop({ ...newLaptop, purchaseDate: e.target.value })
          }
          placeholder="Select Purchase Date"
        />
        <button type="submit" className="btn btn-primary">
          Create Laptop
        </button>
      </form>

      <ul className="list-group">
        {laptops.length > 0 ? (
          laptops.map((laptop) => (
            <li key={laptop._id} className="list-group-item mb-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h5>
                    {laptop.brand} {laptop.model}
                  </h5>
                  <p>
                    <strong>ID:</strong> {laptop._id}
                  </p>
                  <p>
                    <strong>Serial Number:</strong> {laptop.serialNumber}
                  </p>
                  <p>
                    <strong>Status:</strong> {laptop.status}
                  </p>
                  <p>
                    <strong>Purchase Date:</strong>{" "}
                    {new Date(laptop.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(laptop._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No laptops found.</p>
        )}
      </ul>
    </div>
  );
};

export default LaptopList;
