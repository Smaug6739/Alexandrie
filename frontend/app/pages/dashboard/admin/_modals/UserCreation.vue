<template>
  <div class="modal-content">
    <header>
      <div>
        <h2>Create users</h2>
        <p>Add people one at a time or import a CSV file, then review the same import list before creating accounts.</p>
      </div>
    </header>

    <form class="manual-form" @submit.prevent>
      <h3>Add a user</h3>
      <div class="fields">
        <div class="field">
          <label>Username <span class="required">*</span></label>
          <input v-model.trim="manualUser.username" autocomplete="off" placeholder="jdoe" />
        </div>
        <div class="field">
          <label>Email <span class="required">*</span></label>
          <input v-model.trim="manualUser.email" type="email" autocomplete="email" placeholder="jane@example.com" />
        </div>
        <div class="field">
          <label>First name</label>
          <input v-model.trim="manualUser.firstname" autocomplete="given-name" placeholder="Jane" />
        </div>
        <div class="field">
          <label>Last name</label>
          <input v-model.trim="manualUser.lastname" autocomplete="family-name" placeholder="Doe" />
        </div>
      </div>
      <div class="manual-actions">
        <div class="actions-row">
          <AppToggle v-model="manualUser.totp_forced" />
          <label class="toggle-row">
            <span><strong>Require two-factor authentication</strong><small>The user will need to set up TOTP.</small></span>
          </label>
        </div>
        <AppButton type="secondary" @click="addManualUser"><Icon name="plus" /> Add to import list</AppButton>
      </div>
      <tag v-if="manuelUserError" red>{{ manuelUserError }}</tag>
    </form>

    <section class="import-section" aria-labelledby="csv-title">
      <div class="section-heading">
        <div>
          <h3 id="csv-title">Import list</h3>
          <p>Upload a CSV file or edit the list directly. The first row must contain the column names.</p>
        </div>
        <label class="upload-button"><Icon name="import" /> Import CSV<input type="file" accept=".csv,text/csv" @change="importCsvFile" /></label>
      </div>
      <p class="csv-format"><code>username,email,firstname,lastname,totp_forced</code></p>
      <textarea v-model="csvContent" aria-label="Users CSV import list" spellcheck="false" />
      <tag v-if="parseErrors.length" red>{{ parseErrors[0] }}</tag>
      <p v-else class="queue-count">{{ parsedUsers.length }} {{ parsedUsers.length === 1 ? 'user' : 'users' }} ready to import</p>
    </section>
    <div class="progress">
      <ImportProgress :import-job="job" />
    </div>
    <footer>
      <AppButton type="primary" :disabled="!parsedUsers.length || parseErrors.length > 0" @click="importAll">Import All ({{ parsedUsers.length }})</AppButton>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { ImportJob } from '~/helpers/backups/Importer';
import type { UserToCreate } from '~/stores';
import ImportProgress from '../../import/_components/ImportProgress.vue';

const users = useUserStore();

const CSV_HEADERS = ['username', 'email', 'firstname', 'lastname', 'totp_forced'] as const;
const csvContent = ref(CSV_HEADERS.join(','));
const manualUser = reactive<UserToCreate>({ username: '', email: '', firstname: '', lastname: '', totp_forced: false });
const manuelUserError = ref('');
const parsedResult = computed(() => parseUsersCsv(csvContent.value));
const parsedUsers = computed(() => parsedResult.value.users);
const parseErrors = computed(() => parsedResult.value.errors);

const job: ImportJob<UserToCreate, null> = reactive({
  status: 'pending',
  toCreate: [],
  toUpdate: [],
  created: [],
  updated: [],
  failures: 0,
  error_message: '',
  options: null,
});

function addManualUser() {
  manuelUserError.value = '';
  if (!manualUser.username) return (manuelUserError.value = 'Username is required.');
  if (!manualUser.email) return (manuelUserError.value = 'Email is required.');
  const row = [manualUser.username, manualUser.email, manualUser.firstname, manualUser.lastname, String(Boolean(manualUser.totp_forced))]
    .map(value => escapeCsvValue(value ?? ''))
    .join(',');
  csvContent.value = `${csvContent.value.trimEnd()}\n${row}`;
  Object.assign(manualUser, { username: '', email: '', firstname: '', lastname: '', totp_forced: manualUser.totp_forced });
}

async function importCsvFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  csvContent.value = await file.text();
  input.value = '';
}

async function importAll() {
  job.toCreate = parsedUsers.value;
  await users.bulkRegister(job);
}

function parseUsersCsv(content: string): { users: UserToCreate[]; errors: string[] } {
  const rows = parseCsv(content);
  if (!rows.length) return { users: [], errors: [] };
  const headers = rows[0]!.map(header => header.trim().toLowerCase());
  const missingHeaders = CSV_HEADERS.filter(header => !headers.includes(header));
  if (missingHeaders.length) return { users: [], errors: [`Missing CSV column${missingHeaders.length > 1 ? 's' : ''}: ${missingHeaders.join(', ')}.`] };

  const positions = Object.fromEntries(CSV_HEADERS.map(header => [header, headers.indexOf(header)])) as Record<(typeof CSV_HEADERS)[number], number>;
  const users: UserToCreate[] = [];
  const errors: string[] = [];
  rows.slice(1).forEach((row, index) => {
    if (row.every(value => !value.trim())) return;
    const username = row[positions.username]?.trim();
    const rawTotp = row[positions.totp_forced]?.trim().toLowerCase();
    if (!username) return void errors.push(`Line ${index + 2}: username is required.`);
    if (rawTotp && !['true', 'false', '1', '0', 'yes', 'no'].includes(rawTotp))
      return void errors.push(`Line ${index + 2}: totp_forced must be true or false.`);
    users.push({
      username,
      email: optionalValue(row[positions.email]),
      firstname: optionalValue(row[positions.firstname]),
      lastname: optionalValue(row[positions.lastname]),
      totp_forced: ['true', '1', 'yes'].includes(rawTotp || ''),
    });
  });
  return { users, errors };
}

function optionalValue(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function escapeCsvValue(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    if (character === '"') {
      if (quoted && content[index + 1] === '"') {
        value += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(value);
      value = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && content[index + 1] === '\n') index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
    } else value += character;
  }
  if (value || row.length) rows.push([...row, value]);
  return rows;
}
</script>

<style scoped lang="scss">
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: $font-ui;
}

header p,
.section-heading p,
.queue-count,
.toggle-row small {
  color: var(--text-muted);
  font-size: 0.88rem;
}

.manual-form,
.import-section {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--background-100);
}
.manual-form,
.import-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.required {
  color: var(--red);
}
.manual-actions,
.section-heading,
footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.toggle-row {
  flex-direction: row;
  align-items: center;
}
.toggle-row span {
  display: flex;
  flex-direction: column;
}
.upload-button {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  padding: 8px;
  border: 1px solid var(--primary);
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.upload-button input {
  display: none;
}
.csv-format {
  margin: 0;
}
textarea {
  box-sizing: border-box;
  min-height: 150px;
  padding: 0.65rem;
  resize: vertical;
  font-family: monospace;
  font-size: 0.82rem;
  line-height: 1.45;
}

.queue-count {
  min-height: 1.25rem;
}
footer {
  justify-content: flex-end;
}
.progress {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
@media screen and (width <= 560px) {
  .fields {
    grid-template-columns: 1fr;
  }
  .manual-actions,
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
