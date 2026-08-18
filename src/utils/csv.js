const needsQuotes = /[",\n\r]/

const escapeCsvField = (value) => {
  if (value == null) return ''
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value)
  if (needsQuotes.test(text)) return `"${text.replaceAll('"', '""')}"`
  return text
}

export const parseCsv = (text) => {
  const source = String(text || '').replace(/^\uFEFF/, '')
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < source.length; i++) {
    const char = source[i]

    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(field)
      field = ''
      continue
    }

    if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.some((cell) => cell !== '')) rows.push(row)
      row = []
      continue
    }

    field += char
  }

  if (inQuotes) {
    throw new Error('CSV quoted field is not closed')
  }

  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

export const csvToRecords = (text) => {
  const rows = parseCsv(text)
  if (!rows.length) return []

  const headers = rows[0].map((header, index) => header || `field${index + 1}`)
  return rows.slice(1).map((row) => {
    const record = {}
    headers.forEach((header, index) => {
      record[header] = row[index] ?? ''
    })
    return record
  })
}

export const recordsToCsv = (records) => {
  if (!Array.isArray(records)) {
    throw new Error('JSON must be an array of objects')
  }

  if (!records.length) return ''

  const headers = []
  const seen = new Set()

  for (const record of records) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      throw new Error('JSON must be an array of objects')
    }
    for (const key of Object.keys(record)) {
      if (!seen.has(key)) {
        seen.add(key)
        headers.push(key)
      }
    }
  }

  if (!headers.length) {
    throw new Error('JSON must be an array of objects')
  }

  const lines = [headers.map(escapeCsvField).join(',')]
  for (const record of records) {
    lines.push(headers.map((header) => escapeCsvField(record[header])).join(','))
  }
  return lines.join('\n')
}

export const jsonToCsv = (jsonText) => {
  const data = JSON.parse(jsonText)
  return recordsToCsv(data)
}

export const csvToJson = (csvText, pretty = true) => {
  const records = csvToRecords(csvText)
  return pretty ? JSON.stringify(records, null, 2) : JSON.stringify(records)
}
