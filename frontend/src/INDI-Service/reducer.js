const defaultState = {
    drivers: {},
    groups: {},
    server_running: false,
    server_found: false,
    server_error: false,
    startStopPending: false,
    selectedDrivers: [],
    profiles: [],
    selectedProfile: null,
    lastError: {}
};

const receivedFullState = (state, {drivers, groups, is_error, is_running, server_found}) => ({
    ...state,
    drivers,
    groups,
    server_error: is_error,
    server_running: is_running,
    server_found,
})

const toggleDriver = (state, driver, selected) => {
    if(! selected)
        return {...state, selectedDrivers: state.selectedDrivers.filter(d => d !== driver)}
    return {...state, selectedDrivers: [...state.selectedDrivers, driver]}
}

const indiServiceStarted = (state, drivers) => ({
    ...state,
    server_running: true,
    selectedDrivers: drivers,
    startStopPending: false,
})

const indiServiceExited = (state, isError, payload) => ({
    ...state,
    startStopPending: false,
    server_running: false,
    lastError: isError ? {
        exitCode: payload.exit_code,
        stdout: payload.stdout,
        stderr: payload.stderr,
    } : {}
})

const selectedProfile = (state, id) => {
    let profile = state.profiles.find(profile => profile.id === id);
    return {
        ...state,
        selectedProfile: id,
        selectedDrivers: profile ? profile.drivers : state.selectedDrivers,
    }
}

const indiservice = (state = defaultState, action) => {
    switch(action.type) {
        case 'RECEIVED_INDI_SERVICE':
            return receivedFullState(state, action.data);
        case 'SELECTED_INDI_DRIVER':
            return toggleDriver(state, action.driver, action.selected);
        case 'FETCH_START_INDI_SERVICE':
        case 'FETCH_STOP_INDI_SERVICE':
            return {...state, startStopPending: true};
        case 'INDI_SERVICE_ERROR_STARTING':
        case 'INDI_SERVICE_ERROR_STOPPING':
            return {...state, startStopPending: false};
        case 'INDI_SERVICE_STARTED':
            return indiServiceStarted(state, action.payload.drivers)
        case 'INDI_SERVICE_EXITED':
            return indiServiceExited(state, action.is_error, action.payload)
        case 'INDI_SERVICE_DISMISS_ERROR':
            return {...state, lastError: {}}
        case 'RECEIVED_INDI_PROFILES':
            return {...state, profiles: action.data, selectedProfile: state.selectedProfile in action.data ? state.selectedProfile : null}
        case 'SELECTED_INDI_PROFILE':
            return selectedProfile(state, action.id)
        case 'INDI_SERVICE_PROFILE_ADDED':
            return {...state, profiles: [...state.profiles, action.data], selectedProfile: action.data.id}
        default:
            return state
    }
}

export default indiservice
