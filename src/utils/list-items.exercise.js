import {useQuery} from 'react-query'
import {client} from 'utils/api-client'

export function useListItems(user) {
  return useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
  })
}
