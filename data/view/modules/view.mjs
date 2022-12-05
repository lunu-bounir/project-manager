const update = ({title = '', keywords = '', body = ''}) => {
  document.getElementById('title').value = title;
  document.getElementById('keywords').value = keywords || '';
  document.getElementById('body').value = body;
};

const clear = () => {
  update({});
};

export {
  update,
  clear
};
