const SignatureRepository = require("../repositories/SignatureRepository");
const { shuffleArray } = require("../utils/encryption")

exports.decodifyData = async function (req, res) {
  try {
      const params = req.body;

      if(!params.blockchain || !params.contractAddress || !params.senderAddress || !params.data) {
          return res.status(401).json({error: "Missing Parameters"});
      }

      const { decodifiedJson, hash } = await SignatureRepository.decodifyData(params.blockchain, params.contractAddress, params.senderAddress, params.data);

      return res.status(200).json({data: decodifiedJson, signatureHash: hash});
  } catch (e) {
      return res.status(500).json({error: e.message})
  }
}

exports.decodifyMultipleData = async function (req, res) {
  try {
    const params = req.body;

    if(!params.blockchain || !params.contractAddress || !params.senderAddresses || !params.data) {
        return res.status(401).json({error: "Missing Parameters"});
    }


    if (typeof params.senderAddresses === 'string') {
        params.senderAddresses = JSON.parse(params.senderAddresses)
        params.data = JSON.parse(params.data)
    }

    if(params.senderAddresses.length != params.data.length) {
      throw Error('Sender addresses and data must be the same length')
    }

    const { decodifiedResults, hashes } = await SignatureRepository.decodifyMultipledata(params.blockchain, params.contractAddress, params.senderAddresses, params.data);

    return res.status(200).json({data: shuffleArray( decodifiedResults, hashes)});
} catch (e) {
    return res.status(500).json({error: e.message})
}
}

exports.getUserInfo = async function (req, res) {
  try {
      const params = req.query;

      if(!params.signatureHash) {
          return res.status(401).json({error: "Missing Parameters"});
      }

      const signature = await SignatureRepository.getSignatureByHash(params.signatureHash);

      return res.status(200).json({user: signature});
  } catch (e) {
      return res.status(500).json({error: e.message})
  }
}