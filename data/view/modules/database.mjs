/* global xapian */

const guid = (prefix = 'rdn-') => prefix + (Math.random() + 1).toString(36).substring(7);

const MAX_NUMBER_PROJECTS = 10000;

const DEFAULT_PROJECTS = [{
  name: 'my project',
  value: 'prj-cd04yi'
}];

const projects = {
  list() {
    return new Promise(resolve => chrome.storage.local.get({
      projects: DEFAULT_PROJECTS
    }, prefs => resolve(prefs.projects)));
  },
  async add(project) { // {name, icon}
    const arr = await projects.list();
    const names = arr.map(o => o.name);

    if (names.includes(project.name)) {
      throw Error(`"${project.name}" name already exists`);
    }

    project.value = guid('prj-');

    return new Promise(resolve => chrome.storage.local.set({
      projects: [...arr, project]
    }, () => resolve(project.value)));
  },
  async remove(...prjs) {
    const arr = await projects.list();

    const narr = arr.filter(o => {
      for (const project of prjs) {
        if (o.name === project.name && o.value === project.value) {
          return false;
        }
      }
      return true;
    });

    if (narr.length) {
      return new Promise(resolve => chrome.storage.local.set({
        projects: narr
      }, resolve));
    }
    throw Error('cannot remove all projects');
  },
  // how many issues are there for these database names
  matches(...projects) {
    const query = projects.map(({name, value}) => `mime:"${name}/${value}"`).join(' OR ');

    return issues.matches({query, length: MAX_NUMBER_PROJECTS});
  }
};

const issues = {
  add({title, body, project, keywords}, id) {
    return xapian.add({
      title: title,
      body,
      keywords,
      mime: project.name + '/' + project.value
    }, undefined, id || guid('iss-'));
  },
  matches({query, length = 30}) {
    const r = xapian.search({query, length});
    const rtn = [];

    if (r.size) {
      for (let i = 0; i < r.size; i += 1) {
        rtn.push({
          guid: xapian.search.guid(i),
          body() {
            return xapian.search.body(i);
          }
        });
      }
    }

    return Promise.resolve(rtn);
  },
  remove(guid) {
    return xapian.remove(guid);
  },
  body(guid) {
    return xapian.body(guid);
  }
};

export {
  projects,
  issues
};
