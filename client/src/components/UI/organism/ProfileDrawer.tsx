import { IconCheck, IconPencil } from "@tabler/icons";
import { deleteUserProfilePicture, updateUserProfile } from "api";
import Drawer from "components/templates/Drawer";
import Error from "components/UI/atoms/Error";
import Input from "components/UI/atoms/Input";
import Label from "components/UI/atoms/Label";
import Profile from "components/UI/atoms/Profile";
import Menu from "components/UI/molecules/Menu";
import { AnimatePresence, motion } from "framer-motion";
import { inputIconVariant } from "libs/animation";
import { ASSETS_PATH } from "libs/constants";
import { useUser } from "libs/contexts/UserContext";
import { localStorageSet } from "libs/helpers";
import { useContextMenu } from "libs/hooks/useContextMenu";
import { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { Flex } from "../atoms/shared";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin-inline: auto;
`;

const Group = styled.div`
  width: 85%;
`;

const IconContainer = styled(motion.div)`
  cursor: pointer;
  color: #707888;
  position: absolute;
  right: 0;
`;

type Props = {
  onClose: () => void;
};

const ProfileDrawer = ({ onClose }: Props) => {
  const { user, setUser } = useUser();
  const [updatedUser, setUpdatedUser] = useState(user!);
  const [inputFieldFocus, setInputFieldFocus] = useState({
    username: false,
    status: false,
  });
  const [errors, setErrors] = useState({
    profile: "",
    username: "",
    status: "",
  });
  const [thumbnailProfile, setThumbnailProfile] = useState<string | null>(
    user!.profile ? ASSETS_PATH + user!.profile : null
  );

  const formRef = useRef<HTMLFormElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | HTMLImageElement | null>(null);
  const initialIconAnimation = useRef({
    username: "visible",
    status: "visible",
  });
  const [anchorPoint, show] = useContextMenu(profileRef, menuRef);

  const onFocus = (name: keyof typeof inputFieldFocus) => {
    return () => {
      if (name === "username") {
        setInputFieldFocus((prev) => ({
          ...prev,
          username: true,
        }));
      } else {
        setInputFieldFocus((prev) => ({
          ...prev,
          status: true,
        }));
      }
    };
  };

  const onSave = (name: keyof typeof inputFieldFocus) => {
    return async () => {
      if (!formRef.current) return;

      const formData = new FormData(formRef.current);

      if (name === "username") {
        setErrors((prev) => ({
          ...prev,
          username: "",
        }));
        setInputFieldFocus((prev) => ({
          ...prev,
          username: false,
        }));
        initialIconAnimation.current.username = "hidden";
      } else {
        setErrors((prev) => ({
          ...prev,
          status: "",
        }));

        setInputFieldFocus((prev) => ({
          ...prev,
          status: false,
        }));
        initialIconAnimation.current.status = "hidden";
      }

      if (!updatedUser.username || !updatedUser.status) return;
      if (
        user!.username === updatedUser.username &&
        user!.status === updatedUser.status
      )
        return;

      const res = await updateUserProfile(formData);

      if (res.status === 200) {
        setUser(res.data);
        localStorageSet("user", res.data);
      }
    };
  };

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    },
    [updatedUser]
  );

  const onImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        const fileSize = file.size / 1024 / 1024;

        if (file.type.includes("image")) {
          if (fileSize > 2) {
            setThumbnailProfile((prev) => prev ?? null);
            setErrors((prev) => ({
              ...prev,
              profile: "Image size should be less than 2MB",
            }));
          } else {
            setThumbnailProfile(URL.createObjectURL(file));
            setErrors((prev) => ({
              ...prev,
              profile: "",
            }));

            const formData = new FormData();
            formData.append("profile", file);
            const res = await updateUserProfile(formData);
            if (res.status === 200) {
              setUser(res.data);
              localStorageSet("user", res.data);
            }
          }
        } else {
          setThumbnailProfile((prev) => prev ?? null);
          setErrors((prev) => ({
            ...prev,
            profile: "Please select an image file",
          }));
        }
      }
    },
    [updatedUser]
  );

  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSave(e.currentTarget.name as keyof typeof inputFieldFocus);
      }
    },
    [inputFieldFocus, updatedUser]
  );

  const removeProfile = useCallback(async () => {
    setThumbnailProfile(null);

    const res = await deleteUserProfilePicture();

    if (res.status === 200) {
      setUser(res.data);
      localStorageSet("user", res.data);
    }
  }, [updatedUser]);

  return (
    <Drawer title="Profile" onHide={onClose}>
      <Form ref={formRef}>
        <Flex direction="column" alignItems="center">
          {thumbnailProfile ? (
            <Profile
              picture={thumbnailProfile}
              ref={profileRef}
              className="profile"
              css={`
                width: 13rem;
                height: 13rem;
              `}
            />
          ) : (
            <Profile
              ref={profileRef}
              className="profile"
              css={`
                width: 13rem;
                height: 13rem;
              `}
            />
          )}
          {errors.profile && (
            <Error
              css={`
                position: relative;
                right: 2rem;
                top: 0.7rem;
              `}
            >
              {errors.profile}
            </Error>
          )}
          <span
            css={`
              font-size: 0.813rem;
              display: inline-block;
              margin-top: 1rem;
              text-align: center;
              max-width: 15rem;
              color: #f0513c;
            `}
          >
            note: iam disabling profile feature because i cant pay for aws s3 to store
            the images
          </span>
          <AnimatePresence>
            {show && (
              <Menu menuRef={menuRef} anchorPoint={anchorPoint}>
                <Label>
                  <Menu.Item>upload profile</Menu.Item>
                  <input
                    type="file"
                    name="profile"
                    onChange={onImageChange}
                    disabled
                    css={`
                      display: none;
                    `}
                  />
                </Label>
                <Menu.Item onClick={removeProfile}>remove profile</Menu.Item>
              </Menu>
            )}
          </AnimatePresence>
        </Flex>

        <Group
          css={`
            margin-block: 3rem 1rem;
            & > div {
              position: relative;
              border-color: ${!inputFieldFocus.username && "transparent"};
            }
          `}
        >
          <Label
            htmlFor="username"
            css={`
              color: #5e81ac;
            `}
          >
            username
          </Label>
          <Input
            id="username"
            name="username"
            autoComplete="off"
            elementSize="md"
            variant="neutral"
            withIcon={{ position: "right" }}
            placeholder="type your username"
            value={updatedUser.username}
            aria-errormessage="username-error"
            aria-invalid={errors.username ? true : false}
            onChange={onChange}
            onKeyDown={onEnter}
            ref={(ref) => inputFieldFocus.username && ref?.focus()}
            css={`
              color: #4c566a;
            `}
          >
            <AnimatePresence>
              {inputFieldFocus.username ? (
                <IconContainer
                  variants={inputIconVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  role="button"
                  onClick={onSave("username")}
                  key="save"
                >
                  <IconCheck />
                </IconContainer>
              ) : (
                <IconContainer
                  variants={inputIconVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  role="button"
                  onClick={onFocus("username")}
                  key="edit"
                >
                  <IconPencil />
                </IconContainer>
              )}
            </AnimatePresence>
          </Input>
          {errors.username && (
            <Error id="username-error">{errors.username}</Error>
          )}
        </Group>
        <Group
          css={`
            & > div {
              position: relative;
              border-color: ${!inputFieldFocus.status && "transparent"};
            }
          `}
        >
          <Label
            htmlFor="status"
            css={`
              color: #5e81ac;
            `}
          >
            status
          </Label>
          <Input
            id="status"
            name="status"
            autoComplete="off"
            elementSize="md"
            variant="neutral"
            withIcon={{ position: "right" }}
            placeholder="type your status"
            value={updatedUser.status}
            aria-errormessage="status-error"
            aria-invalid={errors.status ? true : false}
            onChange={onChange}
            onKeyDown={onEnter}
            ref={(ref) => inputFieldFocus.status && ref?.focus()}
            css={`
              color: #4c566a;
            `}
          >
            <AnimatePresence>
              {inputFieldFocus.status ? (
                <IconContainer
                  variants={inputIconVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  role="button"
                  onClick={onSave("status")}
                  key="save"
                >
                  <IconCheck />
                </IconContainer>
              ) : (
                <IconContainer
                  variants={inputIconVariant}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  role="button"
                  onClick={onFocus("status")}
                  key="edit"
                >
                  <IconPencil />
                </IconContainer>
              )}
            </AnimatePresence>
          </Input>
          {errors.status && <Error id="status-error">{errors.status}</Error>}
        </Group>
      </Form>
    </Drawer>
  );
};

export default ProfileDrawer;
