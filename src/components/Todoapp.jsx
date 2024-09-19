import React, { useEffect, useState } from "react";
import API_URL from "../utils/api";
import axios from "axios";

const Todoapp = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editTodoId, setEditTodoId] = useState(null); // To track which todo is being edited

  useEffect(() => {
    fetchApi();
  }, []);

  // Fetch all todos
  const fetchApi = async () => {
    let response = await axios.get(`${API_URL}/alltodos`);
    setTodos(response.data.alltodos);
  };

  //  addtodo
  const handleAddTodo = async () => {
    if (!text) return;
    try {
      let response = await axios.post(`${API_URL}/addtodo`, { todo: text });
      setTodos([...todos, response.data]);
      setText("");
      fetchApi();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  //   delete todo
  const handleDeleteTodo = async (todoId) => {
    try {
      await axios.delete(`${API_URL}/deletetodo/${todoId}`);
      setTodos(todos.filter((todo) => todo._id !== todoId));
      fetchApi();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdateTodo = async () => {
    if (!text || !editTodoId) return;
    try {
      let response = await axios.patch(`${API_URL}/updatetodo/${editTodoId}`, {
        todo: text,
      });
      setTodos(
        todos.map((todo) => (todo._id === editTodoId ? response.data : todo))
      );
      setEditTodoId(null);
      setText("");
      fetchApi();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleEditTodo = (todo) => {
    setEditTodoId(todo._id);
    setText(todo.todo);
    fetchApi();
  };

  return (
    <div>
      {/* Input for adding/updating a todo */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          style={{
            border: "2px solid ",
            width: "50vw",
            height: "8vh",
            fontSize: "20px",
            paddingLeft: "10px",
            marginLeft: "250px",
          }}
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Enter your Todo"
        />
        <button
          style={{
            backgroundColor: "black",
            border: "none",
            color: "white",
            padding: "20px",
            cursor: "pointer",
            marginLeft: "20px",
          }}
          onClick={editTodoId ? handleUpdateTodo : handleAddTodo}
        >
          {editTodoId ? "Update Todo" : "Add Todo"}
        </button>
      </div>

      {/* Todo List */}
      <div>
        {todos.map((eachtodo) => {
          return (
            <div
              style={{
                display: "flex",
                borderBottom: "2px solid",
                justifyContent: "space-between",
                width: "50vw",
                marginLeft: "250px",
                padding: "4px",
              }}
              key={eachtodo._id}
            >
              <p>{eachtodo.todo}</p>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  style={{
                    height: "40px",
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEditTodo(eachtodo)}
                >
                  Edit
                </button>
                <button
                  style={{
                    height: "40px",
                    cursor: "pointer",
                    backgroundColor: "black",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                  onClick={() => handleDeleteTodo(eachtodo._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Todoapp;
