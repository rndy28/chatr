describe("contact", () => {
  // run auth spec first or else this test will fail
  it("new user can add contact", () => {
    cy.visit("signup");
    cy.findByLabelText(/username/i).type("farhan");
    cy.findByLabelText(/password/i).type("123456");
    cy.findByRole("button", { name: /Sign Up/i }).click();

    cy.findByTestId("options-icon").click();

    cy.findByText(/New Contact/i).click();

    cy.findByLabelText(/username/i).type("ramadhan");

    cy.findByTestId("username-error").should("not.exist");
  });
});

export {};
