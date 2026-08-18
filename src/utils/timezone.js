export const TIMEZONES = [
  { id: 'UTC', label: 'UTC' },
  { id: 'Asia/Taipei', label: 'Asia/Taipei' },
  { id: 'Asia/Shanghai', label: 'Asia/Shanghai' },
  { id: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { id: 'Asia/Seoul', label: 'Asia/Seoul' },
  { id: 'Asia/Singapore', label: 'Asia/Singapore' },
  { id: 'America/New_York', label: 'America/New_York' },
  { id: 'America/Chicago', label: 'America/Chicago' },
  { id: 'America/Denver', label: 'America/Denver' },
  { id: 'America/Los_Angeles', label: 'America/Los_Angeles' },
  { id: 'Europe/London', label: 'Europe/London' },
  { id: 'Europe/Paris', label: 'Europe/Paris' },
  { id: 'Europe/Berlin', label: 'Europe/Berlin' },
  { id: 'Australia/Sydney', label: 'Australia/Sydney' }
]

const offsetToIso = (value) => {
  const match = String(value || '').match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/)
  if (!match) return 'Z'
  const sign = match[1]
  const hours = match[2].padStart(2, '0')
  const minutes = (match[3] || '00').padStart(2, '0')
  return `${sign}${hours}:${minutes}`
}

export function formatInTimeZone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'shortOffset'
  })
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]))
  const offset = offsetToIso(parts.timeZoneName)
  const local = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`

  return {
    local,
    iso: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${offset}`,
    offset,
    unix: Math.floor(date.getTime() / 1000)
  }
}

export function convertAcrossTimezones(date) {
  return TIMEZONES.map((zone) => ({
    ...zone,
    ...formatInTimeZone(date, zone.id)
  }))
}
