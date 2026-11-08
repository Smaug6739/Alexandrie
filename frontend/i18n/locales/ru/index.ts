import type { MessageSchema } from '../../i18n.config';

import admin from './admin';
import application from './application';
import cdn from './cdn';
import common from './common';
import components from './components';
import dashboard from './dashboard';
import importPage from './import';
import landing from './landing';
import markdown from './markdown';
import nodes from './nodes';
import publicPages from './public';
import settings from './settings';
import teams from './teams';
import time from './time';
import user from './user';

export default {
  admin,
  application,
  cdn,
  common,
  components,
  dashboard,
  import: importPage,
  landing,
  markdown,
  nodes,
  public: publicPages,
  settings,
  teams,
  time,
  user,
} satisfies MessageSchema;
