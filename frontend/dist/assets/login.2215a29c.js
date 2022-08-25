import { d as c, _ as d, c as i, a as t, o as p, p as r, i as l } from './index.80d36c9d.js';
const u = c({
  name: 'login',
  beforeMount() {
    document.cookie && document.cookie.includes('user_auth') && this.$router.push('/admin');
  },
  methods: {
    async connect() {
      const e = JSON.stringify({
          username: document.getElementById('form-username').value,
          password: document.getElementById('form-password').value,
        }),
        n = await (
          await fetch('http://192.168.0.25:8082/api/v1/auth', {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: e,
            credentials: 'include',
          })
        ).json();
      n.status == 'success' && n.result.auth && this.$router.push('/admin');
    },
  },
});
const s = e => (r('data-v-d3f8a464'), (e = e()), l(), e),
  m = s(() => t('legend', null, 'Connexion', -1)),
  _ = s(() => t('input', { id: 'form-username', type: 'text', placeholder: 'Username' }, null, -1)),
  f = s(() => t('input', { id: 'form-password', type: 'text', placeholder: 'Password' }, null, -1));
function h(e, o, n, y, g, v) {
  return (
    p(),
    i('form', null, [
      t('fieldset', null, [
        m,
        _,
        f,
        t(
          'button',
          { type: 'button', onClick: o[0] || (o[0] = (...a) => e.connect && e.connect(...a)), class: 'btn btn-pink' },
          'Connexion',
        ),
      ]),
    ])
  );
}
const b = d(u, [
  ['render', h],
  ['__scopeId', 'data-v-d3f8a464'],
]);
export { b as default };
