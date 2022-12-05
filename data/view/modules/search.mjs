import {issues} from './database.mjs';
import * as results from './results.mjs';
import * as view from './view.mjs';

const form = document.querySelector('#search form');

form.onsubmit = async e => {
  e.preventDefault();

  results.clear();

  const query = form.querySelector('input[type=search]').value;
  const map = new Map();
  try {
    for (const o of await issues.matches({
      query: 'keyword:pinned',
      partial: false
    })) {
      o._body = await o.body();
      map.set(o.guid, o);
    }
  }
  catch (e) {
    console.error(e);
  }
  try {
    for (const o of await issues.matches({
      query,
      partial: false
    })) {
      o._body = await o.body();
      map.set(o.guid, o);
    }
  }
  catch (e) {
    console.log(e);
  }

  const arr = [...await map.values()];
  // sort
  arr.sort((a, b) => {
    if (a._body.keywords.includes('pinned') && b._body.keywords.includes('pinned') === false) {
      return -1;
    }
    if (b._body.keywords.includes('pinned') && a._body.keywords.includes('pinned') === false) {
      return 1;
    }
    if (a._body.keywords.includes('flagged') && b._body.keywords.includes('flagged') === false) {
      return -1;
    }
    if (b._body.keywords.includes('flagged') && a._body.keywords.includes('flagged') === false) {
      return 1;
    }
    if (a._body.keywords.includes('unread') && b._body.keywords.includes('unread') === false) {
      return -1;
    }
    if (b._body.keywords.includes('unread') && a._body.keywords.includes('unread') === false) {
      return 1;
    }
    if (a._body.keywords.includes('complete') && b._body.keywords.includes('complete') === false) {
      return 1;
    }
    if (b._body.keywords.includes('complete') && a._body.keywords.includes('complete') === false) {
      return -1;
    }

    return b._body.timestamp - a._body.timestamp;
  });

  for (const {_body, guid} of arr) {
    const [name, value] = _body.mime.split('/');

    results.add({
      ..._body,
      project: {
        name,
        value
      }
    }, guid);
  }

  if (arr.length) {
    results.select(1);
  }
  else {
    view.clear();
  }
};

const perform = query => {
  form.querySelector('input[type=search]').value = query;
  form.querySelector('input[type=submit]').click();
};

export {
  perform
};
