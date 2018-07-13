import React from 'react'
import PropTypes from 'prop-types'
import { RenderIf } from 'lessdux'

import { web3 } from '../../../../bootstrap/dapp-api'
import * as arbitrablePermissionListSelectors from '../../../../reducers/arbitrable-permission-list'
import * as dogeSelectors from '../../../../reducers/doge'
import InfoCard from '../../../../components/info-card'
import FilePicker from '../../../../components/file-picker'
import ValueList from '../../../../components/value-list'
import Button from '../../../../components/button'

import './submit.css'

const Submit = ({
  arbitrablePermissionListData,
  doge,
  imageFileDataURL,
  imageFileInfoMessage,
  handleOnFileDropAccepted,
  handleSubmitDogeClick
}) => (
  <div className="Submit">
    {imageFileInfoMessage && <InfoCard message={imageFileInfoMessage} />}
    <h1>Submit your Doge</h1>
    {doge.creating ? (
      'Submitting doge...'
    ) : (
      <FilePicker
        multiple={false}
        onDropAccepted={handleOnFileDropAccepted}
        imageFilePreviewURL={imageFileDataURL}
      />
    )}
    <br />
    <br />
    <RenderIf
      resource={arbitrablePermissionListData}
      loading="Loading data..."
      done={
        arbitrablePermissionListData.data && (
          <div className="Submit-bottom">
            <ValueList
              items={[
                {
                  label: 'Deposit',
                  value: String(
                    web3.utils.fromWei(
                      String(
                        web3.utils
                          .toBN(arbitrablePermissionListData.data.stake)
                          .add(
                            web3.utils.toBN(
                              arbitrablePermissionListData.data.arbitrationCost
                            )
                          )
                      )
                    )
                  )
                }
              ]}
            />
            <br />
            <br />
            <Button
              onClick={handleSubmitDogeClick}
              disabled={!imageFileDataURL || doge.creating}
            >
              {doge.creating ? 'Submitting...' : 'Submit Doge'}
            </Button>
          </div>
        )
      }
      failedLoading="There was an error fetching the list's data."
    />
  </div>
)

Submit.propTypes = {
  // State
  arbitrablePermissionListData:
    arbitrablePermissionListSelectors.arbitrablePermissionListDataShape
      .isRequired,
  doge: dogeSelectors.dogeShape.isRequired,
  imageFileDataURL: PropTypes.string,
  imageFileInfoMessage: PropTypes.string,

  // Handlers
  handleOnFileDropAccepted: PropTypes.func.isRequired,
  handleSubmitDogeClick: PropTypes.func.isRequired
}

Submit.defaultProps = {
  // State
  imageFileDataURL: null,
  imageFileInfoMessage: null
}

export default Submit