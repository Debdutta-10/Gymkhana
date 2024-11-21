import React, { useState, useEffect } from "react";

function App() {
  const [textBoxContent, setTextBoxContent] = useState("");
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Update localStorage whenever `orders` changes
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddOrder = () => {
    if (textBoxContent.trim() === "") return;

    const lines = textBoxContent.split("\n").map((line) => line.trim());
    const updatedOrders = [...orders];

    lines.forEach((line) => {
      if (line === "") return;

      // Split line into name and food items
      const [name, foodItems] = line.split(":").map((part) => part.trim());
      if (!name || !foodItems) return;

      const items = foodItems.split(",").map((item) => item.trim());

      items.forEach((item) => {
        const match = item.match(/^(\d+)?\s*(.+)$/); // Regex to extract quantity and food item
        if (match) {
          const [, quantityString, foodName] = match;
          const quantityToAdd = parseInt(quantityString) || 1; // Default quantity to 1
          const food = foodName.trim().toLowerCase(); // Normalize food name

          const existingOrder = updatedOrders.find((order) => order.item === food);
          if (existingOrder) {
            existingOrder.quantity += quantityToAdd;
            if (!existingOrder.people.includes(name)) {
              existingOrder.people.push(name);
            }
          } else {
            updatedOrders.push({
              item: food,
              quantity: quantityToAdd,
              people: [name],
            });
          }
        }
      });
    });

    setOrders(updatedOrders);
    setTextBoxContent("");
  };

  const handleClearOrders = () => {
    setOrders([]);
    localStorage.removeItem("orders");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Food Order Tracker</h1>

      {/* Textarea Input Section */}
      <div>
        <textarea
          placeholder="Enter name and food items in the format:\nName: item1, item2, 3item3\nExample:\nJohn: 2 Burgers, Fries\nJane: 3 Chicken Fried Rice"
          value={textBoxContent}
          onChange={(e) => setTextBoxContent(e.target.value)}
          rows={8}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        ></textarea>
        <button onClick={handleAddOrder}>Add Orders</button>
      </div>

      {/* Orders Display */}
      <h2>Order Summary</h2>
      {orders.length > 0 ? (
        <table border="1" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Quantity</th>
              <th>Ordered By</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.item}</td>
                <td>{order.quantity}</td>
                <td>{order.people.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders yet!</p>
      )}

      {/* Clear Button */}
      <button
        onClick={handleClearOrders}
        style={{
          marginTop: "20px",
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Clear Orders
      </button>
    </div>
  );
}

export default App;
