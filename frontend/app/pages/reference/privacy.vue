<template>
	<div class="container">
	    <AppHeader />

  <article
    class="markdown-preview modern-theme document-content"
    style="font-size: 16px; font-family: Poppins; line-height: 1.5"
  >
    <h1 id="privacy-policy---alexandrie" tabindex="-1">
      <a class="header-anchor" href="#privacy-policy---alexandrie" aria-hidden="true">#</a> Privacy Policy - Alexandrie
    </h1>
    <h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
    <p>
      Alexandrie is an open-source project. We care about your privacy and only collect the data necessary to make the platform work. This policy explains what
      information we collect, how we use it, and your rights as a user.
    </p>
    <h2 id="data-we-collect" tabindex="-1"><a class="header-anchor" href="#data-we-collect" aria-hidden="true">#</a> Data We Collect</h2>
    <ul>
      <li>
        <strong>Account information</strong>: To create an account, we require a unique username and a password. You can choose any username — it does not need
        to be linked to your real identity.
      </li>
      <li>
        <strong>Optional personal details</strong>: You may choose to provide an avatar, first name, last name, or email address (for password recovery). None
        of these are required.
      </li>
      <li><strong>Login data</strong>: For security and maintenance, we store standard session information such as IP address, login dates, and times.</li>
      <li>
        <strong>External login</strong>: Depending on configuration, users may log in via an external OIDC provider. In this case, some basic profile
        information may be shared from that provider.
      </li>
    </ul>
    <h2 id="how-we-use-your-data" tabindex="-1"><a class="header-anchor" href="#how-we-use-your-data" aria-hidden="true">#</a> How We Use Your Data</h2>
    <ul>
      <li>To allow you to log in and use the platform.</li>
      <li>To manage sessions and maintain security.</li>
      <li>To personalize your interface if you choose to provide optional details.</li>
      <li>To help you recover your account if you provided an email.</li>
    </ul>
    <h2 id="your-rights" tabindex="-1"><a class="header-anchor" href="#your-rights" aria-hidden="true">#</a> Your Rights</h2>
    <ul>
      <li><strong>Account deletion</strong>: You can delete your account at any time. All your data will be removed.</li>
      <li><strong>Data export</strong>: You can request a backup of your data at any time.</li>
      <li><strong>Optional data</strong>: You are not required to provide personal details beyond the username and password.</li>
    </ul>
    <h2 id="security" tabindex="-1"><a class="header-anchor" href="#security" aria-hidden="true">#</a> Security</h2>
    <p>We take reasonable measures to protect your data. Passwords are stored securely, and session data is handled with standard security practices.</p>
    <h2 id="changes-to-this-policy" tabindex="-1"><a class="header-anchor" href="#changes-to-this-policy" aria-hidden="true">#</a> Changes to This Policy</h2>
    <p>Since Alexandrie is an open-source project, this policy may be updated occasionally. We recommend checking this page periodically for updates.</p>
    <h2 id="contact-%26-code-source" tabindex="-1">
      <a class="header-anchor" href="#contact-%26-code-source" aria-hidden="true">#</a> Contact &amp; Code source
    </h2>
    <p>If you have questions about the application you can contact us by email: <a href="mailto:contact@alexandrie-hub.fr">contact@alexandrie-hub.fr</a></p>
    <p>Code source of the application is available here: <a href="https://github.com/Smaug6739/Alexandrie">https://github.com/Smaug6739/Alexandrie</a>.</p>
  </article>
	
	<AppFooter />
	</div>
</template>


<script setup lang="ts">
import AppFooter from './_components/AppFooter.vue';
import AppHeader from './_components/AppHeader.vue';

</script>

<style scoped>
.container {
  display: flex;
  width: 95%;
  margin: 0 auto;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 1.5rem;
}

article {
	max-width: 1000px;
	margin: 2rem auto 0 auto;
}
</style>