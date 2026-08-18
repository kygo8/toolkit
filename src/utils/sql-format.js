import { format } from 'sql-formatter'

export const sqlDialects = [
  { value: 'sql', label: 'SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'transactsql', label: 'T-SQL' }
]

export const formatSql = (sqlText, language = 'sql') => format(sqlText, {
  language,
  tabWidth: 2,
  keywordCase: 'upper'
})

export const minifySql = (sqlText) => {
  const source = String(sqlText || '')
  let output = ''
  let i = 0

  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]

    if (char === '-' && next === '-') {
      i += 2
      while (i < source.length && source[i] !== '\n') i++
      continue
    }

    if (char === '/' && next === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++
      i += 2
      continue
    }

    if (char === '\'' || char === '"') {
      const quote = char
      output += char
      i++
      while (i < source.length) {
        output += source[i]
        if (source[i] === quote) {
          if (source[i + 1] === quote) {
            output += source[i + 1]
            i += 2
            continue
          }
          i++
          break
        }
        i++
      }
      continue
    }

    if (/\s/.test(char)) {
      while (i < source.length && /\s/.test(source[i])) i++
      if (
        output
        && i < source.length
        && !/\s/.test(output.at(-1))
        && !/[(),;]/.test(output.at(-1))
        && !/[(),;]/.test(source[i])
      ) {
        output += ' '
      }
      continue
    }

    output += char
    i++
  }

  return output.trim()
}
