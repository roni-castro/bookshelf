/** @jsx jsx */
import {jsx} from '@emotion/core'

import './bootstrap'
import React from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import {client} from './utils/api-client'
import * as colors from './styles/colors'

const SearchStatus = {
  Idle: 'idle',
  Loading: 'loading',
  Success: 'success',
  Failure: 'failure',
}

const SearchActions = {
  Search: 'books/search',
  Loading: 'books/loading',
  Success: 'books/success',
  Failure: 'books/failure',
}

const initialState = {
  status: SearchStatus.Idle,
  data: null,
  error: null,
  query: '',
  queried: false,
}

const SearchReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SearchActions.Search: {
      return {
        ...state,
        queried: true,
        query: action.query,
      }
    }
    case SearchActions.Loading: {
      return {
        ...state,
        status: SearchStatus.Loading,
      }
    }
    case SearchActions.Success: {
      return {
        ...state,
        status: SearchStatus.Success,
        data: action.data,
        error: null,
      }
    }
    case SearchActions.Failure: {
      return {
        ...state,
        status: SearchStatus.Failure,
        error: action.error,
      }
    }
    default: {
      throw new Error(`action ${action} is not available`)
    }
  }
}

function DiscoverBooksScreen() {
  const [{status, error, data, queried, query}, dispatch] = React.useReducer(
    SearchReducer,
    initialState,
  )

  React.useEffect(() => {
    if (queried) {
      dispatch({type: SearchActions.Loading})
      client(`books?query=${encodeURIComponent(query)}`)
        .then(response => {
          dispatch({type: SearchActions.Success, data: response})
        })
        .catch(error => dispatch({type: SearchActions.Failure, error}))
    }
  }, [query, queried])

  const isLoading = status === SearchStatus.Loading
  const isSuccess = status === SearchStatus.Success
  const isError = status === SearchStatus.Failure

  function handleSearchSubmit(event) {
    event.preventDefault()
    const query = event.target.elements['search'].value
    dispatch({type: SearchActions.Search, query})
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>
      {isError ? (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
