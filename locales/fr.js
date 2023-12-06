export default {
  roleNames: {
    tender_owner: "Acheteur",
    application: "Bidder",
    jury_member: "Membre du comité d'évaluation",
  },
  layouts: {
    appHeader: {
      tendersLink: "Tenders",
      createTenderButton: "Créer un appel d'offres",
    },
  },
  components: {
    account: {
      menu: {
        itemsMap: {
          account: "Compte",
          tenders: "Mes appels d'offres",
          winners: "Soumissionnaires gagnants",
          offres: "Offres soumises",
          estimation: "Estimation",
          settings: "Paramètres",
        },
        logOutButton: "Log Out",
      },
    },
  },
};
