/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import {queryCache, useMutation, useQuery} from 'react-query'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import * as colors from 'styles/colors'
import {CircleButton, Spinner} from './lib'

function TooltipButton({label, highlight, onClick, icon, ...rest}) {
  const {isLoading, isError, error, run} = useAsync()

  function handleClick() {
    run(onClick())
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

function StatusButtons({user, book}) {
  const {data} = useQuery('list-items', () =>
    client('list-items', {token: user.token}),
  )

  const listItem = data?.listItems.find(listItem => listItem.bookId === book.id)

  const [mutateRemoteListItem] = useMutation(
    id => {
      return client(`list-items/${id}`, {
        method: 'DELETE',
        token: user.token,
      })
    },
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )

  const [mutateUpdateListItem] = useMutation(
    ({id, finishDate}) => {
      const data = {id, finishDate}
      return client(`list-items/${id}`, {
        method: 'PUT',
        data,
        token: user.token,
      })
    },
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )

  const [mutateCreateListItem] = useMutation(
    () => {
      const data = {bookId: book.id}
      return client('list-items', {method: 'POST', data, token: user.token})
    },
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            onClick={() =>
              mutateUpdateListItem({id: listItem.id, finishDate: null})
            }
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() =>
              mutateUpdateListItem({id: listItem.id, finishDate: Date.now()})
            }
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => mutateRemoteListItem(listItem.id)}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={mutateCreateListItem}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export {StatusButtons}
