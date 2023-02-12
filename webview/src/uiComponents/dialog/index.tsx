import React from "react";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  CircularProgress,
  Icon,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme, Theme, useTheme } from "@mui/material/styles";

export type DialogProps = {
  /**
   * If `true`, default content will have cancel button & confirm button.
   * @default false
   */
  confirm?: boolean | undefined;
  /**
   * If `true`, the component is visible.
   * @default false
   */
  visible?: boolean;
  /**
   * If `true`, the close button is visible.
   * @default false
   */
  close?: boolean;
  /**
   * If `true`, the component can click backdrop to close.
   * @default false
   */
  backdropClose?: boolean;
  /**
   * If `true`, the component is fullScreen.
   * @default false
   */
  fullScreen?: boolean | undefined;
  /**
   * If `true`, the component in mobile is fullScreen.
   * @default false
   */
  mobileFullScreen?: boolean | undefined;
  /**
   * the position of the component in mobile
   * @default center
   */
  mobileVertical?: "flex-start" | "center" | "flex-end";
  /**
   * The title of the component.
   */
  title?: string | React.FC;
  /**
   * The content of the component.
   * It have action buttons.
   * If set this don't set contentComponent.
   */
  content?: string | React.FC;
  /**
   * The content of the component.
   * It don't have action buttons.
   * If set this don't set content.
   */
  contentComponent?: React.FC;
  /**
   * If `true`, default action buttons will be disabled and confirm button will show CircularProgress.
   * @default false
   */
  loading?: boolean | undefined;
  /**
   * The Variant of the confirm button.
   * @default contained
   */
  confirmVariant?: "contained" | "outlined";
  /**
   * The Color of the confirm button.
   * @default primary
   */
  confirmColor?: "primary" | "secondary";
  /**
   * The Text of the confirm button.
   */
  confirmText?: string;
  /**
   * The Variant of the cancel button.
   * @default outlined
   */
  cancelVariant?: "contained" | "outlined";
  /**
   * The Color of the cancel button.
   * @default secondary
   */
  cancelColor?: "primary" | "secondary";
  /**
   * The Text of the cancel button.
   */
  cancelText?: string;
  /**
   * The maxWidth of the component.
   * @default sm
   */
  maxWidth?: "xs" | "sm" | "md" | "lg";
  /**
   * This can override component style.
   */
  overrideTheme?: Theme;
  /**
   * If `true`, the component will have border.
   * @default false
   */
  dialogBorder?: boolean;
  /**
   * If `true`, the component will have border.
   * @default false
   */
  actionFullWidth?: boolean;
  /**
   * If `true`, the action buttons will column.
   * @default false
   */
  actionColumn?: boolean;
  /**
   * If `true`, the action buttons will column reverse.
   * If actionColumn is true this will fail.
   * @default false
   */
  actionColumnReverse?: boolean;
  /**
   * The size of the buttons.
   * @default medium
   */
  buttonSize?: "large" | "medium" | "small";
  /**
   * The close action of the component.
   */
  onClose(): void;
  /**
   * The confirm action of the component.
   */
  onConfirm(): void;
  /**
   * The cancel action of the component.
   */
  onCancel(): void;
};

export const Dialog = (props: DialogProps) => {
  const {
    confirm,
    visible,
    close,
    backdropClose,
    fullScreen,
    mobileFullScreen,
    mobileVertical,
    title,
    content,
    contentComponent,
    loading,
    confirmVariant,
    confirmColor,
    confirmText,
    cancelVariant,
    cancelColor,
    cancelText,
    maxWidth,
    dialogBorder,
    actionFullWidth,
    actionColumn,
    actionColumnReverse,
    buttonSize,
    overrideTheme,
    onClose,
    onConfirm,
    onCancel,
  } = props;
  const basicTheme = useTheme();
  const defaultTheme = createTheme(_.defaultsDeep(basicTheme));
  const isMobileAny = useMediaQuery(defaultTheme.breakpoints.down("sm"));

  const theme = createTheme(
    _.defaultsDeep(
      {
        components: {
          MuiDialog: {
            styleOverrides: {
              paper: {
                border: dialogBorder ? `1px solid ${defaultTheme.palette.border.main}` : "none",
              },
              scrollPaper: {
                alignItems: (isMobileAny && mobileVertical) || "center",
              },
              paperFullScreen: {
                height: isMobileAny && mobileVertical && !mobileFullScreen ? "initial" : "100%",
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& > *": {
                  minHeight: 30,
                },
                "& + .MuiDialogContent-root": {
                  paddingTop: defaultTheme.spacing(3),
                },
              },
            },
          },
          MuiDialogContent: {
            styleOverrides: {
              root: {
                padding: defaultTheme.spacing(3),
              },
            },
          },
          MuiDialogActions: {
            styleOverrides: {
              root: {
                padding: `${basicTheme.spacing(3)} ${basicTheme.spacing(actionFullWidth && !actionColumn ? 2 : 3)}`,
                justifyContent: actionFullWidth ? "center" : "flex-end",
              },
            },
          },
        },
      },
      overrideTheme || defaultTheme
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <MuiDialog
        open={!!visible}
        onClose={backdropClose ? onClose : undefined}
        fullWidth
        fullScreen={fullScreen || (isMobileAny && (!!mobileVertical || mobileFullScreen))}
        maxWidth={maxWidth}
      >
        <>
          {(title || close) && (
            <DialogTitle>
              <>
                {title && typeof title === "string" && (
                  <Box whiteSpace="pre-line">
                    <FormattedMessage id={title} defaultMessage={title} />
                  </Box>
                )}
                {typeof title === "object" && React.isValidElement(title) && title}
                {(typeof title === "function" || (typeof title === "object" && !React.isValidElement(title))) && <title />}
                {close && (
                  <Box position="absolute" right={16} top={16}>
                    <IconButton data-test="dialog-close-btn" onClick={onClose} size="small">
                      <Icon>close</Icon>
                    </IconButton>
                  </Box>
                )}
              </>
            </DialogTitle>
          )}
          {!contentComponent && content && (
            <DialogContent dividers={dialogBorder}>
              <>
                {typeof content === "object" && React.isValidElement(content) && content}
                {(typeof content === "function" || (typeof content === "object" && !React.isValidElement(content))) && content}
                {typeof content === "string" && (
                  <Box whiteSpace="pre-line">
                    <FormattedMessage id={content} defaultMessage={content} />
                  </Box>
                )}
              </>
            </DialogContent>
          )}
          {typeof contentComponent === "object" && React.isValidElement(contentComponent) && contentComponent}
          {(typeof contentComponent === "function" || (typeof contentComponent === "object" && !React.isValidElement(contentComponent))) &&
            contentComponent}
          {!contentComponent && (
            <DialogActions disableSpacing>
              <Box
                display="flex"
                sx={{
                  flexDirection: (actionColumn && "column") || (actionColumnReverse && "column-reverse") || "inherit",
                  margin: !actionColumn ? -8 : `-8px 0`,
                  "& > *": {
                    margin: !actionColumn ? "8px !important" : `8px 0 !important`,
                  },
                }}
                width={actionFullWidth ? 1 : "initial"}
              >
                {confirm && (
                  <Button
                    size={buttonSize || "medium"}
                    data-test="dialog-button-cancel"
                    fullWidth
                    disabled={loading}
                    variant={cancelVariant || "outlined"}
                    color={cancelColor || "secondary"}
                    onClick={onCancel}
                  >
                    <FormattedMessage id={cancelText || "action.cancel"} />
                  </Button>
                )}

                <Button
                  size={buttonSize || "medium"}
                  data-test="dialog-button-confirm"
                  disabled={loading}
                  fullWidth
                  variant={confirmVariant || "contained"}
                  color={confirmColor || "primary"}
                  onClick={onConfirm}
                >
                  {loading && <CircularProgress size={24} />}
                  <FormattedMessage id={confirmText || "action.confirm"} />
                </Button>
              </Box>
            </DialogActions>
          )}
        </>
      </MuiDialog>
    </ThemeProvider>
  );
};

export default Dialog;
