import { SensorDecodedValue } from './kiwrious/data/SensorDecodedValue';
import { SensorReadResult } from './kiwrious/data/SensorReadResult';
import { HeartRateResult, HEART_RATE_RESULT_STATUS } from './kiwrious/service/serial/HeartRateProcessor';
import serialService from './kiwrious/service/serial/SerialService';

const zincRenderer = (window as any).zincRenderer;

const MAX_ZINC_VALUE = 5000;
const MAX_HEARTRATE_VALUE = 100;

document.getElementById('btn-kiwrious-connect').onclick = () => {
    serialService.connectAndReadAsync();
};

const $kiwriousValue = document.getElementById('kiwrious-value');

const convertToZincValue = (heartRateValue: number): number => {
    return MAX_ZINC_VALUE * heartRateValue / MAX_HEARTRATE_VALUE;
};

serialService.onSerialData = (decodedData: SensorReadResult) => {
    const values = decodedData.decodedValues as SensorDecodedValue[];
    
    const val = values[0].value as HeartRateResult;
    const status = val.status;
    const hrVal = val.value;

    switch(status) {
        case HEART_RATE_RESULT_STATUS.TOO_HIGH: 
            $kiwriousValue.innerText = 'too high';
            break;
        case HEART_RATE_RESULT_STATUS.TOO_LOW: 
            $kiwriousValue.innerText = 'too low';
            break;
        case HEART_RATE_RESULT_STATUS.PROCESSING: 
            $kiwriousValue.innerText = 'processing..';
            break;

        case HEART_RATE_RESULT_STATUS.READY: 
            $kiwriousValue.innerText = hrVal.toString();

            const zincValue = convertToZincValue(hrVal);
            zincRenderer.setPlayRate(zincValue);
            break;
    }
}
