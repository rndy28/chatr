/* eslint-disable no-useless-return */
/* eslint-disable react/jsx-one-expression-per-line */
import { IconEye, IconEyeOff } from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { signin } from "~/api";
import { Button, Error, Input, Label } from "~/components/UI";
import { useRoot } from "~/contexts/RootContext";
import { localStorageSet } from "~/helpers";
import useChangePasswordType from "~/hooks/useChangePasswordType";
import { Container, Form, Group, SmallText } from "./style";

const SignIn = () => {
  const [passwordType, togglePasswordType] = useChangePasswordType();
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [authUser, setAuthUser] = useState({
    username: "",
    password: "",
  });
  const { mutateAsync, isLoading } = useMutation(signin);

  const { setUser, socket } = useRoot();

  const isSubmitted = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    isSubmitted.current = true;

    validate();

    try {
      const { data } = await mutateAsync(authUser);
      const user = {
        username: data.username,
        status: data.status,
        profile: data.profile,
      };
      localStorageSet("token", data.token);
      localStorageSet("user", user);

      socket.auth = {
        token: data.token,
      };
      socket.connect();
      setUser(user);
    } catch (error: any) {
      const field = error.data?.field;
      const message = error.data?.message;

      setErrors((prev) => ({
        ...prev,
        [field]: message,
      }));
    } finally {
      isSubmitted.current = false;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (authUser.username.length === 0) {
      setErrors((prev) => ({
        ...prev,
        username: "username is required",
      }));

      return;
    } else if (authUser.username.length > 0 && authUser.username.length < 3) {
      setErrors((prev) => ({
        ...prev,
        username: "username should have at least 3+ characters",
      }));

      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        username: "",
      }));
    }

    if (authUser.password === "") {
      setErrors((prev) => ({
        ...prev,
        password: "password is required",
      }));

      return;
    } else if (authUser.password.length < 3) {
      setErrors((prev) => ({
        ...prev,
        password: "password should have at least 3+ characters",
      }));

      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  useEffect(() => {
    if (isSubmitted.current) {
      validate();
    }
  }, [authUser]);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Group>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            size="lg"
            variant="primary"
            aria-invalid={!!errors.username}
            aria-errormessage="username-error"
            onChange={onChange}
          />
          {errors.username && (
            <Error id="username-error" data-testid="username-error">
              {errors.username}
            </Error>
          )}
        </Group>
        <Group>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            size="lg"
            variant="primary"
            type={passwordType}
            aria-invalid={!!errors.password}
            aria-errormessage="password-error"
            icon={{
              position: "right",
              element:
                passwordType === "password" ? (
                  <IconEye
                    color="#4C566A"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={togglePasswordType}
                  />
                ) : (
                  <IconEyeOff
                    color="#4C566A"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={togglePasswordType}
                  />
                ),
            }}
            onChange={onChange}
          />
          {errors.password && (
            <Error id="password-error" data-testid="password-error">
              {errors.password}
            </Error>
          )}
        </Group>
        <Button
          size="lg"
          variant="secondary"
          loading={isLoading}
          css={`
            max-width: 100%;
          `}
        >
          Sign In
        </Button>
        <SmallText>
          Dont have an account? <Link to="/signup">Sign Up</Link>
        </SmallText>
      </Form>
    </Container>
  );
};

export default SignIn;
