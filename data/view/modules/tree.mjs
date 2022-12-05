import {projects, issues} from './database.mjs';
import * as search from './search.mjs';

const e = document.getElementById('projects');
const toast = document.getElementById('toast');

document.getElementById('add-project').onclick = () => {
  const name = prompt('What is the project name').trim().replace(/[/\\]/g, '-');

  if (name) {
    projects.add({name}).then(guid => {
      const option = e.option([
        {name: ''}, // icon
        {name, part: 'one'},
        {name: '0/0'}
      ], name, guid, true);
      option.insert();
      e.selectedIndex = e.length;
    }).catch(e => toast.notify(e.message, 'error'));
  }
};

e.onchange = () => {
  const query = e.selectedOptions.map(o => `mime:"${o.name}/${o.value}"`).join(' OR ');
  search.perform(e.selectedOptions.length === 1 ? query : `(${query})`);
};

document.getElementById('remove-project').onclick = async () => {
  const options = e.selectedOptions;
  console.log(options);

  if (options.length && e.length - options.length > 0) {
    const matches = await projects.matches(...options);

    if (matches.length) {
      return toast.notify('You can only remove empty projects');
    }

    const n = e.selectedIndex;
    projects.remove(...options).then(() => {
      for (let n = 0; n < options.length; n += 1) {
        e.removeIndex(e.selectedIndex);
      }
      e.selectedIndex = Math.min(n, e.length);
    }).catch(e => {
      console.error(e);
      toast.notify(e.message, 'error');
    });
  }
  else {
    if (options.length) {
      toast.notify('You need to have at least one project left', 'error');
    }
    else {
      toast.notify('Select one or more projects first');
    }
  }
};

const stats = async ({name, value}) => {
  const a = await issues.matches({
    query: `mime:"${name}/${value}" AND keyword:unread`,
    length: 10000
  });
  const b = await issues.matches({
    query: `mime:"${name}/${value}" NOT keyword:complete`,
    length: 10000
  });

  return {
    unread: a.length,
    total: b.length
  };
};

window.addEventListener('xapian-ready', () => projects.list().then(async arr => {
  for (const {name, value} of arr) {
    const {unread, total} = await stats({name, value});

    const option = e.option([
      {name: ''},
      {name, part: 'one'},
      {name: unread + '/' + total}
    ], name, value);
    option.insert();
  }
  e.selectedIndex = 1;
}));

const active = () => e.selectedOptions;

const update = async () => {
  for (const option of e.options) {
    const {unread, total} = await stats(option);

    option._internal.div.children[2].textContent = unread + '/' + total;
  }
};

export {
  active,
  update
};
