import {issues} from './database.mjs';
import * as tree from './tree.mjs';
import * as view from './view.mjs';

class Keywords {
  constructor(keywords = document.getElementById('keywords').value) {
    this.keywords = new Set(keywords.split(/\s*,\s*/).filter(a => a));
  }
  value() {
    return [...this.keywords].join(', ');
  }
  add(keyword) {
    this.keywords.add(keyword);
  }
  delete(keyword) {
    this.keywords.delete(keyword);
  }
  has(keyword) {
    return this.keywords.has(keyword);
  }
}

const e = document.querySelector('#results extended-list-view');
e.css(`
  div[data-unread=true] span:nth-child(1),
  div[data-unread=true] span:nth-child(3) {
    font-weight: bold;
  }
  div[data-complete] {
    opacity: 0.5;
  }
  div[data-complete=true] span:nth-child(1),
  div[data-complete=true] span:nth-child(3) {
    text-decoration: line-through;
  }
  div[data-flagged=true] {
    color: blue;
  }
  div[data-pinned=true] {
    color: red;
    font-weight: bold;
  }
`);

const keywords = async method => {
  for (const option of e.selectedOptions) {
    const n = read(option);
    const keywords = new Keywords(n.keywords);
    if (method === 'mark-as-read') {
      keywords.delete('unread');
    }
    else if (method === 'mark-as-flagged') {
      keywords.add('flagged');
    }
    else if (method === 'mark-as-unflagged') {
      keywords.delete('flagged');
    }
    else if (method === 'mark-as-pinned') {
      keywords.add('pinned');
    }
    else if (method === 'mark-as-unpinned') {
      keywords.delete('pinned');
    }
    else if (method === 'mark-as-unread') {
      keywords.add('unread');
      keywords.delete('complete');
    }
    else if (method === 'mark-as-complete') {
      keywords.add('complete');
      keywords.delete('unread');
    }

    const o = await issues.body(n.guid);
    await issues.add({
      ...o,
      project: n.project,
      keywords: keywords.value()
    }, n.guid);

    fix(option._internal.div, keywords.value());
  }
  tree.update();
  e.dispatchEvent(new Event('change'));
};

document.getElementById('view').onsubmit = async ev => {
  ev.preventDefault();

  const guid = ev.submitter.id === 'add-issue' ? undefined : e.value;
  const option = e.selectedOptions[0];

  const project = e.length ? read(option).project : tree.active()[0];
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  const keywords = new Keywords();

  if (!guid) {
    keywords.add('unread');
    keywords.delete('complete');
  }

  const id = await issues.add({
    project,
    title,
    body,
    keywords: keywords.value()
  }, guid);

  if (!guid) {
    let at = 0;
    // if issue is not important place it after important issues
    if (keywords.has('flagged') === false) {
      for (const option of e.options) {
        if (read(option).keywords.includes('flagged')) {
          at += 1;
        }
        else {
          break;
        }
      }
    }

    add({
      title,
      keywords: keywords.value(),
      body,
      project,
      timestamp: Date.now()
    }, id, at);
    e.selectedIndex = at + 1;
  }
  tree.update();

  // update ui for update-issue
  if (guid) {
    option.name = title;
    option._internal.div.children[0].textContent = title;
    option._internal.div.children[2].textContent = body;

    // update keywords
    fix(option._internal.div, keywords.value());
  }
};


const fix = (div, keywords) => {
  div.children[1].textContent = keywords;

  Object.keys(div.dataset).forEach(key => delete div.dataset[key]);
  for (const keyword of keywords.split(/\s*,\s*/)) {
    div.dataset[keyword] = true;
  }
};

// delete an issue
document.getElementById('delete-issue').onclick = () => {
  const n = e.selectedIndex;

  const names = e.selectedOptions.map(o => o.name);

  if (confirm('The following issues are permanently deleted: \n\n' + names.join('\n'))) {
    for (const option of e.selectedOptions) {
      issues.remove(option.value);
    }
    e.selectedOptions.forEach(() => {
      e.removeIndex(e.selectedIndex);
    });
    e.selectedIndex = Math.min(n, e.length);

    tree.update();
  }
};

// update keywords
document.getElementById('mark-as-read').onclick = () => keywords('mark-as-read');
document.getElementById('mark-as-unread').onclick = () => keywords('mark-as-unread');
document.getElementById('mark-as-complete').onclick = () => keywords('mark-as-complete');
document.getElementById('mark-as-flagged').onclick = () => keywords('mark-as-flagged');
document.getElementById('mark-as-unflagged').onclick = () => keywords('mark-as-unflagged');
document.getElementById('mark-as-pinned').onclick = () => keywords('mark-as-pinned');
document.getElementById('mark-as-unpinned').onclick = () => keywords('mark-as-unpinned');

e.onchange = async () => {
  const guid = e.value;
  const body = await issues.body(guid);

  view.update(body);
};

const add = ({title, keywords, body, project, timestamp}, guid, at = e.length) => {
  const date = new Date(timestamp);

  const config = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  };

  const option = e.option([
    {name: title, part: 'one'},
    {
      name: keywords.replace(/\s*,\s*/g, ', ')
    },
    {name: body},
    project,
    {name: new Intl.DateTimeFormat(navigator.language, config).format(date)}
  ], title, guid);
  option.insert(at);

  for (const keyword of keywords.split(/\s*,\s*/)) {
    option._internal.div.dataset[keyword] = true;
  }
};

const clear = () => e.clear();

const select = (n = 1) => e.selectedIndex = n;

const read = e => {
  return {
    keywords: e._internal.div.children[1].textContent,
    name: e.name,
    guid: e.value,
    project: e.parts[3]
  };
};

export {
  add,
  clear,
  select,
  read
};
