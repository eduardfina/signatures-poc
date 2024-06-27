const Users = require("../models/user");
const Apps = require("../models/app")


exports.addUser = async function (app, id, name, surname) {
  if(await Users.exists({app, id})) throw Error("User already exists");
  let user = new Users();

  user.app = app
  user.id = id;
  user.name = name;
  user.surname = surname;

  user.save();

  return user;
}

exports.getUserById = async function (id) {
  const user = await Users.findOne({id})
  if(!user) throw Error("User not found");

  return user
}