// Load Environment variables
require('dotenv').config()
verifyEnvironmentVars()

const configuration = {
    defaultPort: parseInt('3002'),
    defaultNetwork: 'localhost',
    networks: {
      localhost: {
        name: 'localhost',
        host: 'http:127.0.0.1:8545'
      }
    }
}
// Export configuration
module.exports = configuration

loadNetwork()

// Ensure all secret information is read from environment
function verifyEnvironmentVars() {
    // Add env variables in case required
    const requiredEnvVars = []

    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            console.error(`Error: ${key} is unset`)
            process.exit(1)
        }
    })

    console.log(`Environment variables loaded successfully!`)
}
function loadNetwork() {
    console.log(`Configuring the network ${configuration.defaultNetwork}`)
    if (!configuration.networks[configuration.defaultNetwork]) {
        console.error(`Error: network ${configuration.defaultNetwork} doesn't exists!`)
        process.exit(1)
    }
    configuration.network = configuration.networks[configuration.defaultNetwork]
}