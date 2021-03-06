import fetch from 'isomorphic-fetch'
import Actions from '../actions'

import { normalize } from 'normalizr'
import { commandsSchema, sequenceSchema, sequenceListSchema, sequenceJobSchema } from './schemas'

export const apiFetch = async (url, options) => {
    const response = await fetch(url, options);
    const isJSON = response.headers.has('content-type') && response.headers.get('content-type') === 'application/json';
    let reply = { response };
    if(isJSON) {
        reply.json = await response.json();
    } else {
        reply.text = await response.text();
    }
    return response.ok ? Promise.resolve(reply) : Promise.reject(reply);
}


// TODO: refactor using apiFetch
const fetchJSON = (dispatch, url, options, onSuccess, onError) => {
    let dispatchError = response => {
        response.text().then( body => { dispatch(Actions.serverError('network_request', 'response', response, body)) })
    }

    let errorHandler = response => {
        if(! onError || ! onError(response))
            dispatchError(response);
    }
    return fetch(url, options)
        .then(response => {
            if(! response.ok)
                throw response;
            return response.json();
        }).then(onSuccess)
        .catch(error => {
            if('status' in error) {
                errorHandler(error)
            } else {
                dispatch(Actions.serverError('network_request', 'exception', error))
            }
        });
}

export const fetchBackendVersion = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/version', {}, json => onSuccess(json));

export const startSequenceAPI = (dispatch, sequence, onSuccess, onError) => fetchJSON(dispatch, `/api/sequences/${sequence.id}/start`, {
        method: 'POST',
    }, json => onSuccess(json), onError);


export const stopSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequence.id}/stop`, {
        method: 'POST',
    }, json => onSuccess(json));

export const resetSequenceAPI = (dispatch, sequence, options, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequence.id}/reset?remove_files=${String(options.remove_files)}`, {
        method: 'POST',
    }, json => onSuccess(normalize(json, sequenceSchema)));


export const duplicateSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequence.id}/duplicate`, {
        method: 'POST',
    }, json => onSuccess(normalize(json, sequenceSchema)));


export const importSequenceAPI = (dispatch, data, onSuccess) => fetchJSON(dispatch, '/api/sequences/import', {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json'
        },
    }, json => onSuccess(normalize(json, sequenceSchema)));



export const fetchSequencesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/sequences', {}, json => onSuccess(normalize(json, sequenceListSchema)));

export const createSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, '/api/sequences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sequence)
    }, json => onSuccess(normalize(json, sequenceSchema)));

export const editSequenceAPI = (dispatch, sequence, onSuccess) => fetchJSON(dispatch, '/api/sequences/' + sequence.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sequence)
    }, json => onSuccess(normalize(json, sequenceSchema)));



export const deleteSequenceAPI = (dispatch, sequenceId, options, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceId}?remove_files=${String(options.remove_files)}`, {
        method: 'DELETE'
    }, json => onSuccess(normalize(json, sequenceSchema)));


export const createSequenceJobAPI = (dispatch, sequenceJob, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceJob.sequence}/sequence_jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sequenceJob)
    }, json => onSuccess(normalize(json, sequenceJobSchema)));

export const updateSequenceJobAPI = (dispatch, sequenceJob, onSuccess, onError) => fetchJSON(dispatch, `/api/sequences/${sequenceJob.sequence}/sequence_jobs/${sequenceJob.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sequenceJob)
    }, json => onSuccess(normalize(json, sequenceJobSchema)), onError);

export const moveSequenceJobAPI = (dispatch, sequenceJob, direction, onSuccess, onError) => fetchJSON(dispatch, `/api/sequences/${sequenceJob.sequence}/sequence_jobs/${sequenceJob.id}/move`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ direction })
    }, json => onSuccess(normalize(json, sequenceSchema)), onError);


export const duplicateSequenceJobAPI = (dispatch, sequenceJob, onSuccess, onError) => fetchJSON(dispatch, `/api/sequences/${sequenceJob.sequence}/sequence_jobs/${sequenceJob.id}/duplicate`, {
        method: 'PUT',
    }, json => onSuccess(normalize(json, sequenceSchema)), onError);


export const deleteSequenceJobAPI = (dispatch, sequenceId, sequenceJobId, options, onSuccess) => fetchJSON(dispatch, `/api/sequences/${sequenceId}/sequence_jobs/${sequenceJobId}?remove_files=${String(options.remove_files)}`, {
        method: 'DELETE'
    }, json => onSuccess(normalize(json, sequenceSchema)));



export const autoloadConfigurationAPI = (dispatch, device) => fetchJSON(dispatch, `/api/server/devices/${device}/properties/CONFIG_PROCESS`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ CONFIG_LOAD: true }),
    }, json => {});

export const getINDIServerStatusAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/status', {}, onSuccess);

export const setINDIServerConnectionAPI = (dispatch, connect, onSuccess) => fetchJSON(dispatch, `/api/server/${ connect ? 'connect' : 'disconnect'}`, { method: 'PUT'}, onSuccess);

export const getINDIDevicesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/server/devices', {}, onSuccess);

export const getCamerasAPI = (dispatch, onSuccess, onError) => fetchJSON(dispatch, '/api/cameras', {}, onSuccess, onError);
export const getFilterWheelsAPI = (dispatch, onSuccess, onError) => fetchJSON(dispatch, '/api/filter_wheels', {}, onSuccess, onError);

export const getINDIDevicePropertiesAPI = (dispatch, device, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties`, {}, onSuccess);

export const setINDIValuesAPI = (dispatch, device, property, pendingValues, onSuccess) => fetchJSON(dispatch, `/api/server/devices/${device.name}/properties/${property.name}`, {
        method: 'PUT',
        body: JSON.stringify(pendingValues),
        headers: {
            'Content-Type': 'application/json'
        }
    }, onSuccess);

export const getINDIServiceAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/indi_service', {}, onSuccess);
export const startINDIServiceAPI = (dispatch, drivers, onSuccess, onError) => fetchJSON(dispatch, '/api/indi_service/start', {
        method: 'POST',
        body: JSON.stringify({ drivers }),
        headers: {
            'Content-Type': 'application/json'
        }
    }, onSuccess, onError);
export const stopINDIServiceAPI = (dispatch, onSuccess, onError) => fetchJSON(dispatch, '/api/indi_service/stop', {
        method: 'POST',
    }, onSuccess, onError);


export const fetchINDIProfilesAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/indi_profiles', {}, json => onSuccess(json));
export const addINDIProfileAPI = (dispatch, data, onSuccess) => fetchJSON(dispatch, '/api/indi_profiles', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
    },
}, json => onSuccess(json));
export const removeINDIProfileAPI = (dispatch, id, onSuccess) => fetchJSON(dispatch, '/api/indi_profiles/' + id, {
    method: 'DELETE',
}, json => onSuccess(json));

export const updateINDIProfileAPI = (dispatch, data, onSuccess) => fetchJSON(dispatch, '/api/indi_profiles/' + data.id, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
    }
}, json => onSuccess(json));

export const cameraShootAPI = (dispatch, cameraId, data, onSuccess, onError) => fetchJSON(dispatch, `/api/cameras/${cameraId}/image`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
    },
}, onSuccess, onError);


export const fetchHistogramApi = (dispatch, type, imageId, bins, onSuccess, onError) => {
    let uri = `/api/images/${type}/${imageId}/histogram?range_int=1`;
    if(bins)
        uri += `&bins=${bins}`;
    fetchJSON(dispatch, uri, {}, onSuccess, onError);
}

export const getSettingsApi = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/settings', {}, onSuccess);
export const updateSettingsApi = (dispatch, settings, onSuccess) => fetchJSON(dispatch, '/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
        headers: {
            'Content-Type': 'application/json'
        }
}, onSuccess);


export const getImages = (dispatch, type, onSuccess) => fetchJSON(dispatch, `/api/images/${type}`, {}, onSuccess);
export const searchImages = (dispatch, type, params, onSuccess) => fetchJSON(dispatch, `/api/images/${type}/search`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
}, onSuccess);


export const fetchCommandsAPI = (dispatch, onSuccess) => fetchJSON(dispatch, '/api/commands', {}, json => onSuccess(normalize(json, commandsSchema)));

