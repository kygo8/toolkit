export const escapeVcardValue = (value) => (
  String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
)

const hasValue = (value) => String(value ?? '').trim() !== ''

export const buildVcard = ({
  firstName = '',
  lastName = '',
  fullName = '',
  org = '',
  title = '',
  phone = '',
  email = '',
  url = '',
  street = '',
  city = '',
  region = '',
  postalCode = '',
  country = '',
  note = ''
} = {}) => {
  const given = String(firstName ?? '').trim()
  const family = String(lastName ?? '').trim()
  const formattedName = String(fullName ?? '').trim()
    || [given, family].filter(Boolean).join(' ')
    || String(org ?? '').trim()

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVcardValue(family)};${escapeVcardValue(given)};;;`
  ]

  if (formattedName) lines.push(`FN:${escapeVcardValue(formattedName)}`)
  if (hasValue(org)) lines.push(`ORG:${escapeVcardValue(org.trim())}`)
  if (hasValue(title)) lines.push(`TITLE:${escapeVcardValue(title.trim())}`)
  if (hasValue(phone)) lines.push(`TEL;TYPE=CELL:${escapeVcardValue(phone.trim())}`)
  if (hasValue(email)) lines.push(`EMAIL:${escapeVcardValue(email.trim())}`)
  if (hasValue(url)) lines.push(`URL:${escapeVcardValue(url.trim())}`)

  const address = [street, city, region, postalCode, country]
  if (address.some(hasValue)) {
    lines.push(`ADR;TYPE=WORK:;;${address.map((part) => escapeVcardValue(String(part ?? '').trim())).join(';')}`)
  }

  if (hasValue(note)) lines.push(`NOTE:${escapeVcardValue(note.trim())}`)
  lines.push('END:VCARD')

  return lines.join('\r\n')
}
