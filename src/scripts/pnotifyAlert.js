'use strict';
import { alert } from '@pnotify/core/dist/PNotify.js';
const capsule = () => {
    let _alert
    let funOpen = () => {}
    let funClear = () => {}
    let typical

    const initAlert = (callOpen, callClose, type = "error") => {
        funOpen = callOpen
        funClear = callClose
        typical = type
    }

    const clearAlert = (callback = funClear) => {
        if (_alert)
            if (_alert.close) {
                _alert.close()
                _alert = false
                callback()
            }
    }

    const openAlert = (title, text, type = typical, callback = funOpen) => {
        callback()
        if (_alert)
            if (_alert.close) _alert.close()
        _alert = alert({
            title,
            text,
            delay: Infinity,
            type

        });
    }

    return { initAlert, clearAlert, openAlert }
}

export default capsule()