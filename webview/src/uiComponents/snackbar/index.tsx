import React, { useEffect, useState } from "react";
import { Icon, IconButton, Box } from "@mui/material";
import { useSnackbar, SnackbarProvider, SnackbarKey, SnackbarContentCallback } from "notistack";
import _ from "lodash";
import { FormattedMessage } from "react-intl";
import { useTheme, Theme, createTheme, ThemeProvider, styled } from "@mui/material/styles";

export type SnackbarProps = {
  configName?: string;
  themeName?: string;
  /**
   * If `true`, the component is visible.
   * @default false
   */
  visible?: boolean;
  /**
   * If `true`, the component will show close button.
   * @default false
   */
  close?: boolean;
  /**
   * Used to easily display different variant of component.
   * @default default
   */
  variant: "default" | "success" | "error" | "warning" | "info";
  /**
   * The anchor of the component.
   * It will cover defaultAnchorOrigin.
   * vertical: `bottom` || `top`
   * horizontal: `left` || `right`
   * @default { horizontal: left, vertical: bottom }
   */
  anchorOrigin?: {
    vertical: "bottom" | "top";
    horizontal: "left" | "center" | "right";
  };
  /**
   * The icon of the component.
   */
  icon?: string;
  /**
   * The content of the component.
   */
  content?: string | React.FC | null;
  /**
   * Replace the snackbar. Callback used for displaying entirely customized snackbar.
   * @param {string|number} key key of a snackbar
   */
  snackbarComponent?: SnackbarContentCallback;
  /**
   * Callback used for getting action(s). actions are mostly buttons displayed in Snackbar.
   * @param {string|number} key key of a snackbar
   */
  action?: React.ReactNode | ((key: SnackbarKey) => React.ReactNode);
  /**
   * Snackbar stays on the screen, unless it is dismissed (programmatically or through user interaction).
   * @default false
   */
  persist?: boolean;
  /**
   * Ignores displaying multiple snackbars with the same `message`
   * @default false
   */
  preventDuplicate?: boolean;
  /**
   * Hides iconVariant if set to `true`.
   * @default false
   */
  hideIconVariant?: boolean;
  /**
   * The number of milliseconds to wait before automatically calling the
   * `onClose` function. By default snackbars get closed after 5000 milliseconds.
   * Set autoHideDuration to 'null' if you don't want snackbars to automatically close.
   * Alternatively pass `persist: true` in the options parameter of enqueueSnackbar.
   * It will cover defaultAutoHideDuration.
   * @default 3000
   */
  autoHideDuration?: number;
  /**
   * If `true`, the component will only use default background.
   * @default false
   */
  onlyUseDefaultBackground: boolean;
  /**
   * The default anchor of the component.
   * It will covered by anchorOrigin.
   * vertical: `bottom` || `top`
   * horizontal: `left` || `right`
   * @default { horizontal: left, vertical: bottom }
   */
  defaultAnchorOrigin: {
    vertical: "bottom" | "top";
    horizontal: "left" | "center" | "right";
  };
  /**
   * The number of milliseconds to wait before automatically calling the
   * `onClose` function. By default snackbars get closed after 5000 milliseconds.
   * Set autoHideDuration to 'null' if you don't want snackbars to automatically close.
   * Alternatively pass `persist: true` in the options parameter of enqueueSnackbar.
   * It will covered by autoHideDuration.
   * @default 3000
   */
  defaultAutoHideDuration: number;
  /**
   * The color of the component content.
   */
  contentColor?: string;
  /**
   * Callback on snackbar Exited.
   */
  onClose(): void;
  /**
   * Overrides the default theme.
   */
  overrideTheme?: Theme;
};

const SnackbarProviderComponent = styled(SnackbarProvider)(({ theme }) => ({
  color: `${theme.palette.default.contrastText} !important`,
  "&.SnackbarItem-variantSuccess": {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  "&.SnackbarItem-variantError": {
    backgroundColor: `${theme.palette.error.main} !important`,
  },
  "&.SnackbarItem-variantWarning": {
    backgroundColor: `${theme.palette.warning.main} !important`,
  },
  "&.SnackbarItem-variantInfo": {
    backgroundColor: `${theme.palette.info.main} !important`,
  },
}));

const VariantIcon = {
  default: "",
  success: "check_circle",
  info: "info",
  warning: "error",
  error: "cancel",
};

const SnackbarContent = (props: SnackbarProps) => {
  const {
    visible,
    close,
    variant,
    anchorOrigin,
    icon,
    content,
    snackbarComponent,
    action,
    persist,
    preventDuplicate,
    hideIconVariant,
    autoHideDuration,
    onlyUseDefaultBackground,
    defaultAnchorOrigin,
    defaultAutoHideDuration,
    contentColor,
    onClose,
  } = props;
  const [isOpen, setOpen] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const basicTheme = useTheme();

  const onClickDismiss = (key: SnackbarKey) => () => {
    closeSnackbar(key);
  };

  useEffect(() => {
    if (!isOpen) {
      onClose();
    }
  }, [isOpen]);

  useEffect(() => {
    if ((visible && !preventDuplicate) || (preventDuplicate && !isOpen)) {
      setOpen(true);
      enqueueSnackbar(
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex">
            {!hideIconVariant && (icon || VariantIcon[variant]) && (
              <Box
                color={!variant || variant === "default" || !onlyUseDefaultBackground ? contentColor : basicTheme.palette[variant].main}
                display="flex"
                mr={1}
              >
                <Icon fontSize="small">{icon || VariantIcon[variant]}</Icon>
              </Box>
            )}
            <Box color={contentColor}>
              <>
                {typeof content === "object" && React.isValidElement(content) && content}
                {content && (typeof content === "function" || (typeof content === "object" && !React.isValidElement(content))) && content}
                {content && typeof content === "string" && (
                  <Box whiteSpace="pre-line">
                    <FormattedMessage id={content} defaultMessage={content} />
                  </Box>
                )}
              </>
            </Box>
          </Box>
        </Box>,
        {
          variant: onlyUseDefaultBackground ? "default" : variant,
          anchorOrigin: anchorOrigin || defaultAnchorOrigin || { vertical: "bottom", horizontal: "left" },
          persist: persist,
          preventDuplicate: preventDuplicate,
          content: snackbarComponent,
          autoHideDuration: autoHideDuration || defaultAutoHideDuration || 3000,
          action:
            action ||
            (close &&
              function (key) {
                return (
                  <Box color={contentColor}>
                    <IconButton onClick={onClickDismiss(key)} color="inherit">
                      <Icon fontSize="small">close</Icon>
                    </IconButton>
                  </Box>
                );
              }),
          onExited: () => {
            setOpen(false);
          },
        }
      );
    }
  }, [visible, preventDuplicate]);
  return <></>;
};

const Snackbar = (props: SnackbarProps) => {
  const { themeName, overrideTheme } = props;
  const componentTheme = themeName;
  const basicTheme = useTheme();
  const defaultTheme = createTheme(_.defaultsDeep(componentTheme, basicTheme));
  const theme: any = createTheme(
    _.defaultsDeep(
      {
        overrides: {},
      },
      overrideTheme || defaultTheme
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProviderComponent maxSnack={3} hideIconVariant={true}>
        <SnackbarContent {...props}></SnackbarContent>
      </SnackbarProviderComponent>
    </ThemeProvider>
  );
};

export default Snackbar;
