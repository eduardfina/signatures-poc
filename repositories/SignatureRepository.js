const Signatures = require("../models/signature");
const { generateKeyPair, encryptData, decryptData, createSignatureHash } = require("../utils/encryption")

exports.createOrModifySignature = async function (user, blockchain, contractAddress, senderAddress) {
  let signature = await Signatures.findOne({user, blockchain, contractAddress});
  
  if(!signature) {
    signature = new Signatures();
    const { publicKey, privateKey } = await generateKeyPair()

    signature.user = user
    signature.hash = createSignatureHash(signature._id.toString())
    signature.blockchain = blockchain
    signature.contractAddress = contractAddress;
    signature.codifier = publicKey
    signature.decodifier = privateKey
  }

  signature.senderAddress = senderAddress;

  signature.save();

  return signature;
}

exports.codifyData = async function (user, blockchain, contractAddress, senderAddress, data) {
  const codifier = await getCodifier(user, blockchain, contractAddress, senderAddress)
  const codifiedData = await encryptData(data, codifier)
  const encodedData = encodeURIComponent(codifiedData)

  return encodedData;
}

exports.decodifyData = async function (blockchain, contractAddress, senderAddress, data) {
  const { decodifier, hash } = await getDecodifier(blockchain, contractAddress, senderAddress)
  const decodedData = decodeURIComponent(data)
  const decodifiedData = await decryptData(decodedData, decodifier)

  const decodifiedJson = JSON.parse(decodifiedData)

  return { decodifiedJson, hash }
}

exports.decodifyMultipledata = async function (blockchain, contractAddress, senderAddresses, data) {
  const decodifiedResults = []
  const hashes = []

  for (let index = 0; index < senderAddresses.length; index++) {
    const { decodifier, hash } = await getDecodifier(blockchain, contractAddress, senderAddresses[index])
    const decodedData = decodeURIComponent(data[index])
    const decodifiedData = await decryptData(decodedData, decodifier)

    const decodifiedJson = JSON.parse(decodifiedData)

    decodifiedResults.push(decodifiedJson)
    hashes.push(hash)
  }

  return { decodifiedResults, hashes }
}

exports.getSignatureByHash = async function (hash) {
  const signature = await Signatures.findOne({hash}).populate({
    path: 'user',
    populate: { path: 'app' }
  })

  if (!signature) {
    throw Error("Signature not found")
  }

  return signature
}

getCodifier = async function (user, blockchain, contractAddress, senderAddress) {
  const signature = await Signatures.findOne({user, blockchain, contractAddress, senderAddress})

  if (!signature) {
    throw Error("Signature not found")
  }

  return signature.codifier
}

getDecodifier = async function (blockchain, contractAddress, senderAddress) {
  const signature = await Signatures.findOne({blockchain, contractAddress, senderAddress})

  if (!signature) {
    throw Error("Signature not found")
  }

  return { decodifier: signature.decodifier, hash: signature.hash }
}