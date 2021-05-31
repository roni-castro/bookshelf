import {formatDate} from 'utils/misc'

test('formatDate formats the date to look nice', () => {
  expect(formatDate(new Date(2021, 1, 10))).toBe('Feb 21')
})
