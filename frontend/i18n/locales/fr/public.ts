export default {
  nav: {
    login: 'Connexion',
    signup: "S'inscrire",
    home: 'Accueil',
  },
  login: {
    title: 'Connexion',
    form: {
      username: "Nom d'utilisateur",
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      submit: 'Se connecter',
    },
    disabled: "La connexion native est actuellement désactivée. Veuillez utiliser l'un des fournisseurs d'authentification disponibles ci-dessous.",
    needAccount: "Besoin d'un compte ? S'inscrire",
    forgotPassword: 'Mot de passe oublié ?',
    clickHere: 'Cliquez ici',
    OTP_2FA: {
      title: 'Authentification à deux facteurs',
      description: "Veuillez saisir le code à 6 chiffres de votre application d'authentification.",
      code: "Code d'authentification",
      submit: 'Vérifier',
      back: 'Retour',
    },
    reset: {
      title: 'Réinitialiser le mot de passe',
      submit: 'Demander la réinitialisation',
      change: 'Modifier le mot de passe',
      havingIssues: 'Vous rencontrez des problèmes ?',
      contactUs: 'Contactez-nous !',
      done: {
        title: 'Instructions envoyées',
        description:
          "Consultez votre boîte de réception pour trouver le lien de réinitialisation de votre mot de passe. S'il n'apparaît pas dans quelques minutes, vérifiez votre dossier de courrier indésirable.",
        returnToLogin: 'Retour à la page de connexion',
      },
    },
    oidc: {
      title: 'Authentification en cours...',
      description: 'Veuillez patienter pendant que nous finalisons votre connexion.',
      linked: 'Votre compte {{ providerName }} a été lié avec succès.',
      created: 'Votre compte a été créé et lié avec succès.',
      signIn: 'Vous vous êtes connecté avec succès.',
      redirectSettings: 'Redirection vers les paramètres...',
      redirectDashboard: 'Redirection vers le tableau de bord...',
      error: "Échec de l'authentification",
      tryAgain: 'Réessayer',
      createAccount: 'Créer un compte',
    },
  },
  signup: {
    title: 'Création de compte',
    form: {
      username: "Nom d'utilisateur",
      email: 'Adresse e-mail',
      emailDescription: "L'adresse e-mail est uniquement utilisée pour la récupération de compte. Elle ne sera pas partagée publiquement.",
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      submit: "S'inscrire",
    },
    alreadyHaveAccount: 'Vous avez déjà un compte ? Se connecter',
  },
};
