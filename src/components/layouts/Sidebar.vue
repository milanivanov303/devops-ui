<template>
  <ul id="nav-mobile" class="sidenav sidenav-fixed">
    <li class="logo">
      <a id="logo-container" class="brand-logo">
        <img src="../../assets/images/logo.png" alt="DevOps Management" />
      </a>
    </li>
    <li class="active">
      <router-link to="/">
        <i class="material-icons">laptop_chromebook</i> Dashboard
      </router-link>
      <router-link to="/extranet">
        <i class="material-icons">apps</i> Extranet
      </router-link>
      <router-link to="/demo">
        <i class="material-icons">event</i> Demo
      </router-link>
    </li>
  </ul>
</template>
