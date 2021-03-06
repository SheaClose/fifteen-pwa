import React, { Component } from "react";
import { reactLocalStorage as ls } from "reactjs-localstorage";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";

class App extends Component {
  state = {
    todos: [],
    todo: "",
    date_time: "",
    open: false,
    checked: false
  };
  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = e => {
    let { todo, date_time } = this.state;
    if (todo && date_time) {
      this.submit(e);
    }
    this.setState({ open: false });
  };
  completeTodo = i => {
    let { todos } = this.state;
    let copy = todos.slice();
    copy[i].complete = !copy[i].complete;
    this.setState({ todos: copy });
    ls.setObject("todos", copy);
  };
  submit = e => {
    e.preventDefault();
    let { todos, todo, date_time, checked } = this.state;
    if (!checked) {
      date_time = new Date();
    }
    let newTodos = [...todos, { todo: todo, date_time, complete: false }];
    this.setState({
      todos: newTodos,
      todo: "",
      date_time: "",
      open: false,
      checked: false
    });
    ls.setObject("todos", newTodos);
  };
  deleteTodo = i => {
    let { todos } = this.state;
    let copy = todos.slice();
    copy.splice(i, 1);
    this.setState({ todos: copy });
    ls.setObject("todos", copy);
  };
  componentDidMount() {
    let todos = ls.getObject("todos");

    if (Array.isArray(todos)) {
      this.setState({ todos });
    }
  }

  render() {
    let todos = this.state.todos.map((c, i) => (
      <Card
        style={{ width: "50vw", margin: "50px auto", padding: "50px" }}
        onClick={() => this.completeTodo(i)}
        onDoubleClick={() => this.deleteTodo(i)}
        key={i}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <span style={{ textDecoration: c.complete ? "line-through" : "" }}>
            {c.todo}
          </span>{" "}
          <span>{formatDate(new Date(c.date_time))}</span>
        </div>
      </Card>
    ));
    return (
      <div className="App">
        <AppBar id="App-header">
          <h1 className="App-title">Todos</h1>
        </AppBar>
        <div>
          {todos}
          <Button
            variant="fab"
            color="primary"
            aria-label="Add"
            onClick={this.handleClickOpen}
            style={{ position: "fixed", right: "5vh", bottom: "5vh" }}
          >
            <AddIcon />
          </Button>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add Todo</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Add new todo here. Optionally select a date and time for
                reminder.
              </DialogContentText>
              <TextField
                autoFocus
                type="text"
                name="todo"
                onChange={this.handleChange}
                value={this.state.todo}
                label="New Todo"
              />
              <br />
              Add Reminder:
              <Checkbox
                checked={this.state.checked}
                name="checked"
                label="Add reminder?"
                onChange={e => this.setState({ checked: !this.state.checked })}
              />
              <br />
              {this.state.checked ? (
                <TextField
                  id="datetime-local"
                  type="datetime-local"
                  name="date_time"
                  value={this.state.date_time}
                  onChange={this.handleChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              ) : null}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.submit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default App;

function formatDate(date) {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + " " + monthNames[monthIndex] + " " + year;
}
