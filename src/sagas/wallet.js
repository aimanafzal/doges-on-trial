import { takeLatest, select, call } from 'redux-saga/effects'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import { lessduxSaga } from '../utils/saga'
import { web3 } from '../bootstrap/dapp-api'
import * as errorConstants from '../constants/error'

/**
 * Fetches the current wallet's accounts.
 * @returns {string[]} - The accounts.
 */
function* fetchAccounts() {
  const accounts = yield call(web3.eth.getAccounts)
  if (!accounts[0]) throw new Error(errorConstants.ETH_NO_ACCOUNTS)

  return accounts
}

/**
 * Fetches the current wallet's ethereum balance.
 * @returns {string} - The balance.
 */
function* fetchBalance() {
  const balance = yield call(
    web3.eth.getBalance,
    yield select(walletSelectors.getAccount)
  )

  return String(balance)
}

/**
 * Fetches the current wallet's settings.
 * @returns {object} - The settings object.
 */
function* fetchSettings() {
  return { email: 'abc@cba.com' }
}

/**
 * Updates the current wallet settings' email.
 * @param {{ type: string, payload: ?object, meta: ?object }} action - The action object.
 * @returns {object} - The updated settings object.
 */
function* updateEmail({ payload: { email } }) {
  return { email }
}

/**
 * The root of the wallet saga.
 */
export default function* walletSaga() {
  // Accounts
  yield takeLatest(
    walletActions.accounts.FETCH,
    lessduxSaga,
    'fetch',
    walletActions.accounts,
    fetchAccounts
  )

  // Balance
  yield takeLatest(
    walletActions.balance.FETCH,
    lessduxSaga,
    'fetch',
    walletActions.balance,
    fetchBalance
  )

  // Settings
  yield takeLatest(
    walletActions.settings.FETCH,
    lessduxSaga,
    'fetch',
    walletActions.settings,
    fetchSettings
  )
  yield takeLatest(
    walletActions.settings.UPDATE_EMAIL,
    lessduxSaga,
    'update',
    walletActions.settings,
    updateEmail
  )
}
