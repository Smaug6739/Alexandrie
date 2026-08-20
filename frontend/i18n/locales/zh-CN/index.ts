import type { MessageSchema } from '../../i18n.config';

import admin from './admin';
import application from './application';
import cdn from './cdn';
import common from './common';
import components from './components';
import dashboard from './dashboard';
import importPage from './import';
import markdown from './markdown';
import landing from './landing';
import nodes from './nodes';
import publicPages from './public';
import settings from './settings';
import time from './time';
import user from './user';
import teams from './teams';

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
  time,
  user,
  teams,
} satisfies MessageSchema;
