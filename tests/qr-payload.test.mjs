import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildVcard, escapeVcardValue } from '../src/utils/vcard.js'
import { buildWifiPayload, escapeWifiField } from '../src/utils/wifi-payload.js'

test('builds a WIFI: payload with encryption, password and hidden flag', () => {
  assert.equal(
    buildWifiPayload({ ssid: 'Office', password: 'secret', encryption: 'WPA' }),
    'WIFI:T:WPA;S:Office;P:secret;;'
  )
  assert.equal(
    buildWifiPayload({ ssid: 'Guest', encryption: 'nopass' }),
    'WIFI:T:nopass;S:Guest;;'
  )
  assert.equal(
    buildWifiPayload({ ssid: 'HiddenNet', password: 'pw', encryption: 'WEP', hidden: true }),
    'WIFI:T:WEP;S:HiddenNet;P:pw;H:true;;'
  )
})

test('escapes special characters in WIFI fields', () => {
  assert.equal(escapeWifiField('a;b,c:d"e\\f'), 'a\\;b\\,c\\:d\\"e\\\\f')
  assert.equal(
    buildWifiPayload({ ssid: 'Cafe;WiFi', password: 'p:a,ss', encryption: 'WPA' }),
    'WIFI:T:WPA;S:Cafe\\;WiFi;P:p\\:a\\,ss;;'
  )
  assert.throws(() => buildWifiPayload({ ssid: '' }), /SSID is required/)
  assert.throws(() => buildWifiPayload({ ssid: 'Net', encryption: 'AES' }), /Unsupported Wi-Fi encryption/)
})

test('builds a vCard 3.0 payload from form fields', () => {
  const card = buildVcard({
    firstName: 'Ada',
    lastName: 'Lovelace',
    org: 'Analytical Engines',
    title: 'Mathematician',
    phone: '+44 20 7946 0958',
    email: 'ada@example.com',
    url: 'https://example.com',
    street: '12 Computing St',
    city: 'London',
    region: 'England',
    postalCode: 'SW1A 1AA',
    country: 'UK',
    note: 'First programmer'
  })

  assert.match(card, /^BEGIN:VCARD\r\nVERSION:3.0\r\n/)
  assert.match(card, /\r\nN:Lovelace;Ada;;;\r\n/)
  assert.match(card, /\r\nFN:Ada Lovelace\r\n/)
  assert.match(card, /\r\nORG:Analytical Engines\r\n/)
  assert.match(card, /\r\nTITLE:Mathematician\r\n/)
  assert.match(card, /\r\nTEL;TYPE=CELL:\+44 20 7946 0958\r\n/)
  assert.match(card, /\r\nEMAIL:ada@example.com\r\n/)
  assert.match(card, /\r\nURL:https:\/\/example.com\r\n/)
  assert.match(card, /\r\nADR;TYPE=WORK:;;12 Computing St;London;England;SW1A 1AA;UK\r\n/)
  assert.match(card, /\r\nNOTE:First programmer\r\nEND:VCARD$/)
})

test('escapes reserved characters in vCard values', () => {
  assert.equal(escapeVcardValue('A;B,C\\D\nE'), 'A\\;B\\,C\\\\D\\nE')

  const card = buildVcard({
    firstName: 'Li;Wei',
    lastName: 'Zhang,San',
    org: 'Acme, Inc.',
    note: 'Line 1\nLine 2'
  })

  assert.match(card, /\r\nN:Zhang\\,San;Li\\;Wei;;;\r\n/)
  assert.match(card, /\r\nORG:Acme\\, Inc\.\r\n/)
  assert.match(card, /\r\nNOTE:Line 1\\nLine 2\r\n/)
})
