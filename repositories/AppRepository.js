const Apps = require("../models/app");


exports.addApp = async function (name) {
  if (await Apps.exists({ name })) {
    throw Error("App already created")
  }
  let app = new Apps();

  app.name = name
  app.save();

  return app;
}

exports.getAppByName = async function (name) {
  const app = await Apps.findOne({name})
  if(!app) throw Error("App not found");

  return app
}