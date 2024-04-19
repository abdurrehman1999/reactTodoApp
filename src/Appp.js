import "./App.css";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";

function Appp() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the todo being edited
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setAllTodos(updatedTodoArr);
    localStorage.setItem("todoList", JSON.stringify(updatedTodoArr));
    setNewTitle("");
    setNewDescription("");
  };

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem("todoList", JSON.stringify(reducedTodo));
    setAllTodos(reducedTodo);
  };

  const handleDeleteAll = () => {
    let reducedTodo = [];
    localStorage.setItem("todoList", JSON.stringify(reducedTodo));
    setAllTodos(reducedTodo);
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let CompleteOn =
      dd + "-" + mm + "-" + yyyy + " at " + h + ":" + m + ":" + s;

    let filteredItem = { ...allTodos[index], CompleteOn: CompleteOn };

    let updatedCompletedArray = [...completedTodos];
    updatedCompletedArray.push(filteredItem);
    setCompletedTodos(updatedCompletedArray);
    handleDeleteTodo(index);
    localStorage.setItem(
      "completedTodos",
      JSON.stringify(updatedCompletedArray)
    );
  };

  const handleCompletedDeleteTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem("completedTodos", JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  const handleEdit = (index) => {
    if (editMode && editIndex === index) {
   
      handleSaveEdit();
    } 
    else {
   
      setEditMode(true);
      setEditIndex(index);
      setEditTitle(allTodos[index].title);
      setEditDescription(allTodos[index].description);
    }
  };

  const handleSaveEdit = () => {

    let updatedTodos = [...allTodos];
    updatedTodos[editIndex].title = editTitle;
    updatedTodos[editIndex].description = editDescription;
    setAllTodos(updatedTodos);
    localStorage.setItem("todoList", JSON.stringify(updatedTodos));
    setEditMode(false);
    setEditIndex(null);
  };

  useEffect(() => {
    let savedTodos = JSON.parse(localStorage.getItem("todoList"));
    let savedCompletedTodos = JSON.parse(
      localStorage.getItem("completedTodos")
    );

    if (savedCompletedTodos) {
      setCompletedTodos(savedCompletedTodos);
    }

    if (savedTodos) {
      setAllTodos(savedTodos);
    }
  }, []);

  return (
    <div className="App">
      <h1>My Todo's</h1>
      <div className="todo-wrapper">
        <div className="todo-inputs">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task"
              required="required"
            ></input>
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
              required="required"
            ></input>
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <div>
            <button
              className={`secondaryBtn ${
                isCompleteScreen === false && "active"
              }  `}
              onClick={() => setIsCompleteScreen(false)}
            >
              Todo
            </button>
            <button
              className={`secondaryBtn ${
                isCompleteScreen === true && "active"
              }  `}
              onClick={() => setIsCompleteScreen(true)}
            >
              Completed
            </button>
          </div>
          {isCompleteScreen === false ? (
            <div>
              <button
                className="deleteAllButton"
                onClick={() => handleDeleteAll()}
              >
                <MdDeleteForever className="deleteAll" />
              </button>
            </div>
          ) : null}
        </div>
        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  {editIndex === index && editMode ? (
                    <div>
                      <input className="input-update-title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <input className="input-update-description" 
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  )}

                  <div>
                    <MdDelete
                      className="delete-icon"
                      onClick={() => handleDeleteTodo(index)}
                    />
                    {editMode && editIndex === index ? (
                      <FaSave 
                        className="save-icon"
                        onClick={handleSaveEdit}
                      />
                    ) : (
                      <MdOutlineEdit
                        className="update-icon"
                        onClick={() => handleEdit(index)}
                      />
                    )}

                    <FaCheck
                      className="check-icon"
                      onClick={() => handleComplete(index)}
                    />
                  </div>
                </div>
              );
            })}

          {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>
                      <small>completed On: {item.CompleteOn}</small>
                    </p>
                  </div>
                  <div>
                    <MdDelete
                      className="delete-icon"
                      onClick={() => handleCompletedDeleteTodo(index)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Appp;
