import React from 'react';
import { Input, Button, Icon } from 'semantic-ui-react';
import PRINTJ from 'printj'

const parseExposure = (exposure) => parseFloat(exposure);
const exposureValid = (exposure) => parseExposure(exposure) > 0;
const isNumber = (exposure) => !isNaN(parseExposure(exposure));

const ExposureShootIcon = ({disabled, onClick, isShooting, size}) => (
    <Button as='a' content='Shoot' icon={<Icon name={isShooting ? 'spinner' : 'camera'} loading={isShooting}/>} disabled={disabled} size={size} onClick={onClick} />
)

const getValue = (isShooting, shotParameters, cameraExposureValue) => {
    if(isShooting && cameraExposureValue) {
        return PRINTJ.sprintf(cameraExposureValue.format, cameraExposureValue.value).trim();
    }
    return isNumber(shotParameters.exposure) ? parseExposure(shotParameters.exposure) : ''
}

const ExposureInput = ({shotParameters, cameraExposureValue, onExposureChanged, onShoot, disabled, isShooting, size='tiny'}) => (
    <Input
        type='number'
        placeholder='seconds'
        size={size}
        min={0}
        max={999999}
        step={0.1}
        onChange={(e, data) => onExposureChanged(parseExposure(data.value))}
        disabled={disabled}
        value={getValue(isShooting, shotParameters, cameraExposureValue)}
        label={
            <ExposureShootIcon size={size} isShooting={isShooting} disabled={disabled || ! exposureValid(shotParameters.exposure)} onClick={() => onShoot(shotParameters)} />
        }
        labelPosition='right'
    />
);

export default ExposureInput;
