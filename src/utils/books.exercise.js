import {useQuery} from 'react-query'
import {client} from 'utils/api-client'
export function useBook(bookId, user) {
  return useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })
}
