import React, { useEffect, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Stack from "@mui/material/Stack";
import Dialog from ".";
import { Button } from "@mui/material";
export default {
  title: "Example/Dialog",
  component: Dialog,
  argTypes: {
    confirm: { table: { category: "operating options" } },
    visible: { table: { category: "operating options" } },
    close: { table: { category: "operating options" } },
    backdropClose: { table: { category: "operating options" } },
    fullScreen: { table: { category: "operating options" } },
    mobileFullScreen: { table: { category: "operating options" } },
    mobileVertical: { table: { category: "operating options" } },
    title: { table: { category: "operating options" } },
    content: { table: { category: "operating options" } },
    contentComponent: { table: { category: "operating options" } },
    loading: { table: { category: "operating options" } },
    confirmVariant: { table: { category: "operating options" } },
    confirmColor: { table: { category: "operating options" } },
    confirmText: { table: { category: "operating options" } },
    cancelVariant: { table: { category: "operating options" } },
    cancelColor: { table: { category: "operating options" } },
    cancelText: { table: { category: "operating options" } },
    maxWidth: { table: { category: "operating options" } },
    overrideTheme: { table: { category: "global default" } },
    dialogBorder: { table: { category: "global default" } },
    actionFullWidth: { table: { category: "global default" } },
    actionColumn: { table: { category: "global default" } },
    actionColumnReverse: { table: { category: "global default" } },
    buttonSize: { table: { category: "global default" } },
    onClose: { table: { category: "global default" } },
    onConfirm: { table: { category: "global default" } },
    onCancel: { table: { category: "global default" } },
  },
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = (args: any) => {
  const [visible, setVisible] = useState<boolean>(args.visible);
  const visibleHandler = () => {
    setVisible((currentValue) => !currentValue);
  };

  return (
    <Stack spacing={2} maxWidth={300}>
      <Button variant="contained" size="small" onClick={visibleHandler}>
        Open
      </Button>

      <Dialog {...args} visible={visible} onClose={visibleHandler} onConfirm={visibleHandler} onCancel={visibleHandler} />
    </Stack>
  );
};

export const Playground = Template.bind({});
Playground.args = {
  close: true,
  backdropClose: true,
  confirm: true,
  content: "Content",
  title: "Title",
  dialogBorder: true,
  actionFullWidth: true,
  actionColumn: true,
  actionColumnReverse: false,
  buttonSize: "large",
};
