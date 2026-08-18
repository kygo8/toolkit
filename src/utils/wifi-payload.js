export const escapeWifiField = (value) => (
  String(value ?? '').replace(/([\\;,:"])/g, '\\$1')
)

export const buildWifiPayload = ({
  ssid = '',
  password = '',
  encryption = 'WPA',
  hidden = false
} = {}) => {
  const name = String(ssid ?? '').trim()
  if (!name) {
    throw new Error('SSID is required')
  }

  const type = encryption === 'none' ? 'nopass' : encryption
  if (!['WPA', 'WEP', 'nopass'].includes(type)) {
    throw new Error('Unsupported Wi-Fi encryption')
  }

  const parts = [`T:${type}`, `S:${escapeWifiField(name)}`]
  if (type !== 'nopass') {
    parts.push(`P:${escapeWifiField(password)}`)
  }
  if (hidden) {
    parts.push('H:true')
  }

  return `WIFI:${parts.join(';')};;`
}
