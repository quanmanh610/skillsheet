import {AppMessage} from './AppMessage';

export const Validations = {

    checkEmpty(param) {
        const isValid = (param === '');
        return {
            isValid: isValid,
            message: (isValid) ? AppMessage.INPUT_EMPTY : ''
        }
    }

};
