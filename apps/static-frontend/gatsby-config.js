module.exports = {
  siteMetadata: {
    title: `static-frontend`,
    description: `Static site for the card game Who Said True.`,
  },
  plugins: [
    `gatsby-plugin-postcss`,
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        svgo: false,
        ref: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: require.resolve(`gatsby-plugin-styled-components`),
      options: {
        pure: true,
      },
    },

    `gatsby-transformer-sharp`,
    {
      resolve: require.resolve(`@nrwl/gatsby/plugins/nx-gatsby-ext-plugin`),
      options: {
        path: __dirname,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `static-frontend`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logo.svg`,
      },
    },

    {
      resolve: require.resolve('gatsby-plugin-purgecss'),
      options: {
        tailwind: true,
        purgeOnly: ["src/styles.css"],
      },
    },
  ],
};
