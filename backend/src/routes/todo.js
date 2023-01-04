import Todo from "../models/todo";

exports.getTodo = async (req, res) => {
  const studentId = req.query.studentId;
  const todos = Todo.collection.find({ studentId: studentId });
  let eventList = new Set();
  if (!todos) res.status(403).send({ eventList: [], msg: "getTodo" });
  else {
    await todos.forEach((todo) => {
      eventList.add(todo);
    });
    eventList = Array.from(eventList);
    res.status(200).send({ eventList: eventList, msg: "getTodo" });
  }
};

exports.addTodo = async (req, res) => {
  const body = req.body;
  //console.log(body);
  new Todo(body).save();
  console.log("added");
  await res.send({ msg: "addTodo" });
};

exports.checkTodo = async (req, res) => {
  const studentId = req.body.studentId;
  const event = req.body.event;
  const status = req.body.status;
  await Todo.updateOne(
    { studentId: studentId, event: event },
    { status: status }
  );
  console.log("checked");
  await res.send({ msg: "checkTodo" });
};

exports.deleteTodo = async (req, res) => {
  const studentId = req.query.studentId;
  const event = req.query.event;
  //console.log(studentId);
  await Todo.collection.deleteMany({ studentId: studentId, event: event });
  console.log("deleted");
  await res.send({ msg: "deleteTodo" });
};
