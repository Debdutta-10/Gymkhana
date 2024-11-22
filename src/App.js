import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [ordersText, setOrdersText] = useState("");
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [editingField, setEditingField] = useState(null); // Track currently editing field

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddOrder = () => {
    if (name.trim() === "" || ordersText.trim() === "") return;

    const lines = ordersText.split("\n").map((line) => line.trim());
    const updatedOrders = [...orders];

    lines.forEach((line) => {
      if (line === "") return;

      const match = line.match(/^(\d+)?\s*(.+)$/);
      if (match) {
        const [, quantityString, foodName] = match;
        const quantityToAdd = parseInt(quantityString) || 1;
        const food = foodName.trim().toLowerCase();

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

    setOrders(updatedOrders);
    setName("");
    setOrdersText("");
  };

  const handleClearOrders = () => {
    setOrders([]);
    localStorage.removeItem("orders");
  };

  const handleEditFood = (index, newFoodName) => {
    const updatedOrders = [...orders];
    updatedOrders[index].item = newFoodName.toLowerCase();
    setOrders(updatedOrders);
  };

  const handleEditPerson = (orderIndex, personIndex, newPersonName) => {
    const updatedOrders = [...orders];
    updatedOrders[orderIndex].people[personIndex] = newPersonName;
    setOrders(updatedOrders);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Food Order Tracker</h1>

      {/* Input Section */}
      <div className="holder">
        <input
          type="text"
          placeholder="Enter your name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Enter orders in the format: quantity item1 \n quantity item2"
          value={ordersText}
          onChange={(e) => setOrdersText(e.target.value)}
          rows={7}
          className="textarea"
        ></textarea>
        <button
          onClick={handleAddOrder}
          style={{
            padding: "10px 20px",
            width: "10%",
            display: "block",
            margin: "auto",
          }}
          className="but"
        >
          Add Orders
        </button>
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
            {orders.map((order, orderIndex) => (
              <tr key={orderIndex}>
                <td style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                    onClick={() => setEditingField(`food-${orderIndex}`)}
                  >
                    ✏️
                  </span>
                  {editingField === `food-${orderIndex}` ? (
                    <input
                      type="text"
                      value={order.item}
                      onChange={(e) =>
                        handleEditFood(orderIndex, e.target.value)
                      }
                      onBlur={() => setEditingField(null)}
                    />
                  ) : (
                    <span>{order.item}</span>
                  )}
                </td>
                <td>{order.quantity}</td>
                <td>
                  {order.people.map((person, personIndex) => (
                    <div
                      key={personIndex}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <span
                        style={{
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                        onClick={() =>
                          setEditingField(`person-${orderIndex}-${personIndex}`)
                        }
                      >
                        ✏️
                      </span>
                      {editingField === `person-${orderIndex}-${personIndex}` ? (
                        <input
                          type="text"
                          value={person}
                          onChange={(e) =>
                            handleEditPerson(
                              orderIndex,
                              personIndex,
                              e.target.value
                            )
                          }
                          onBlur={() => setEditingField(null)}
                        />
                      ) : (
                        <span>{person}</span>
                      )}
                    </div>
                  ))}
                </td>
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
