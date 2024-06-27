const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const UserRepository = require('../repositories/UserRepository');
const AppRepository = require("../repositories/AppRepository");
/**
 * Auth Controller
 */

exports.methodNotFound = function (req, res) {
    return res.status(404).json({ msg: 'Method not found' })
}

exports.registerApp = async function (req, res) {
  try {
      const params = req.body;

      if(!params.name) {
          return res.status(401).json({error: "Missing Parameters"});
      }

      const app = await AppRepository.addApp(params.name);

      return res.status(200).json({app});
  } catch (e) {
      return res.status(500).json({error: e.message})
  }
}

exports.registerUser = async function (req, res) {
    try {
        const params = req.body;

        if(!params.appName || !params.id || !params.name || !params.surname) {
            return res.status(401).json({error: "Missing Parameters"});
        }

        const app = await AppRepository.getAppByName(params.appName)

        if (!app) {
            throw Error("App not found")
        }

        const user = await UserRepository.addUser(app, params.id, params.name, params.surname);
        const token = await jwt.sign({ app: user.app, id: user.id }, process.env.SECRET)

        return res.status(200).json({user, token});
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
}

exports.getUser = async function (req, res, next) {
    try {
      if (!req.headers.authorization) return res.status(400).json({ error: "No authorization header" });

      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (!token) return res.status(400).json({ error: "Malformed auth header" });

      const payload = await jwt.verify(token, process.env.SECRET);
      if (!payload) return res.status(400).json({ error: "Token verification failed" });
      if (!payload.app || !payload.id) return res.status(400).json({ error: "Invalid user token" });

      req.user = payload;
      next();
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
}

exports.generateAdminToken = async function (req, res) {
    try {
        const token = await jwt.sign({role:'admin'}, process.env.SECRET);

        return res.status(200).json({token: token});
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
}

exports.generateOracleToken = async function (req, res) {
  try {
    const token = await jwt.sign('oracle', process.env.SECRET);

    return res.status(200).json({token: token});
  } catch (e) {
      return res.status(500).json({error: e.message})
  }
}

exports.isAdminAuth = async function (req, res, next) {
    try {
        if (!req.headers.authorization) return res.status(400).json({ error: "No authorization header" });

        const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
        if (!token) return res.status(400).json({ error: "Malformed auth header" });

        const payload = await jwt.verify(token, process.env.SECRET);
        if (!payload) return res.status(400).json({ error: "Token verification failed" });

        if(payload.role !== 'admin')
            return res.status(400).json({error: "You are not an admin"});

        next();
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
}

exports.isOracleAuth = async function (req, res, next) {
  try {
      if (!req.headers.authorization) return res.status(400).json({ error: "No authorization header" });

      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (!token) return res.status(400).json({ error: "Malformed auth header" });

      const payload = await jwt.verify(token, process.env.SECRET);
      if (!payload) return res.status(400).json({ error: "Token verification failed" });

      if(payload !== 'oracle')
          return res.status(400).json({error: "You are not an oracle"});

      next();
  } catch (e) {
      return res.status(500).json({error: e.message})
  }
}