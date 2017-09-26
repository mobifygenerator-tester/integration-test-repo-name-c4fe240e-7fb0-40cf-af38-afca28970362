import {Connector} from './connectors/_merlins-connector'
import connectorExtension from './connector-extension'
import {registerConnector} from 'progressive-web-sdk/dist/integration-manager'

const initConnector = () => {
    registerConnector(Connector(), connectorExtension)
}

export default initConnector
