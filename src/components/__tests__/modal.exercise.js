import * as React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Modal, ModalContents, ModalOpenButton} from '../modal'

test('modal can be opened and closed', () => {
  const modalContentTitle = 'modal content title'
  const modalContentLabel = 'modal content label'
  const modalContentValue = 'modal content value'
  render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents aria-label={modalContentLabel} title={modalContentTitle}>
        <div>{modalContentValue}</div>
      </ModalContents>
    </Modal>,
  )

  userEvent.click(screen.getByRole('button', {name: /open/i}))

  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveAttribute('aria-label', modalContentLabel)
  const dialogContent = within(dialog)
  expect(
    dialogContent.getByRole('heading', {name: modalContentTitle}),
  ).toBeInTheDocument()
  expect(dialogContent.getByText(modalContentValue)).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', {name: /close/i}))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('modal can be dismissed', () => {
  const {baseElement} = render(
    <Modal>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
      <ModalContents
        aria-label={'modal content label'}
        title="modal content title"
      >
        <div>modal content value</div>
      </ModalContents>
    </Modal>,
  )

  userEvent.click(screen.getByRole('button', {name: /open/i}))

  expect(screen.queryByRole('dialog')).toBeInTheDocument()

  userEvent.click(baseElement.querySelector('[data-reach-dialog-overlay]'))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
