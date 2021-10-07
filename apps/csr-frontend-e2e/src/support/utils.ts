export const isMobile = () => {
    return Cypress.config("viewportWidth") < 640; // tailwind sm breakpoint
};