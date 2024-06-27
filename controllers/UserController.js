const UserRepository = require('../repositories/UserRepository');
const SignatureRepository = require("../repositories/SignatureRepository");

exports.createOrModifySignature = async function (req, res) {
  try {
      const params = req.body;
      const userId = req.user.id

      if(!params.blockchain || !params.contractAddress || !params.senderAddress || !userId) {
          return res.status(401).json({error: "Missing Parameters"});
      }
      
      const user = await UserRepository.getUserById(userId)
      const signature = await SignatureRepository.createOrModifySignature(user, params.blockchain, params.contractAddress, params.senderAddress);

      return res.status(200).json({signature});
  } catch (e) {
      return res.status(500).json({error: e.message})
  }
}

exports.codifyData = async function (req, res) {
  try {
      const params = req.query;
      const userId = req.user.id

      if(!params.blockchain || !params.contractAddress || !params.senderAddress || !params.data || !userId) {
          return res.status(401).json({error: "Missing Parameters"});
      }

      const user = await UserRepository.getUserById(userId)
      const codifiedData = await SignatureRepository.codifyData(user, params.blockchain, params.contractAddress, params.senderAddress, params.data);

      return res.status(200).json({codifiedData});
  } catch (e) {
      return res.status(500).json({error: e.message})
  }
}