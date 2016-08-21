export const GOT_SUBSCRIBERS = 'GOT_SUBSCRIBERS';
export const GET_NEW_SUBSCRIBER = 'GET_NEW_SUBSCRIBER';
export const UPDATE_SUBSCRIBER_FIELD = 'UPDATE_SUBSCRIBER_FIELD';

import axios from 'axios';
import Immutable from 'immutable';
import moment from 'moment';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import { showModal } from './modalActions';
import { showStatusMessage } from '../actions';
import { apiBillRun } from '../Api';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function updateSubscriberField(field_id, value) {
  return {
    type: UPDATE_SUBSCRIBER_FIELD,
    field_id,
    value
  };
}

function gotSubscribers(subscribers) {
  return {
    type: GOT_SUBSCRIBERS,
    subscribers
  };
}

function fetchSubscribers(aid) {
  //  const fetchUrl = `/api/subscribers?method=query&query={"aid":${aid}, "type":"subscriber"}`;
  const query = {aid: parseInt(aid, 10), type: "subscriber",
                 to: {"$gt": moment().toISOString()}};
  const fetchUrl = `/api/find?collection=subscribers&query=${JSON.stringify(query)}`
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        const subscribers = _.values(resp.data.details);
        dispatch(gotSubscribers(subscribers));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      if (error.data) {
        dispatch(showModal(error.data.message, "Error!"));
      } else {
        console.log(error);
      }
      dispatch(hideProgressBar());
    });
  };  
}

export function getSubscribers(aid) {
  return dispatch => {
    return dispatch(fetchSubscribers(aid));
  };
}

function saveSubscriptionToDB(subscription, callback) {
  const query = {
    api: "subscribers",
    params: [
      { method: "update" },
      { type: "subscriber" },
      { query: JSON.stringify({aid: subscription.aid, sid: subscription.sid}) },
      { update: JSON.stringify(subscription) },
      { project: JSON.stringify({"key": 1}) }
    ]
  };
  return (dispatch) => {
    dispatch(showProgressBar());
    apiBillRun(query).then((resp) => {
      const error = resp.data[0].error;
      if (error) {
        dispatch(showModal(resp.data[0].error.desc, "Error!"));
      } else {
        dispatch(showStatusMessage("Saved subscription successfully!", 'success'));
      }
      dispatch(hideProgressBar());
      callback(resp, error);
    });
  };
}

export function saveSubscription(subscription, callback = () => {}) {
  return dispatch => {
    return dispatch(saveSubscriptionToDB(subscription, callback));
  };
}
