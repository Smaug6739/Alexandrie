export default {
  nav: {
    login: 'Einloggen',
    signup: 'Registrieren',
    home: 'Startseite',
  },
  login: {
    title: 'Anmeldung',
    form: {
      username: 'Benutzername',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      submit: 'Einloggen',
    },
    disabled: 'Die lokale Anmeldung ist derzeit deaktiviert. Bitte nutzen Sie einen der unten verfügbaren Authentifizierungsanbieter.',
    needAccount: 'Benötigen Sie ein Konto? Registrieren',
    forgotPassword: 'Passwort vergessen?',
    clickHere: 'Hier klicken',
    OTP_2FA: {
      title: 'Zwei-Faktor-Authentisierung',
      description: 'Bitte geben Sie den 6-stelligen Code aus Ihrer Authentifikator-App ein.',
      code: 'Authentifizierungscode',
      submit: 'Verifizieren',
      back: 'Zurück',
    },
    reset: {
      title: 'Passwort zurücksetzen',
      submit: 'Zurücksetzung anfordern',
      change: 'Passwort ändern',
      havingIssues: 'Haben Sie Probleme?',
      contactUs: 'Kontaktieren Sie uns!',
      done: {
        title: 'Anweisungen gesendet',
        description:
          'Überprüfen Sie Ihre E-Mails auf einen Link zum Zurücksetzen Ihres Passworts. Wenn dieser nicht innerhalb weniger Minuten erscheint, überprüfen Sie Ihren Spam-Ordner.',
        returnToLogin: 'Zurück zum Login',
      },
    },
    oidc: {
      title: 'Authentifizierung...',
      description: 'Bitte warten Sie, während wir Ihre Anmeldung abschließen.',
      linked: 'Ihr {{ providerName }}-Konto wurde erfolgreich verknüpft.',
      created: 'Ihr Konto wurde erfolgreich erstellt und verknüpft.',
      signIn: 'Sie wurden erfolgreich angemeldet.',
      redirectSettings: 'Weiterleitung zu den Einstellungen...',
      redirectDashboard: 'Weiterleitung zum Dashboard...',
      error: 'Authentifizierung fehlgeschlagen',
      tryAgain: 'Erneut versuchen',
      createAccount: 'Konto erstellen',
    },
  },
  signup: {
    title: 'Kontoerstellung',
    form: {
      username: 'Benutzername',
      email: 'E-Mail',
      emailDescription: 'Die E-Mail-Adresse wird nur zur Kontowiederherstellung verwendet und wird nicht öffentlich geteilt.',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      submit: 'Registrieren',
    },
    alreadyHaveAccount: 'Haben Sie bereits ein Konto? Einloggen',
  },
};
