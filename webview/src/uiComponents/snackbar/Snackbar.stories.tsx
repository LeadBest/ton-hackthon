import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Stack from "@mui/material/Stack";

import Snackbar, { SnackbarProps } from ".";
import { Button } from "@mui/material";

export default {
  title: "Example/Snackbar",
  component: Snackbar,
  argTypes: {
    visible: {
      name: "visible",
      defaultValue: false,
      description: "If `true`, the component is visible.",
      table: {
        category: "operating options",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
      control: {
        type: "boolean",
      },
    },
    close: {
      name: "close",
      defaultValue: false,
      description: "If `true`, the component will show close button.",
      table: {
        category: "operating options",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
      control: {
        type: "boolean",
      },
    },
    variant: {
      name: "variant",
      description: "Used to easily display different variant of component.",
      table: {
        category: "operating options",
        type: { summary: "string" },
        defaultValue: { summary: "default" },
      },
      options: ["default", "success", "error", "warning", "info"],
      control: { type: "select" },
    },
    anchorOrigin: {
      name: "anchorOrigin",
      description: "The anchor of the component.\n\nIt will cover defaultAnchorOrigin.",
      table: {
        category: "operating options",
        type: { summary: "object", detail: "vertical: `bottom` || `top` horizontal: `left` || `right`" },
        defaultValue: { summary: "object", detail: "{ horizontal: left, vertical: bottom }" },
      },
    },
    icon: {
      name: "icon",
      description: "The icon of the component.can use this link to get more icon tag https://fonts.google.com/icons",
      table: {
        category: "operating options",
        type: { summary: "string" },
      },
      control: { type: "text" },
    },
    content: {
      name: "content",
      description: "The content of the component.",
      table: {
        category: "operating options",
        type: { summary: "string" },
        defaultValue: { summary: "" },
      },
      type: { name: "string", required: true },
      control: { type: "text" },
    },
    snackbarComponent: {
      name: "snackbarComponent",
      description: "Replace the snackbar. Callback used for displaying entirely customized snackbar.",
      table: {
        category: "operating options",
        type: { summary: "React.ReactNode | ((key: SnackbarKey) => React.ReactNode)" },
      },
    },
    action: {
      name: "action",
      description: "Callback used for getting action(s). actions are mostly buttons displayed in Snackbar.",
      table: {
        category: "operating options",
        type: { summary: "React.ReactNode | ((key: SnackbarKey) => React.ReactNode)" },
      },
    },
    persist: {
      name: "persist",
      defaultValue: false,
      description: "Snackbar stays on the screen, unless it is dismissed (programmatically or through user interaction).",
      table: {
        category: "operating options",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
      control: {
        type: "boolean",
      },
    },
    preventDuplicate: {
      name: "preventDuplicate",
      defaultValue: false,
      description: "Ignores displaying multiple snackbars with the same `message`",
      table: {
        category: "operating options",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
      control: {
        type: "boolean",
      },
    },
    hideIconVariant: {
      name: "hideIconVariant",
      defaultValue: false,
      description: "Hides iconVariant if set to `true`.",
      table: {
        category: "operating options",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
      control: {
        type: "boolean",
      },
    },
    autoHideDuration: {
      name: "autoHideDuration",
      defaultValue: 3000,
      description:
        "The number of milliseconds to wait before automatically calling the`onClose` function.\n\n By default snackbars get closed after 5000 milliseconds.\n\nSet autoHideDuration to 'null' if you don't want snackbars to automatically close.\n\nAlternatively pass `persist: true` in the options parameter of enqueueSnackbar.\n\nIt will cover defaultAutoHideDuration.",
      table: {
        category: "operating options",
        type: { summary: "number" },
        defaultValue: { summary: 5000 },
      },
      control: {
        type: "number",
      },
    },
    onlyUseDefaultBackground: {
      name: "onlyUseDefaultBackground",
      defaultValue: false,
      description: "If `true`, the component will only use default background.",
      table: {
        category: "global default",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
      control: {
        type: "boolean",
      },
    },
    defaultAnchorOrigin: {
      name: "defaultAnchorOrigin",
      description: "he default anchor of the component.\n\nIt will covered by anchorOrigin.",
      table: {
        category: "global default",
        type: { summary: "object", detail: "vertical: `bottom` || `top` horizontal: `left` || `right`" },
        defaultValue: { summary: "object", detail: "{ horizontal: left, vertical: bottom }" },
      },
    },
    defaultAutoHideDuration: {
      name: "defaultAutoHideDuration",
      defaultValue: 3000,
      description:
        "The number of milliseconds to wait before automatically calling the `onClose` function.\n\n By default snackbars get closed after 5000 milliseconds.\n\nSet autoHideDuration to 'null' if you don't want snackbars to automatically close.\n\nAlternatively pass `persist: true` in the options parameter of enqueueSnackbar.\n\nIt will covered by autoHideDuration.",
      table: {
        category: "global default",
        type: { summary: "number" },
        defaultValue: { summary: 5000 },
      },
      control: {
        type: "number",
      },
    },
    contentColor: {
      name: "contentColor",
      description: "he color of the component content.",
      table: {
        category: "global default",
        type: { summary: "string" },
        defaultValue: { summary: "#fff" },
      },
      control: { type: "color" },
    },
    onClose: {
      name: "onClose",
      description: "Callback on snackbar Exited.",
      table: {
        category: "global default",
        type: { summary: "func", detail: "(event: React.SyntheticEvent<any> | null, reason: CloseReason, key?: SnackbarKey) => void" },
      },
    },
    overrideTheme: {
      name: "overrideTheme",
      description: "Overrides the default theme.",
      table: {
        category: "global default",
        type: { summary: "theme", detail: "Partial<Theme> | ((outerTheme: Theme) => Theme)" },
      },
    },
  },
} as ComponentMeta<typeof Snackbar>;

const Template: ComponentStory<typeof Snackbar> = (args: any) => {
  const [visible, setVisible] = useState<boolean>(args.visible);

  const visibleHandler = () => {
    setVisible((currentValue) => !currentValue);
  };

  return (
    <Stack spacing={2} maxWidth={300}>
      <Button variant="contained" size="small" onClick={visibleHandler}>
        Open
      </Button>

      <Snackbar {...args} visible={visible} onClose={visibleHandler} />
    </Stack>
  );
};

export const Playground = Template.bind({});
Playground.args = {
  variant: "success",
  content: "註冊成功",
  visible: false,
  close: false,
  anchorOrigin: {
    vertical: "top",
    horizontal: "right",
  },

  onlyUseDefaultBackground: false,
  defaultAnchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  defaultAutoHideDuration: 3000,
  contentColor: "#fff",
};
