self.addEventListener('install', function () {
  console.log('Install!');
});
self.addEventListener(
  'activate',
  /*event*/ _ => {
    console.log('Activate!');
  },
);
