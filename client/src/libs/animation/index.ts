import { Variants } from "framer-motion";

const drawerVariant: Variants = {
  hidden: {
    opacity: 0,
    x: "-100%",
    zIndex: -1,
  },
  visible: {
    opacity: 1,
    x: 0,
    zIndex: 2000,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: "-100%",
    transition: {
      type: "tween",
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

const modalVariant: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const formInModalVariant: Variants = {
  hidden: {
    opacity: 0,
    y: "150%",
    zIndex: -1,
  },
  visible: {
    opacity: 1,
    y: 0,
    zIndex: 2000,
    transition: {
      type: "tween",
      ease: [0.6, 0.05, -0.01, 0.9],
      duration: 0.4,
    },
  },
};

const mainVariant: Variants = {
  hidden: {
    opacity: 0,
    y: -100,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const inputIconVariant: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  hidden: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export {
  drawerVariant,
  modalVariant,
  formInModalVariant,
  mainVariant,
  inputIconVariant,
};
