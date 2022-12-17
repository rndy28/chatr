describe("auth", () => {
  it("user can signup", () => {
    cy.visit("signup");
    cy.findByLabelText(/username/i).type("ramadhan");
    cy.findByLabelText(/password/i).type("123456");
    cy.findByRole("button", { name: /Sign Up/i }).click();

    cy.findByTestId(/profile-picture/i).click();

    // const usernameInput = cy.findAllByLabelText(/username/i);

    cy.get("input[name='username']").should("have.value", "ramadhan");
  });

  it("user can signin", () => {
    cy.visit("signin");
    cy.findByLabelText(/username/i).type("ramadhan");
    cy.findByLabelText(/password/i).type("123456");
    cy.findByRole("button", { name: /Sign In/i }).click();

    cy.findByTestId(/profile-picture/i).click();

    // const usernameInput = cy.findAllByLabelText(/username/i);

    cy.get("input[name='username']").should("have.value", "ramadhan");
  });

  it("should throw error, invalid password", () => {
    cy.visit("signin");
    cy.findByLabelText(/username/i).type("ramadhan");
    cy.findByLabelText(/password/i).type("1234");
    cy.findByRole("button", { name: /Sign In/i }).click();

    cy.findByTestId("password-error").should("exist").and("have.text", "password is invalid");
  });

  it("should throw error, user not found", () => {
    cy.visit("signin");
    cy.findByLabelText(/username/i).type("rndy");
    cy.findByLabelText(/password/i).type("123456");
    cy.findByRole("button", { name: /Sign In/i }).click();

    cy.findByTestId("username-error").should("exist").and("have.text", "User not found");
  });

  it("should throw error, user already exist", () => {
    cy.visit("signup");
    cy.findByLabelText(/username/i).type("ramadhan");
    cy.findByLabelText(/password/i).type("123456");
    cy.findByRole("button", { name: /Sign Up/i }).click();

    cy.findByTestId("username-error").should("exist").and("have.text", "username already exists");
  });
});

export {};
